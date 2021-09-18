import { Component, ElementRef, Inject, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DatabaseService } from '../services/database.service';
import { TwitchValidators } from '../validators/twitch.validator';
import { foundInArrayValidator } from '../validators/found-in-array.validator';
import { DataStorageService } from '../services/data-storage.service';
import { Streamer } from '../interfaces/streamer';
import { Observable } from 'rxjs';
import { map, startWith, switchMap, take } from 'rxjs/operators';
import { PaypalPaymentService } from '../services/paypal.payment.service';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-send-link',
  templateUrl: './send-link.component.html',
  styleUrls: ['./send-link.component.scss']})
export class SendLinkComponent implements OnInit {
  public user;
  public preview: any;
  public previews: any;
  public text: any;
  public merchantId: string;
  public script: HTMLScriptElement;
  streamer = new FormControl('');
  options = new Array<any>();
  filteredOptions: Observable<Streamer[]>;
  linkGroup: FormGroup;
  sellerPaypalId: string;
  @ViewChild('paypalRef', {static: true}) private paypalRef: ElementRef;

  constructor(
    private storage: DataStorageService,
    private store: DatabaseService,
    private twitchValidator: TwitchValidators,
    private paypalPaymentService: PaypalPaymentService) {
    this.user = this.storage.getUser();

  }

  ngOnInit(): void {
    this.linkGroup = new FormGroup({
      streamer: new FormControl(
        '',
        [Validators.required, foundInArrayValidator(this.options)],
        this.twitchValidator.isSubbed()),
      url: new FormControl('', [Validators.required]),
      text: new FormControl('')
    });
    this.updateAutoComplete();
    this.formSub();
    this.store.getStreamers().subscribe((collection) => {
        collection.forEach((value: any) =>{
          this.options?.push({
            value: value.payload.doc.id.toString(),
            id: value.payload.doc.data().id
          });
        });
    });
  }

  createOrder() {
    return this.store.createOrder(
      {
        userId: this.user?.id,
        display_name: this.user?.display_name,
        profile_image_url: this.user?.profile_image_url,
        url: this.linkGroup.controls.url.value,
        text: this.linkGroup.controls.text.value
      });
  }

  formSub() {
    return this.linkGroup.controls['streamer'].valueChanges.subscribe((streamer: Streamer | string | null) => {
      if (this.instanceOfStreamer(streamer)) {
        this.paypalPaymentService.getPaypalId(streamer.id)
        .pipe(take(1)).subscribe((response: any) => {
          console.log('response', response);
          this.merchantId = response.merchant_id;

          this.paypalPaymentService.getIntegration(response.links[0].href)
          .pipe(take(1)).subscribe((response: any) => {
              console.log('response from integration', response);
              //this.addPaypalButton();
          });
        });
      }
    });
  }
  updateAutoComplete () {
    this.filteredOptions = this.linkGroup.controls['streamer'].valueChanges
    .pipe(
      startWith(''),
      map(value => typeof value === 'string' ? value : value.value),
      map(login => login ? this._filter(login) : this.options.slice())
    );
  }
  instanceOfStreamer(object: any): object is Streamer {
    return object.id !== undefined;
  }
  checkValue(value: any) {
    return value.value;
  }
  private _filter(login: string): Streamer[] {
    const filterValue = login.toLowerCase();

    return this.options.filter(option => option.value.toLowerCase().includes(filterValue));
  }
  onPreview () {
    this.preview = {
      display_name: this.user?.display_name,
      profile_image_url: this.user?.profile_image_url,
      url: this.linkGroup.controls.url.value,
      text: this.linkGroup.controls.text.value
    }
  }

  onSubmit () {
    const dataToSend = {
      display_name: this.user?.display_name,
      profile_image_url: this.user?.profile_image_url,
      url: this.linkGroup.controls.url.value,
      text: this.linkGroup.controls.text.value
    }
    this.store.sendLink(this.linkGroup.controls.streamer.value.value, dataToSend);
    this.clearAllFields();
  }

  clearAllFields () {
    this.linkGroup.controls.url.setValue('');
    this.linkGroup.controls.text.setValue('');
    this.linkGroup.controls.streamer.setValue('');
    this.preview = undefined;
  }
}
