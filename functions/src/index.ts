import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as cookieParser from 'cookie-parser';
import * as crypto from 'crypto';
import * as simpleAuth2 from 'simple-oauth2';
import * as axios from 'axios';

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
const OAUTH_CALLBACK_PATH = '/gettoken';

function twitchOAuth2Client() {
  // Twitch OAuth 2 setup
  // TODO: Configure the `twitch.client_id` and `twitch.client_secret`
  // Google Cloud environment variables.
  const credentials = {
    client: {
      id: functions.config().twitch.client_id,
      secret: functions.config().twitch.client_secret,
    },
    auth: {
      tokenHost: 'https://id.twitch.tv/',
      tokenPath: '/oauth2/token',
    },
  };
  return new simpleAuth2.AuthorizationCode(credentials);
}
/**
 * Redirects the User to the Twitch authentication consent screen.
 *  Also the 'state' cookie is set for later state
 * verification.
 */
export const redirect = functions.https.onRequest((req, res) => {
  const oauth2 = twitchOAuth2Client();
  const scopes = 'user:read:email+openid+analytics:read:games+user:read:broadcast';
  cookieParser()(req, res, () => {
    const state = req.cookies.state || crypto.randomBytes(20).toString('hex');
    console.log('Setting verification state:', state);
    res.cookie('state', state.toString(), {maxAge: 3600000, secure: true, httpOnly: true});
    let redirectUri = oauth2.authorizeURL({
      redirect_uri: `${req.protocol}://${req.get('host')}${OAUTH_CALLBACK_PATH}`,
      scope: scopes,
      state: state,
    });
    console.log('Redirecting to:', redirectUri);
    redirectUri = redirectUri.replace(/%2B/g, '+');
    redirectUri = redirectUri.replace(/oauth/g, 'oauth2');
    redirectUri = redirectUri.replace(/%3A/g, ':');
    res.redirect(redirectUri);
  });
});
export const gettoken = functions.https.onRequest(async (req: any, res: any) => {
  const redirectUri = 'http://localhost:4200/';
  const code = req.query.code;
  try {
    const {data} = await axios.default.post(
        'https://id.twitch.tv/oauth2/token?' +
        `client_id=${functions.config().twitch.client_id}&` +
        `client_secret=${functions.config().twitch.client_secret}&` +
        `code=${code}&` +
        'grant_type=authorization_code&' +
        `redirect_uri=${redirectUri}`
    );
    const userInfo = await getUserInfo(data);
    const id = `twitch:${userInfo._id}`;

    await updateUser(userInfo, id);
    await authenticateUser(userInfo, id);
    const token = await getAuthToken(id);
    res.send(token);
  } catch (err) {
    console.error('getToken error: ', err);
  }
});

const getUserInfo = async (auth: any) => {
  const endpoint = 'https://api.twitch.tv/kraken/user';
  try {
    const {data} = await axios.default.get(endpoint, {
      headers: {
        'Client-ID': functions.config().twitch.client_id,
        'Authorization': `OAuth ${auth.access_token}`,
      },
    });
    return data;
  } catch (err) {
    console.log('getUserInfoError: ', err);
    throw err;
  }
};
const updateUser = async (userInfo: any, id: string) => {
  try {
    return await admin
        .database()
        .ref(`/user/${id}`)
        .set(userInfo);
  } catch (err) {
    console.log('updateUserError: ', err);
    throw err;
  }
};
const authenticateUser = async (userInfo: any, id: string) => {
  try {
    return await admin.auth().updateUser(id, {
      displayName: userInfo.display_name,
    });
  } catch (err) {
    // new user
    try {
      return await admin.auth().createUser({
        uid: id,
        displayName: userInfo.display_name,
      });
    } catch (err) {
      console.log('authenticateUserError: ', err);
      throw err;
    }
  }
};
const getAuthToken = async (id: string) => {
  try {
    const token = await admin.auth().createCustomToken(id);
    return token;
  } catch (err) {
    console.log('getAuthTokenError: ', err);
    throw err;
  }
};

/**
 *  Exchanges a given Twitch auth code passed in the 'code'
 * URL query parameter for a Firebase auth token.
 * The request also needs to specify a 'state' query parameter
 * which will be checked against the 'state' cookie.
 * The Firebase custom auth token, display name, photo URL and
 * Twitch acces token are sent back in a JSONP callback
 * function with function name defined by the 'callback' query parameter.
 */
export const token = functions.https.onRequest((req: any, res: any) => {
  const oauth2 = twitchOAuth2Client();
  try {
    cookieParser()(req, res, () => {
      console.log('Received verification state:', req.cookies.state);
      console.log('Received state:', req.query.state);
      if (!req.cookies.state) {
        throw new Error(
            'State cookie not set or expired. Maybe you took too long to authorize. Please try again.'
        );
      } else if (req.cookies.state !== req.query.state) {
        throw new Error('State validation failed');
      }
      console.log('Received auth code:', req.query.code);
      oauth2.getToken({
        code: req.query.code,
        redirect_uri: 'http://localhost:4200/popup',
      }).then((results: any) => {
        console.log('Auth code exchange result received:', results);

        // We have an Twitch access token and the user identity now.
        const accessToken = results.access_token;
        const twitchUserID = 1;
        const profilePic = 'www.google.com';
        const userName = 'need to do';

        // Create a Firebase account and get the Custom Auth Token.
        createFirebaseAccount(twitchUserID, userName, profilePic, accessToken).then((firebaseToken) => {
          // Serve an HTML page that signs the user in and updates the user profile.
          res.jsonp({token: firebaseToken});
        });
      });
    });
  } catch (error) {
    return res.jsonp({error: error.toString});
  }
});
/**
 * Creates a Firebase account with the given user profile and returns a custom auth token allowing
 * signing-in this account.
 * Also saves the accessToken to the datastore at /twitchAccessToken/$uid
 * @param twitchID
 * @param displayName
 * @param photoURL
 * @param accessToken
 * @return {Promise<string>} The Firebase custom auth token in a promise.
 */

function createFirebaseAccount(twitchID: number, displayName: string, photoURL: string, accessToken: string) {
  // The UID we'll assign to the user.
  const uid = `twitch:${twitchID}`;

  // Save the access token tot he Firebase Realtime Database.
  const databaseTask = admin.database().ref(`/twitchAccessToken/${uid}`)
      .set(accessToken);

  // Create or update the user account.
  const userCreationTask = admin.auth().updateUser(uid, {
    displayName: displayName,
    photoURL: photoURL,
  }).catch((error) => {
    // If user does not exists we create it.
    if (error.code === 'auth/user-not-found') {
      return admin.auth().createUser({
        uid: uid,
        displayName: displayName,
        photoURL: photoURL,
      });
    }
    throw error;
  });

  // Wait for all async task to complete then generate and return a custom auth token.
  return Promise.all([userCreationTask, databaseTask]).then(() => {
    // Create a Firebase custom auth token.
    return admin.auth().createCustomToken(uid).then((token) => {
      console.log('Created Custom token for UID "', uid, '" Token:', token);
      return token;
    });
  });
}
