import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { DataStorageService } from "./data-storage.service";


@Injectable({
  providedIn: 'root'
})
export class PaypalAuthenticationService {
  constructor(
    private http: HttpClient,
    private storage: DataStorageService
  ) {
  }
  getToken(): Observable<Object> {

    let headers = new HttpHeaders()
      .set('Accept', 'application/json')
      .set('Accept-Language', 'en_US')
      .set('Authorization', 'Basic ' + btoa(environment.clientId +':' + environment.secret))
      .set('Content-Type', 'application/x-www-form-urlencoded')
      return this.http.post(environment.paypalApiUrl + '/v1/oauth2/token' + '?grant_type=client_credentials',
      null, {
        headers: headers,
      });

  }
  signUp() {
    let headers = new HttpHeaders()
    .set('Content-Type', 'application/json')
    const id = this.storage.getUser()?.id;
    return this.http.post(environment.paypalApiUrl + '/v2/customer/partner-referrals',
    {
      "tracking_id": id,
      "partner_config_override": {
        "return_url": "https://stream-pictures.web.app/",
        "return_url_description": "the url to return the merchant after the paypal onboarding process."
      },
      "operations": [
      {
        "operation": "API_INTEGRATION",
        "api_integration_preference": {
          "rest_api_integration": {
            "integration_method": "PAYPAL",
            "integration_type": "THIRD_PARTY",
            "third_party_details": {
              "features": [
                "PAYMENT",
                "REFUND",
                "PARTNER_FEE"
             ]
            }
          }
        }
      }
    ],
    "products": [
      "EXPRESS_CHECKOUT"
    ],
    "legal_consents": [
      {
        "type": "SHARE_DATA_CONSENT",
        "granted": true
      }
    ]
    }, {
      headers: headers
    });

  }
}
