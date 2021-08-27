import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../interfaces/user';
import { DataStorageService } from './data-storage.service';


@Injectable({
  providedIn: 'root'
})
export class TwitchAuthenticationService {
  user: User | null = this.storage.getUser();
  userId = this.user?.id.toString();
  public userValue = this.user;
  constructor(
    private http: HttpClient,
    private storage: DataStorageService) {
  }
  refreshToken() {
    return this.http.post(
      'https://id.twitch.tv/oauth2/token--data-urlencode' +
      '?grant_type=refresh_token' +
      '&refresh_token=' + this.user?.token +
      '&client_id=gfe65599d679im8wfulwz8zq9hyjlm' +
      '&client_secret=v9158ddrte7ad0h8d9g4v9cdapx3sn', null
    )
  }

  logout() {
    return this.http.post(
      'https://id.twitch.tv/oauth2/revoke' +
      '?client_id=gfe65599d679im8wfulwz8zq9hyjlm' +
      '&token='+ this.user?.token, null
    );
  }
  getSubscribers() {
    if(this.user) {
      let params = new HttpParams().set('broadcaster_id', this.user.id.toString());
      let headers = new HttpHeaders()
      .set('Client-Id', 'gfe65599d679im8wfulwz8zq9hyjlm');

      this.http.get(
        'https://api.twitch.tv/helix/subscriptions',
        {
          headers: headers,
          params: params,
          responseType: 'json'
        }).subscribe((val) => {
          console.log(val);
      });
    }
  }

  isUserSubbed(broadcaster_id: string) : any {
    if (this.user) {
      let params = new HttpParams()
      .set('user_id', this.user.id.toString()).set('broadcaster_id', broadcaster_id);
      let headers = new HttpHeaders()
      .set('Authorization', `Bearer ${this.user.token}`)
      .set('Client-Id', 'gfe65599d679im8wfulwz8zq9hyjlm');
      return this.http.get(
        'https://api.twitch.tv/helix/subscriptions/user',
        {
          headers: headers,
          params: params,
          responseType: 'json'
        });

    } else {
      return undefined;
    }
  }
}
