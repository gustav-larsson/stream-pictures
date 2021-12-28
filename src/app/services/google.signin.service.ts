import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { AngularFireAuth } from '@angular/fire/auth';
import { Observable, of } from 'rxjs';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { GoogleUser } from '../interfaces/googleUser';
import { switchMap } from 'rxjs/operators';
import firebase from 'firebase/app';
@Injectable({
  providedIn: 'root'
})
export class GoogleSigninService {
  user$: Observable<GoogleUser>;
  constructor(
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router
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
   }

   async googleSignin() {
     const provider = new firebase.auth.GoogleAuthProvider();
     const credential = await this.afAuth.signInWithPopup(provider);
     return this.updateUserData(credential.user);
   }

   async signOut () {
     await this.afAuth.signOut();
     return this.router.navigate(['/']);
   }

   private updateUserData({uid, email, displayName, photoURL }: GoogleUser) {
     // Sets user data to firestore on login
    const userRef: AngularFirestoreDocument<GoogleUser> = this.afs.doc(`users/${uid}`);
    const data = {
      uid,
      email,
      displayName,
      photoURL
    };
    // this is destructive and replaces the data on the storage unless you use the merge true
    return userRef.set(data, { merge: true });
  }
}
