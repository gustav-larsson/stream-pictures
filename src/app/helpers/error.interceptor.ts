import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { from, Observable, throwError } from "rxjs";
import { catchError, switchMap, take } from "rxjs/operators";
import { DataStorageService } from "../services/data-storage.service";
import { PaypalAuthenticationService } from "../services/paypal.authentication.service";
import { TwitchAuthenticationService } from "../services/twitch.authentication.service";
import { environment } from "src/environments/environment";
@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(
    private twitchAuthenticationService: TwitchAuthenticationService,
    private paypalAuthenticationService: PaypalAuthenticationService,
    private store: DataStorageService,
    private snackbar: MatSnackBar) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
      return next.handle(request).pipe(catchError(err => {
        if ([401, 403].includes(err.status) && this.twitchAuthenticationService.userValue && request.url.includes('twitch')) {
          // auto logout if 401 or 403 response returned from api
          this.twitchAuthenticationService.refreshToken().pipe(catchError(err => {
            this.snackbar.open('Authorization Expired - returning to login screen', undefined, { duration: 2000 });

            setTimeout(() => {
              this.twitchAuthenticationService.logout();
              this.store.remove('user');
              window.location.reload();
            }, 2000);
            const error = (err && err.error.message) || err.statusText;
            return throwError(error);
          }), take(1)).subscribe();


        }
        if ([401, 403].includes(err.status) && request.url.includes(environment.paypalApiUrl) && !request.url.includes('client_credentials')) {
				  return this.paypalAuthenticationService.getToken().pipe(
            switchMap((val: any) => {
              this.store.set('paypal', val.access_token);
              request = request.clone({
                setHeaders: { Authorization: `Bearer ${val.access_token}` }
              })
              return next.handle(request);
            }))
        } else {
          const error = (err && err.error.message) || err.statusText;
          return throwError(error);
        }
      }));
    }
}
