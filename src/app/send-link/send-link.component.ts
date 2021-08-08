import { ThrowStmt } from '@angular/compiler';
import { Component, Inject, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage, AngularFireStorageModule } from '@angular/fire/storage';
import { FormControl, FormGroup } from '@angular/forms';
import { LOCAL_STORAGE, StorageService } from 'ngx-webstorage-service';
import { DatabaseService } from '../services/database.service';

@Component({
  selector: 'app-send-link',
  templateUrl: './send-link.component.html',
  styleUrls: ['./send-link.component.scss']
})
export class SendLinkComponent implements OnInit {
  public user;
  public preview: any;
  public previews: any;
  public text: any;
  linkGroup = new FormGroup({
    streamer: new FormControl(''),
    url: new FormControl(''),
    text: new FormControl('')
  })
  streamer = new FormControl('');
  constructor(
    @Inject(LOCAL_STORAGE) private storage: StorageService,
    private store: DatabaseService) {
    if (this.storage.get('user')) {
      this.user = JSON.parse(this.storage.get('user'));
    }
  }

  ngOnInit(): void {
  }

  onPreview () {
    this.preview = {
      display_name: this.user.display_name,
      profile_image_url: this.user.profile_image_url,
      url: this.linkGroup.controls.url.value,
      text: this.linkGroup.controls.text.value
    }
  }

  onSend () {
    const dataToSend = {
      display_name: this.user.display_name,
      profile_image_url: this.user.profile_image_url,
      url: this.linkGroup.controls.url.value,
      text: this.linkGroup.controls.text.value
    }
    this.store.sendLink(this.linkGroup.controls.streamer.value.toLowerCase(), dataToSend);
    this.clearAllFields();

  }

  clearAllFields () {
    this.linkGroup.controls.url.setValue('');
    this.linkGroup.controls.text.setValue('');
    this.linkGroup.controls.streamer.setValue('');
    this.preview = undefined;
  }
}
