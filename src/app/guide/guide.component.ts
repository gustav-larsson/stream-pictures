import { Component, OnInit } from '@angular/core';
import { User } from '../interfaces/user';
import { DataStorageService } from '../services/data-storage.service';

@Component({
  selector: 'app-guide',
  templateUrl: './guide.component.html',
  styleUrls: ['./guide.component.scss']
})
export class GuideComponent implements OnInit {
  user: User | null
  constructor(private store: DataStorageService) { }

  ngOnInit(): void {
    this.user = this.store.getUser();
  }

}
