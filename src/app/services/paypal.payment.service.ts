import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";


@Injectable({
  providedIn: 'root'
})
export class PaypalPaymentService {
  token: string;
  bnCode: string;
  constructor(
    private http: HttpClient,
  ) {
  }
  getPaypalId(merchantId: string) {
    return this.http.get(environment.paypalApiUrl + '/v1/customer/partners/' + environment.partnerId + '/merchant-integrations?tracking_id='+ merchantId);
  }
  getIntegration(link: string) {
    return this.http.get(environment.paypalApiUrl + link);
  }
  createOrder() {
    const headers = new HttpHeaders();
    headers
    .set('Content-Type', 'application/json')
    .set('Authorization', 'Bearer '+ this.token)
    .set('PayPal-Partner-Attribution-Id', environment.partnerId);
    const body = {
      "intent": "CAPTURE",
      "purchase_units": [{
        "amount": {
          "currency_code": "USD",
          "value": "100.00"
        },
        "payee": {
          "email_address": "seller@example.com"
        },
        "payment_instruction": {
          "disbursement_mode": "INSTANT",
          "platform_fees": [{
            "amount": {
            "currency_code": "USD",
            "value": "25.00"
            }
          }]
        }
      }]
    };
    const url = 'https://api-m.sandbox.paypal.com/v2/checkout/orders'
    return this.http.post(url,body, { headers:headers });
  }
}
