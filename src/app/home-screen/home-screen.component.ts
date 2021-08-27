import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { take } from 'rxjs/operators';
import { User } from '../interfaces/user';
import { DataStorageService } from '../services/data-storage.service';
import { DatabaseService } from '../services/database.service';
import { TwitchAuthenticationService } from '../services/twitch.authentication.service';

@Component({
  selector: 'app-home-screen',
  templateUrl: './home-screen.component.html',
  styleUrls: ['./home-screen.component.scss']
})
export class HomeScreenComponent implements OnInit {
  @Input()
  public user: User | null;
  @Input()
  public toggle: any;
  public app: string = 'link';
  constructor(
    private storage: DataStorageService,
    private twitchAuthenticationService: TwitchAuthenticationService,
    private databaseService: DatabaseService,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.user = this.storage.getUser();
    this.getUrlParams();
  }
  show(app: string) {
    this.app = app;
  }

  logout() {
    this.twitchAuthenticationService.logout().pipe(take(1)).subscribe(() => {
      this.removeUser();
    });
  }
  public removeUser() {
    this.user = null;
    this.storage.removeUser();
    window.location.reload();
  }

  getUrlParams() {
    this.route.queryParams.forEach(params => {
      if (this.user && this.user.id === params.merchantId) {
        this.databaseService.setConfig(params);
        this.storage.setMerchant(params);
      }
      console.log(params);
    });
  }
}
