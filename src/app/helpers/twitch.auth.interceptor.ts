import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { TwitchAuthenticationService } from "../services/twitch.authentication.service";

@Injectable()
export class TwitchAuthInterceptor implements HttpInterceptor {
  constructor(private twitchAuthenticationService: TwitchAuthenticationService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // add auth header with auth token if user is logged in and request is to the api url
    const user = this.twitchAuthenticationService.userValue;
    const isLoggedIn = user && user.token;
    const isApiUrl = request.url.startsWith(environment.twitchApiUrl);
    if (isLoggedIn && isApiUrl) {
      request = request.clone({
        setHeaders: { Authorization: `Bearer ${user?.token}` }
      })
    }
    return next.handle(request);
  }
}
