import { Component, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { Observable } from 'rxjs';
import { GoogleUser } from '../interfaces/googleUser';
import { Suggestion } from '../interfaces/suggestion';
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
  private swipeCoord?: [number, number];
  private swipeTime?: number;
  private width?: number;
  //private target: any;
  constructor(
    private renderer: Renderer2,
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


  swipe(e: any, when: string, suggestion: Suggestion): void {
    const coord: [number, number] = [e.changedTouches[0].clientX, e.changedTouches[0].clientY];
    const time = new Date().getTime();
    this.width = e.changedTouches[0].clientX - e.currentTarget.offsetLeft;
    //this.target = e.currentTarget;
    //this.renderer.addClass(e.currentTarget, 'swipe');
    if (when === 'start') {
      this.swipeCoord = coord;
      this.swipeTime = time;
    } else if (when === 'end' && this.swipeCoord && this.swipeTime) {
      const direction = [coord[0] - this.swipeCoord[0], coord[1] - this.swipeCoord[1]];
      const duration = time - this.swipeTime;
      this.renderer.removeStyle(e.currentTarget, 'left');
      if (duration < 1000 //
        && Math.abs(direction[0]) > 30 // Long enough
        && Math.abs(direction[0]) > Math.abs(direction[1] * 3)) { // Horizontal enough
          const swipe = direction[0] < 0 ? 'delete' : 'accept';
          // Do whatever you want with swipe
          if (swipe === 'delete') {
            this.onDelete(suggestion);
          } else if (swipe === 'accept') {
            this.onAccept(suggestion);
          }
          console.log('swipe: ', swipe);
      }
    }
  }
  swipeMove(e: any) {
    e.path.forEach((element: any)=> {
      if(element.tagName === 'MAT-CARD'){
        if (this.width) {
          const position =  e.changedTouches[0].clientX - this.width;
          this.renderer.setStyle(element, 'left', position + 'px');
        }
      }
    });
  }

}
