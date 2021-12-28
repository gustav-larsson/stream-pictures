import { Component, OnInit } from '@angular/core';
import { AngularFireFunctions } from '@angular/fire/functions';
import { take } from 'rxjs/operators';
import { AuthService } from '../google-auth.service';
import { JWT } from '../interfaces/JWT';
import { DataStorageService } from '../services/data-storage.service';
import { DatabaseService } from '../services/database.service';


@Component({
  selector: 'app-login-screen',
  templateUrl: './login-screen.component.html',
  styleUrls: ['./login-screen.component.scss']
})
export class LoginScreenComponent {

  jwt: JWT | null;
  toggle = true;
  public login = false;
  constructor(
    private storage: DataStorageService,
    private store: DatabaseService,
    private firebaseFunction: AngularFireFunctions,
    public auth: AuthService) { }

  //ngOnInit(): void {
    /* this.user = this.storage.getUser();
    this.jwt = this.storage.getJWT();
    if (this.jwt) {
      this.store.auth(this.jwt.id_token);
      this.store.createUser(this.jwt.access_token, this.user);
      console.log('we got jwt');
      const callable = this.firebaseFunction.httpsCallable('token');
      callable(this.jwt.access_token).pipe(take(1)).subscribe((returnVal) => {
        console.log('onLogin: ',returnVal);
      })

    } */
  //}

  /* onLogin() {
    window.open('https://us-central1-stream-pictures.cloudfunctions.net/redirect', 'name', 'height=585,width=400');
    //window.location.href = 'https://us-central1-stream-pictures.cloudfunctions.net/redirect';
  } */
  /** Callback Data **/
	/* out($event: any): any   {
    this.user = $event;
    this.storage.setUser(this.user);
  } */

  toggleDrawer(event: any) {
    this.toggle = !this.toggle;
  }
}
