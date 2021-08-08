
import { Component, Input, OnInit, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-picture-viewer',
  templateUrl: './picture-viewer.component.html',
  styleUrls: ['./picture-viewer.component.scss']
})
export class PictureViewerComponent implements OnInit {
  @Input()
  public picture: any;
  constructor() { }

  ngOnInit(): void {
  }

}
