import { Injectable } from '@angular/core';
import firebase from 'firebase/app';
import { AngularFireAuth } from "@angular/fire/auth";
import { Router } from '@angular/router';
import { GoogleUser } from './interfaces/googleUser';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable, of } from 'rxjs';
import { map, switchMap, take, tap } from 'rxjs/operators';
import { DatabaseService } from './services/database.service';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  user$: Observable<GoogleUser | null | undefined> ;
  uid: string;
  userData: any;
  constructor(
    public afAuth: AngularFireAuth, // Inject Firebase auth service
    private router: Router,
    private afs: AngularFirestore,
    private store: DatabaseService
  ) {
    this.user$ = this.afAuth.authState.pipe(
      switchMap(user => {
        if (user) {
          return this.afs.doc<GoogleUser>(`users/${user.uid}`).valueChanges();
        } else {
          return of(null);
        }
      })
    )

    /* Saving user data in localstorage when
    logged in and setting up null when logged out */
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.store.getUser(user);
        this.userData = user;
        this.store.getUser(user).pipe().subscribe((storedUser: any) => {
          console.log('storedUser', storedUser)
          if (storedUser) {
            localStorage.setItem('user', JSON.stringify(storedUser));
          }
        });
        /* this.store.getUser(user).subscribe((storedUser: any) => {
          if (storedUser?.payload?.data()) {
            localStorage.setItem('user', JSON.stringify(storedUser.payload.data()));
          }
        }); */

        //JSON.parse(localStorage.getItem('user'));
      } else {
        localStorage.setItem('user', '');
        //JSON.parse(localStorage.getItem('user'));
      }
    })
  }

  async GoogleAuth() {
    const provider = new firebase.auth.GoogleAuthProvider();
    const credential = await this.afAuth.signInWithPopup(provider);
    return this.updateUserData(credential.user);
  }
  // Sign in with Google
  /* GoogleAuth() {
    return this.AuthLogin(new firebase.auth.GoogleAuthProvider());
  }
 */
  // Auth logic to run auth providers
  AuthLogin(provider: any) {
    return this.afAuth.signInWithPopup(provider)
    .then((result: any) => {
        console.log('You have been successfully logged in!')
    }).catch((error: any) => {
        console.log(error)
    })
  }
  async signOut () {
    await this.afAuth.signOut().then(() => {
      localStorage.removeItem('user');
    });
    return this.router.navigate(['/']);
  }
  public updateUserDataTwitchInfo ( twitchData: any ) {
    this.afAuth.currentUser.then(data  => {
      const uid = data?.uid;
      console.log(data);
      console.log('user2', uid);
      if (uid) {
        const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${uid}`);
        const data = {
          twitchId: twitchData.id,
          twitchLogin: twitchData.login,
          twitchURL: twitchData.profile_image_url,
          twitchEmail: twitchData.email,
          twitchDisplayName: twitchData.display_name
        }
        return userRef.set(data, { merge: true });
      } else {
        return null;
      }
    });
  }
  private updateUserData(user: firebase.User | null | undefined,) {
    // Sets user data to firestore on login
    if (user) {
      const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.uid}`);
      const data = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL
       };
      // this is destructive and replaces the data on the storage unless you use the merge true
      return userRef.set(data, { merge: true });
    } else {
      return of(null)
    }
  }
}
