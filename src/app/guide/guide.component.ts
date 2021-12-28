import { Component, OnInit } from '@angular/core';
import { GoogleUser } from '../interfaces/googleUser';
import { DataStorageService } from '../services/data-storage.service';

@Component({
  selector: 'app-guide',
  templateUrl: './guide.component.html',
  styleUrls: ['./guide.component.scss']
})
export class GuideComponent implements OnInit {
  user: GoogleUser | null
  constructor(private store: DataStorageService) { }

  ngOnInit(): void {
    this.user = this.store.getUser();
  }

}
