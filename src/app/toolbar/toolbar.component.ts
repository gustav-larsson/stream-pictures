import { DOCUMENT } from '@angular/common';
import { Component, EventEmitter, Inject, Input, OnInit, Output, Renderer2 } from '@angular/core';
import { AuthService } from '../google-auth.service';
import { DataStorageService } from '../services/data-storage.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent {
  @Input()
  public hideBack: boolean = false;
  @Input()
  user: any;
  public title = 'Stream Pictures';

  @Output() toggle = new EventEmitter<boolean>();
  drawer = false;
  constructor(
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2,
    private storage: DataStorageService,
    public auth: AuthService) {
    this.user = this.storage.getUser();
  }

  toggleTheme() {
    const theme = this.storage.get('theme');
    if (theme) {
      this.storage.set('theme', '');
    } else {
      this.storage.set('theme', 'light');
    }
    this.document.body.classList.contains('my-dark-theme') ?
    this.renderer.removeClass(document.body, 'my-dark-theme') :
    this.renderer.addClass(document.body, 'my-dark-theme');
  }

  toggleDrawer() {
    this.drawer = !this.drawer;
    this.toggle.emit(this.drawer)
  }
}
