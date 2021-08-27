import { hostViewClassName } from '@angular/compiler';
import {
  Directive,
  AfterViewInit,
  OnDestroy,
  Optional
} from '@angular/core';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { SendLinkComponent } from '../send-link/send-link.component';



@Directive({
  selector: '[appTabDirective]'
})
export class TabDirective implements AfterViewInit, OnDestroy {
  observable: any;
  sendLink: any;
  constructor(
    @Optional() private autoTrigger: MatAutocompleteTrigger,
    host: SendLinkComponent) {
    this.sendLink = host;
  }
  ngAfterViewInit() {
      this.observable = this.autoTrigger.panelClosingActions.subscribe((x)=> {
          if (this.autoTrigger.activeOption) {
            this.sendLink.linkGroup.controls['streamer'].setValue(this.autoTrigger.activeOption.value);
          }
      })
  }
  ngOnDestroy() {
      this.observable.unsubscribe();
  }
}
