import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Suggestion } from '../interfaces/suggestion';
import { User } from '../interfaces/user';
import { DataStorageService } from './data-storage.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireFunctions } from '@angular/fire/functions';
import { AngularFireDatabase } from '@angular/fire/database';
@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  user: User | null;
  constructor(
    private store: AngularFirestore,
    private realTimeDatabase: AngularFireDatabase,
    private storage: DataStorageService) {
      this.user = this.storage.getUser();
  }
  sendLink(streamer: string, data: any) {
    this.store.collection(streamer + '-collection').add(data);
  }
  removeFromCollection(suggestion: Suggestion) {
    this.store.collection(this.user?.login + '-collection').doc(suggestion.id).delete();
  }
  addSuggestionToUser(suggestion: Suggestion) {
    if(this.user){
      this.store.collection(this.user.login).add(suggestion);
    }
  }
  getCollection () {
    return this.store.collection(this.user?.login + '-collection');
  }

  setConfig (data:any) {
    this.store.collection('config').doc(this.user?.login).update(data);
  }

  getConfig() {
    return this.store.collection('config').doc(this.user?.login).snapshotChanges();
  }

  getStreamers () {
    return this.store.collection('config').snapshotChanges();
  }

  createOrder (data: any) {
      return this.store.collection('orders').add(data);
  }

  approveOrder (id: string) {
    return this.store.collection('orders').doc(id).snapshotChanges();
  }

  createUser (token: string, user: User) {
    const userRef = this.realTimeDatabase.object(user.id);
    userRef.set(user);
    userRef.set({'token': token});
    /* const callable = this.firebaseFuctions.httpsCallable('twitch-login');
    const data = callable({token: token}).pipe(take(1)).subscribe(() => {
      console.log('User created');
    }) */
  }

  auth (token: string) {
   /*  console.log(token);

    this.firebase.signInWithCustomToken(token)
    .then((userCredential) => {
    // Signed in
    const user = userCredential.user;
      console.log('userLoggedIn', user);
    })
    .catch((error) => {
    console.error('user not logged in', error.code, error.message);
  }); */
  }

  login () {
  }

  parseJwt (token: string) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
  };
}
