import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-picture-viewer',
  templateUrl: './picture-viewer.component.html',
  styleUrls: ['./picture-viewer.component.scss']
})
export class PictureViewerComponent implements OnInit {
  @Input()
  public picture: any = {
    display_name: 'Shalesa',
    profile_image_url: 'https://static-cdn.jtvnw.net/jtv_user_pictures/shalesa-profile_image-d5df5849e82c09a9-300x300.jpeg',
    url: 'https://material.angular.io/assets/img/examples/shiba2.jpg',
    text: 'Someone wanted to show you something'
  };
  constructor() { }

  ngOnInit(): void {
  }

}
