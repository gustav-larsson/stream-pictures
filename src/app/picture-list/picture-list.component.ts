import { Component, HostListener, Inject, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { LOCAL_STORAGE, StorageService } from 'ngx-webstorage-service';
import { Observable } from 'rxjs';
import { Suggestion } from '../suggestion';



@Component({
  selector: 'app-picture-list',
  templateUrl: './picture-list.component.html',
  styleUrls: ['./picture-list.component.scss']
})

export class PictureListComponent implements OnInit {
  user = JSON.parse(this.storage.get('user'));
  public suggestions = this.store.collection(this.user.login + '-collection').valueChanges({ idField: 'id'
}) as Observable<Suggestion[]>;

  constructor(private store: AngularFirestore,
    @Inject(LOCAL_STORAGE) private storage: StorageService) {
  }

  ngOnInit() {
  }
  onAccept(suggestion: Suggestion) {
    //this.suggestions.splice(index, 1);
    this.store.collection(this.user.login + '-collection').doc(suggestion.id).delete();
    this.store.collection(this.user.login).add(suggestion);
  }
  onDelete(suggestion: Suggestion) {
    //this.suggestions.splice(index, 1);
    this.store.collection(this.user.login + '-collection').doc(suggestion.id).delete();
  }
}
