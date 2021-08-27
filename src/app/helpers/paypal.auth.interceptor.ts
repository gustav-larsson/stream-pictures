import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { DataStorageService } from "../services/data-storage.service";

@Injectable()
export class PaypalAuthInterceptor implements HttpInterceptor {
  constructor(
    private store: DataStorageService ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // add auth header with auth token if user is logged in and request is to the api url
    const token = this.store.get('paypal');

    const isApiUrl = request.url.startsWith(environment.paypalApiUrl);
    if (isApiUrl && !request.url.includes('client_credentials')) {
        request = request.clone({
          setHeaders: { Authorization: `Bearer ${token}` }
        })
        return next.handle(request);
    } else {
      return next.handle(request);
    }

  }
}
