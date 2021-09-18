import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { TwitchLoginSdkService } from 'twitch-login-sdk';
import { DataStorageService } from '../services/data-storage.service';

@Component({
  selector: 'app-twitch-login',
  templateUrl: './twitch-login-sdk.component.html',
  styleUrls: ['./twitch-login-sdk.component.scss']
})
export class TwitchLoginSdkComponent implements OnInit{
  @Output() callback = new EventEmitter<Object>();
  @Input() label: string = 'Login Twitch';
  @Input() scopes: string = 'user:read:email+openid+analytics:read:games+user:read:broadcast';
  public win: any = {};
  public loading = false;
  public endPoint: string | undefined = undefined;
  constructor(
    private route: ActivatedRoute,
    private storage: DataStorageService,
    private http: HttpClient) { }
  ngOnInit () {
    this.route.queryParams.forEach(params => {
      if (params.code) {
        this.http.post(`https://id.twitch.tv/oauth2/token?client_id=` +
        environment.twitchClientId +
        `&grant_type=authorization_code` +
        `&client_secret=` +
        environment.twitchClientSecret +
        `&code=`+ params.code +
        `&redirect_uri=` +
        environment.twitchRedirect,null).pipe(take(1)).subscribe((returnVal: any)=> {
          this.storage.setJWT(returnVal);
          console.log('returnval: ', returnVal);
          const headers = new HttpHeaders()
          .set('Authorization',  `Bearer ${returnVal.access_token}`)
          .set('Client-ID', environment.twitchClientId)
          this.http.get(
            'https://api.twitch.tv/helix/users?scope=user:read:email',
            { headers: headers }).pipe(take(1)).subscribe((user: any) => {
              this.storage.setUser(user.data[0]);
              location.reload();
            })
        });


      }
    });
  }
  private closeTwitch = () => {
    this.loading = false;
    this.win.close();
  }

  private openWinTwitch = () => new Promise((resolve, reject) => {
    try {
      this.loading = true;
      //this.endPoint = `https://id.twitch.tv/oauth2/authorize?client_id=${environment.twitchClientId}&redirect_uri=${environment.twitchRedirect}&response_type=token%20id_token&scope=${this.scopes}`
      this.endPoint =
      `https://id.twitch.tv/oauth2/authorize?client_id=${environment.twitchClientId}` +
      `&redirect_uri=${environment.twitchRedirect}` +
      `&response_type=code&scope=${this.scopes}` +
      `&claims={"id_token":{"email":null,"email_verified":null},"userinfo":{"picture":null}}`
      let strWindowFeatures = "location=yes,height=620,width=520,scrollbars=no,resizable=no,status=yes";
      /* this.win = window.open(this.endPoint,
        'twitchLoginNav',
        strWindowFeatures
      ); */
      window.location.href = this.endPoint;

      const intervalHash = setInterval(() => {
        try {
          const url = this.win['location'].hash;
          if (url && environment.twitchClientId) {
            const token = url.match(/\#(?:access_token)\=([\S\s]*?)\&/)[1];

            if (token) {
              var req = new XMLHttpRequest();
              req.open('GET', 'https://api.twitch.tv/helix/users?scope=user:read:email', false);
              req.setRequestHeader('Authorization', 'Bearer ' + token);
              req.setRequestHeader('Client-ID', environment.twitchClientId);
              req.send(null);
              if (req.status == 200) {
                if (req.response && JSON.parse(req.response)) {
                  clearInterval(intervalHash)
                  const _response = JSON.parse(req.response);
                  let _data = (_response['data'][0]) ? _response['data'][0] : {};
                  _data['token'] = token
                  this.closeTwitch()
                  resolve(_data)
                }
              } else if (req.status == 401) {
                console.log(`Error ${req.status}`)
                clearInterval(intervalHash)
              }
            }

          } else {
            if (this.win['location']['href'].includes('error')) {
              clearInterval(intervalHash)
              this.closeTwitch()
              reject({
                message: `Error, check your configuration: CLIENT ID, REDIRECT_URL`
              })
            }
          }
        } catch (e) {
          this.loading = false;
        }
      }, 100);

    } catch (e) {
      this.loading = false;
      reject(e)
    }
  })


  openLogin = () => {
    try {
      this.openWinTwitch().then((response: any) => {
        this.callback.emit(response)
      }).catch(err => {
        this.callback.emit(err)
      })
    } catch (e) {
      console.error(e)
    }
  }
}
