import { Component, Inject, OnInit } from '@angular/core';
import { LOCAL_STORAGE, StorageService } from 'ngx-webstorage-service';


@Component({
  selector: 'app-login-screen',
  templateUrl: './login-screen.component.html',
  styleUrls: ['./login-screen.component.scss']
})
export class LoginScreenComponent implements OnInit {
  user: any;

  constructor(@Inject(LOCAL_STORAGE) private storage: StorageService) { }

  ngOnInit(): void {
    const savedUser = this.storage.get('user');
    if (savedUser) {
      this.user = JSON.parse(savedUser);
    }
  }

  onLogin() {

  }
  /** Callback Data **/
	out($event: any): any   {
    this.user= $event;
    this.storage.set('user', JSON.stringify(this.user));
  }
}
