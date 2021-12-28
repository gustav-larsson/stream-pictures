
import { AfterViewInit, Component, ElementRef, Input, OnChanges, OnInit, Renderer2, SimpleChanges, ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

import { Suggestion } from '../interfaces/suggestion';

@Component({
  selector: 'app-picture-viewer',
  templateUrl: './picture-viewer.component.html',
  styleUrls: ['./picture-viewer.component.scss']
})
export class PictureViewerComponent implements OnChanges {
  @Input()
  public suggestion: Suggestion;
  public youtube: string | undefined;
  public showYoutube: boolean = false;
  @ViewChild('one', { static: false }) d1: ElementRef;
  constructor(private sanitizer: DomSanitizer, private renderer: Renderer2) { }
  /* ngOnInit(): void {

      //this.renderer.setAttribute(d1, 'color',)
  } */
  ngOnChanges(event: SimpleChanges) {
    if(event.suggestion) {
      if(this.suggestion.url.includes('youtube')){
          setTimeout(() => {
            this.youtube = this.suggestion.url.replace('watch?v=', 'embed/') + '?autoplay=1';
            this.showYoutube = true;

            let d2 = this.renderer.createElement('iframe');
            this.renderer.setAttribute(d2, 'allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
            this.renderer.setAttribute(d2, 'width', '600');
            this.renderer.setAttribute(d2, 'height', '338');
            this.renderer.setAttribute(d2, 'src', this.youtube);
            this.renderer.setAttribute(d2, 'title', 'YouTube video player');
            this.renderer.setAttribute(d2, 'frameborder', '0');

            this.renderer.appendChild(this.d1.nativeElement, d2);
            console.log('youtube', this.youtube);
          })
      } else {
        this.youtube = undefined;
      }
    }
  }
}
