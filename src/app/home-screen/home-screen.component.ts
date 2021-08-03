import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-home-screen',
  templateUrl: './home-screen.component.html',
  styleUrls: ['./home-screen.component.scss']
})
export class HomeScreenComponent implements OnInit {
  @Input()
  public user: any;
  constructor() { }

  ngOnInit(): void {
  }

}
