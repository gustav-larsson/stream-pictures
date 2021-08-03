import { Component, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  theme: string | null = '';
  constructor(private renderer: Renderer2) {

  }
  ngOnInit() {
    this.theme = window.localStorage.getItem('theme');
    if (this.theme) {
      this.renderer.addClass(document.body, 'my-light-theme');
    }
  }
}

