import { Component, Inject, Input, OnInit } from '@angular/core';
import { DataStorageService } from '../services/data-storage.service';

@Component({
  selector: 'app-home-screen',
  templateUrl: './home-screen.component.html',
  styleUrls: ['./home-screen.component.scss']
})
export class HomeScreenComponent implements OnInit {
  @Input()
  public user: any;
  @Input()
  public toggle: any;
  public app: string = 'link';
  constructor(private storage: DataStorageService) { }

  ngOnInit(): void {
    this.user = this.storage.get('user');
  }
  show(app: string) {
    this.app = app;
  }
}
