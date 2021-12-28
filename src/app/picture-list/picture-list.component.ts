import { Component, OnDestroy, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { AuthService } from '../google-auth.service';
import { GoogleUser } from '../interfaces/googleUser';
import { Suggestion } from '../interfaces/suggestion';
import { User } from '../interfaces/user';
import { DataStorageService } from '../services/data-storage.service';
import { DatabaseService } from '../services/database.service';



@Component({
  selector: 'app-picture-list',
  templateUrl: './picture-list.component.html',
  styleUrls: ['./picture-list.component.scss']
})

export class PictureListComponent implements OnInit, OnDestroy {
  user: GoogleUser | null;
  public suggestions: Observable<Suggestion[]>;

  constructor(
    private store: DatabaseService,
    private storage: DataStorageService) {
  }

  ngOnInit() {
    this.user = this.storage.getUser();
    if (this.user) {
      this.suggestions = this.store.getCollection(this.user).valueChanges({ idField: 'id'
      }) as Observable<Suggestion[]>;
    }


    if (window.addEventListener) {
      window.addEventListener("storage", this._listener, false);
    }
  }
  private _listener = () => {
    console.log('storage changed');
    this.user = this.storage.getUser();
    if (this.user) {
      this.suggestions = this.store.getCollection(this.user).valueChanges({ idField: 'id'
      }) as Observable<Suggestion[]>;
    }
  }
  ngOnDestroy(): void {
      window.removeEventListener('storage', this._listener);
  }
  onAccept(suggestion: Suggestion) {
    //this.suggestions.splice(index, 1);
    if (this.user) {
      this.store.removeFromCollection(suggestion);
      this.store.addSuggestionToUser(suggestion);

    }

  }
  onDelete(suggestion: Suggestion) {
    this.store.removeFromCollection(suggestion);
  }
}
