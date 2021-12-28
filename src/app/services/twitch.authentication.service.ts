import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { GoogleUser } from '../interfaces/googleUser';
import { JWT } from '../interfaces/JWT';
import { User } from '../interfaces/user';
import { DataStorageService } from './data-storage.service';


@Injectable({
  providedIn: 'root'
})
export class TwitchAuthenticationService {
  user: GoogleUser | null;
  jwt: JWT | null;
  userId: string | undefined;
  public userValue: GoogleUser | null;

  constructor(
    private http: HttpClient,
    private storage: DataStorageService) {
      this.user = this.storage.getUser();
      this.jwt = this.storage.getJWT();
      this.userId = this.user?.twitchId?.toString()
      this.userValue = this.user;
  }

  refreshToken() {
    return this.http.post(
      'https://id.twitch.tv/oauth2/token--data-urlencode' +
      '?grant_type=refresh_token' +
      '&refresh_token=' + this.jwt?.access_token +
      '&client_id=' + environment.twitchClientId +
      '&client_secret=' + environment.twitchClientSecret, null
    )
  }

  logout() {
    return this.http.post(
      'https://id.twitch.tv/oauth2/revoke' +
      '?client_id=' + environment.twitchClientId +
      '&token='+ this.jwt?.access_token, null
    );
  }
  getSubscribers() {
    if(this.user?.twitchId) {
      let params = new HttpParams().set('broadcaster_id', this.user.twitchId.toString());
      let headers = new HttpHeaders()
      .set('Client-Id', environment.twitchClientId);

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
    if (this.user?.twitchId && this.jwt) {
      let params = new HttpParams()
      .set('user_id', this.user.twitchId.toString()).set('broadcaster_id', broadcaster_id);
      let headers = new HttpHeaders()
      .set('Authorization', `Bearer ${this.jwt.access_token}`)
      .set('Client-Id', environment.twitchClientId);
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
