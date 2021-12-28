import { Component, OnInit } from '@angular/core';
import { AuthService } from '../google-auth.service';

@Component({
  selector: 'app-google-sign-in',
  templateUrl: './google-sign-in.component.html',
  styleUrls: ['./google-sign-in.component.scss']
})
export class GoogleSignInComponent implements OnInit {

  constructor(public authService: AuthService) { }

  ngOnInit(): void {
  }

}
