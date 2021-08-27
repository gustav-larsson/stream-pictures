import { Component, forwardRef } from "@angular/core";
import { OnApproveActions, OnApproveData, OnCancelData, OnErrorData } from "../types/paypal/buttons";

export interface OnApprove {
  onApprove(onApproveData: OnApproveData, onApproveActions: OnApproveActions): Promise<void>;
}

/** PayPal processor abstract class */
export abstract class PayPalProcessor implements OnApprove {
  /** Called when the transaction has been approved for the payment to be captured */
  abstract onApprove(data: OnApproveData, actions: OnApproveActions): Promise<void>;
}

@Component({
  selector: 'app-body',
  template: '<wm-paypal [request]="order" (cancel)="onCancel($event)" (error)="onError($event)"></wm-paypal>',
  providers: [ { provide: PayPalProcessor, useExisting: forwardRef(() => AppComponent) }]
})
export class AppComponent implements OnApprove {

  order = {
    purchase_units: [{
      amount: {
        currency_code: 'EUR',
        value: '9.99'
      }
    }]
  };

  onApprove(data: OnApproveData, actions: OnApproveActions) {

    console.log('Transaction Approved:', data);

    // Captures the trasnaction
    return actions.order.capture().then((details: any) => {

      console.log('Transaction completed by', details.payer);

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
