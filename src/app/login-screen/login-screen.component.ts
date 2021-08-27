import { Component, OnInit } from '@angular/core';
import { DataStorageService } from '../services/data-storage.service';


@Component({
  selector: 'app-login-screen',
  templateUrl: './login-screen.component.html',
  styleUrls: ['./login-screen.component.scss']
})
export class LoginScreenComponent implements OnInit {
  user: any;
  toggle = true;
  constructor(private storage: DataStorageService) { }

  ngOnInit(): void {
    this.user = this.storage.getUser();
  }

  onLogin() {

  }
  /** Callback Data **/
	out($event: any): any   {
    this.user= $event;
    this.storage.setUser(this.user);
  }

  toggleDrawer(event: any) {
    this.toggle = !this.toggle;
  }
}
