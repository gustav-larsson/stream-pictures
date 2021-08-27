import { NgModule, ModuleWithProviders, Inject, Optional } from '@angular/core';
import { PayPalButtonsDirective } from './paypal-button-angular/paypal-button.directive';
import { loadPayPalSdk, PAYPAL_CONFIG, PAYPAL_INSTANCE } from './paypal-button-angular/paypal-factory';
import { PayPal, PayPalConfig } from './types/paypal/paypal';


/** Global script loading promise to be use as initializer */
let $paypal: Promise<PayPal>;

@NgModule({
  declarations: [ PayPalButtonsDirective ],
  exports: [ PayPalButtonsDirective ]
})
export class PayPalModule {

  constructor(@Optional() @Inject(PAYPAL_CONFIG) config: PayPalConfig) {

    if(!config){ throw new Error(`
      PayPal module has not been initialized.
      Make sure to call PayPalModule.init(...) in your root module.
    `);}

    // Triggers the paypal.js API loading asyncronously.
    $paypal = loadPayPalSdk(config);
  }

  static init(config: PayPalConfig): ModuleWithProviders<PayPalModule> {
    return {
      ngModule: PayPalModule,
      providers: [
        /** Provides the global PayPalConfig object */
        { provide: PAYPAL_CONFIG, useValue: config },
        /** Provides the global paypal instance */
        { provide: PAYPAL_INSTANCE, useFactory: () => $paypal }
      ]
    };
  }
}
