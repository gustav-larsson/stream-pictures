import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../interfaces/user';
import { DataStorageService } from './data-storage.service';


@Injectable({
  providedIn: 'root'
})
export class TwitchCommunicationService {
  user: User | null = this.storage.getUser();
  userId = this.user?.id.toString();
  constructor(
    private http: HttpClient,
    private storage: DataStorageService) {
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
