import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Suggestion } from '../interfaces/suggestion';
import { User } from '../interfaces/user';
import { DataStorageService } from './data-storage.service';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  user: User | null = this.storage.get('user');
  constructor(private store: AngularFirestore, private storage: DataStorageService) {

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
  getCollection() {
    return this.store.collection(this.user?.login + '-collection');
  }
}
