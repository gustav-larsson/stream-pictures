import { Component, Input, OnChanges, SimpleChanges } from "@angular/core";
import { environment } from "src/environments/environment";
import { PayPalModule } from "../paypal.module";
import { ButtonsColor, ButtonsLabel, ButtonsLayout, ButtonsShape, OnApproveActions, OnApproveData, OnCancelData, OnErrorData } from "../types/paypal/buttons";
import { OrderRequest } from "../types/paypal/order";
import { PayPalConfig } from "../types/paypal/paypal";

@Component({
  selector: 'app-paypal-button',
  templateUrl: './paypal.component.html'
})
export class PaypalComponent implements OnChanges {

  @Input()
  merchantId: string;

  public showButton: boolean = false;
  width = 220;
  height = 35;
  shape = 'rect' as ButtonsShape;
  color = 'blue' as ButtonsColor;
  label = 'paypal' as ButtonsLabel;
  layout = 'horizontal' as ButtonsLayout;

  order: OrderRequest = {
    intent: 'CAPTURE',
    purchase_units: [{
      custom_id: 'wallet10',
      amount: {
        currency_code: 'USD',
        value: '5'
      }
    }]
  };
  ngOnChanges (changes: SimpleChanges) {
    if (changes.merchantId) {
      this.showButton = false;
      console.log('merchantId', this.merchantId);
      const config: PayPalConfig = {
        clientId: environment.clientId,
        merchantId: this.merchantId
      }
      PayPalModule.init(config);
      this.showButton = true;
    }
  }
  onApprove(data: OnApproveData, actions: OnApproveActions) {

    console.log('Transaction Approved:', data);

    // Captures the trasnaction
    return actions.order.capture().then(details => {

      console.log('Transaction completed by', details);

      // Call your server to handle the transaction
      return Promise.reject('Transaction aborted by the server');
    });
  }

  onCancel(data: OnCancelData) {

    console.log('Transaction Cancelled:', data);
  }

  onError(data: OnErrorData) {

    console.log('Transaction Error:', data);
  }
}
