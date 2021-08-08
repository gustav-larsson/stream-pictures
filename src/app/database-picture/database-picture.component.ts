import { Component, OnInit, Renderer2 } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Suggestion } from '../interfaces/suggestion';

@Component({
  selector: 'app-database-picture',
  templateUrl: './database-picture.component.html',
  styleUrls: ['./database-picture.component.scss']
})
export class DatabasePictureComponent implements OnInit {
  sub: any;
  public user ='caiyth';
  public pictures: any;
  constructor(
    private renderer: Renderer2,
    private route: ActivatedRoute,
    private store: AngularFirestore) { }

  ngOnInit(): void {

    this.renderer.addClass(document.body, 'transparent-background');
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


      }, 8000);
    })
  }

  ngOnDestroy(): void {
    this.renderer.removeClass(document.body, 'transparent-background');
  }
}

