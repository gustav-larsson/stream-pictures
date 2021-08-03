import { Component, Input, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Suggestion } from '../suggestion';

@Component({
  selector: 'app-database-picture',
  templateUrl: './database-picture.component.html',
  styleUrls: ['./database-picture.component.scss']
})
export class DatabasePictureComponent implements OnInit {
  sub: any;
  public user ='caiyth';
  public pictures: any;
  constructor(private route: ActivatedRoute, private store: AngularFirestore, private _router: Router) { }

  ngOnInit(): void {
    this.sub = this.route.queryParams.forEach(params => {
      this.user = params.user;
      this.pictures = this.store.collection(params.user).valueChanges({ idField: 'id'
      }) as Observable<Suggestion[]>;
    })
    this.pictures.subscribe((array: any)=> {
      console.log('going to delete in 15 seconds');
      setTimeout(()=> {
        array.forEach((suggestion: Suggestion)  => {
          this.store.collection(this.user).doc(suggestion.id).delete();
        });


      }, 15000);
    })
  }

  ngOnDestroy(): void {
  }
}

