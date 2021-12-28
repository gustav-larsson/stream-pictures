import { Inject, Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { LOCAL_STORAGE, StorageService } from 'ngx-webstorage-service';
import { AuthService } from '../google-auth.service';
import { GoogleUser } from '../interfaces/googleUser';
import { JWT } from '../interfaces/JWT';
import { User } from '../interfaces/user';
import { DatabaseService } from './database.service';
@Injectable({
  providedIn: 'root'
})
export class DataStorageService {
  constructor(
    @Inject(LOCAL_STORAGE) private storage: StorageService,
    private afAuth: AngularFireAuth,
    private store: AngularFirestore) {
  }
  setUser(user: any) {
    this.storage.set('user', JSON.stringify(user));
  }
  setJWT(jwt: any) {
    this.storage.set('JWT', JSON.stringify(jwt));
  }

  get(name: string): any | null{
    const data = this.storage.get(name);
    return data;
  }
  getUser(): GoogleUser | null{
    /* return this.afAuth.currentUser.then(data  => {
      const uid = data?.uid;
      const returnData = this.store.collection('user').doc(uid).snapshotChanges();
      console.log('returnData', returnData);
      return returnData;
    }); */
    const data = this.storage.get('user');
    if (data?.email) {
      return data;
    } else {
      this.storage.set('user', '');
      return null;
    }
  }

  getJWT(): JWT | null{
    const data = this.storage.get('JWT');
    if (data) {
      return JSON.parse(data);
    } else {
      return null;
    }
  }

  setMerchant(merchant: any) {
    this.storage.set('merchant', JSON.stringify(merchant))
  }
  getMerchant() {
    const data = this.storage.get('merchant');
    if (data) {
      return JSON.parse(data);
    } else {
      return null;
    }
  }
  set(key: string, value: string) {
    this.storage.set(key, value);
  }
  remove(name: string): void {
    this.storage.remove(name);
  }

  removeUser(): void {
    this.storage.remove('user');
  }
}
