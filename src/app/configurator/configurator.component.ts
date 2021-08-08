import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { DataStorageService } from '../services/data-storage.service';

@Component({
  selector: 'app-configurator',
  templateUrl: './configurator.component.html',
  styleUrls: ['./configurator.component.scss']
})
export class ConfiguratorComponent implements OnInit {
  public preview: any;
  public backgroundColor: any;
  public textColor: any;
  user: any;
  linkGroup = new FormGroup({
    background: new FormControl(''),
    pricing: new FormControl(''),
    text: new FormControl(''),
    displayTime: new FormControl('')
  })
  constructor(private storage: DataStorageService) { }

  ngOnInit(): void {
    this.user = this.storage.get('user');

    this.preview = {
      display_name: this.user.display_name,
      profile_image_url: this.user.profile_image_url,
      url: 'https://material.angular.io/assets/img/examples/shiba2.jpg',
      text: 'This is a comment people could add',
      backgroundColor: this.linkGroup.controls.background.value,
      color: this.linkGroup.controls.text.value,
    }
  }
  onSave(): void {

  }
}
