import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GoogleUser } from '../interfaces/googleUser';
import { JWT } from '../interfaces/JWT';
import { User } from '../interfaces/user';
import { DataStorageService } from './data-storage.service';


@Injectable({
  providedIn: 'root'
})
export class TwitchCommunicationService {
  user: GoogleUser | null;
  jwt: JWT | null;
  userId: string | undefined;
  constructor(
    private http: HttpClient,
    private storage: DataStorageService) {
      this.user = this.storage.getUser();
      this.jwt = this.storage.getJWT();
      this.userId = this.user?.twitchId?.toString();
  }
  getSubscribers() {
    if(this.user?.twitchId) {
      let params = new HttpParams().set('broadcaster_id', this.user.twitchId.toString());
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
    if (this.user?.twitchId && this.jwt) {
      let params = new HttpParams()
      .set('user_id', this.user.twitchId.toString()).set('broadcaster_id', broadcaster_id);
      let headers = new HttpHeaders()
      .set('Authorization', `Bearer ${this.jwt.access_token}`)
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
