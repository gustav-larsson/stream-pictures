import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Suggestion } from '../interfaces/suggestion';
import { User } from '../interfaces/user';
import { DataStorageService } from '../services/data-storage.service';
import { DatabaseService } from '../services/database.service';



@Component({
  selector: 'app-picture-list',
  templateUrl: './picture-list.component.html',
  styleUrls: ['./picture-list.component.scss']
})

export class PictureListComponent implements OnInit {
  user: User | null;
  public suggestions: Observable<Suggestion[]>;

  constructor(
    private store: DatabaseService,
    private storage: DataStorageService) {
  }

  ngOnInit() {
    this.user = this.storage.getUser()
    this.suggestions = this.store.getCollection().valueChanges({ idField: 'id'
  }) as Observable<Suggestion[]>;
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
