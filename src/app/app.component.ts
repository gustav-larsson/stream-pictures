import { Component, Renderer2 } from '@angular/core';
import { DataStorageService } from './services/data-storage.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  theme: string | null = '';
  constructor(
    private renderer: Renderer2,
    private storage: DataStorageService) {

  }
  ngOnInit() {
    this.theme = this.storage.get('theme');
    if (this.theme) {
      this.renderer.addClass(document.body, 'my-dark-theme');
    }
  }
}

