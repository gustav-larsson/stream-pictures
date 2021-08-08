import { DOCUMENT } from '@angular/common';
import { Component, EventEmitter, Inject, Input, OnInit, Output, Renderer2 } from '@angular/core';
import { LOCAL_STORAGE, StorageService } from 'ngx-webstorage-service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {
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
    @Inject(LOCAL_STORAGE) private storage: StorageService) {
    if (this.storage.get('user')) {
      this.user = JSON.parse(this.storage.get('user'));
    }
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
  ngOnInit(): void {

  }

  toggleDrawer() {
    this.drawer = !this.drawer;
    this.toggle.emit(this.drawer)
  }
}
