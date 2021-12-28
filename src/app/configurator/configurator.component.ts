import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { take } from 'rxjs/operators';
import { GoogleUser } from '../interfaces/googleUser';
import { Merchant } from '../interfaces/merchant';
import { DataStorageService } from '../services/data-storage.service';
import { DatabaseService } from '../services/database.service';
import { PaypalAuthenticationService } from '../services/paypal.authentication.service';
import { TwitchCommunicationService } from '../services/twitch-communcation.service';

@Component({
  selector: 'app-configurator',
  templateUrl: './configurator.component.html',
  styleUrls: ['./configurator.component.scss']
})
export class ConfiguratorComponent implements OnInit, OnDestroy {
  public preview: any;
  public backgroundColor: any;
  public textColor: any;
  public timerRunning: boolean = false;
  public merchant: Merchant | null;
  public isMerchant: boolean = false;
  user: GoogleUser | null;
  linkGroup = new FormGroup({
    background: new FormControl(''),
    text: new FormControl(''),
    displayTime: new FormControl('8')
  });
  tier3Sub: boolean = false;
  constructor(
    private snackBar: MatSnackBar,
    private storage: DataStorageService,
    private databaseService: DatabaseService,
    private twitchCom: TwitchCommunicationService,
    private paypalService: PaypalAuthenticationService,
    ) { }

  ngOnInit(): void {
    this.user = this.storage.getUser();
    this.merchant = this.storage.getMerchant();
    //this.checkIfMerchant();
    //TODO this might not be needed

    this.formSub();
    this.twitchCom?.isUserSubbed('23035003').subscribe((val: any) => {
      if (parseInt(val.data[0].tier) >= 3000) {
        this.tier3Sub = true;
      }
    });

    if (window.addEventListener) {
      window.addEventListener("storage", this._listener, false);
    }
  }
  private _listener = () => {
    this.user = this.storage.getUser();
  }

  ngOnDestroy(): void {
      window.removeEventListener('storage', this._listener);
  }


  formSub() {
    return this.linkGroup.valueChanges.subscribe(val => {
      this.preview = {
        display_name: this.user?.twitchDisplayName,
        profile_image_url: this.user?.twitchURL,
        url: 'https://material.angular.io/assets/img/examples/shiba2.jpg',
        text: 'This is a comment people could add',
        backgroundColor: this.linkGroup.controls.background.value,
        color: this.linkGroup.controls.text.value,
        time: this.linkGroup.controls.displayTime.value
      }
    });
  }
  onSave(): void {
    if (this.user) {
      const config = {
        user: this.user.twitchLogin,
        id: this.user.twitchId,
        backgroundColor: this.linkGroup.controls.background.value.rgba,
        color: this.linkGroup.controls.text.value.rgba,
        time: this.linkGroup.controls.displayTime.value
      }
      this.databaseService.setConfig(config);
      this.snackBar.open('Your config has been saved', undefined, { duration: 3000 });
    }


  }
  onPreview(): void {
    this.timerRunning = true
    setTimeout(()=> {
      this.timerRunning = false;
    }, parseInt(this.linkGroup.controls.displayTime.value + '000'));
  }
  checkIfMerchant() {
    if (this.merchant?.merchantId === this.user?.twitchId) {
      this.isMerchant = true;
    } else {
      this.databaseService.getConfig().pipe(take(1)).subscribe((config: any) => {
        if (config.payload.data().merchantId === this.user?.twitchId) {
          this.storage.setMerchant(config.payload.data());
          this.isMerchant = true;
        }
      });
    }
  }

  public paypal() {
    this.paypalService.signUp().pipe(take(1)).subscribe((val: any) => {
      console.log(val);
      window.location.href = val.links[1].href;
    });
  }
}
