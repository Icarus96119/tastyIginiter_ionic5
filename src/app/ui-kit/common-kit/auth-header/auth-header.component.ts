import { Component, Input, OnInit } from '@angular/core';
import { NavController, Platform } from '@ionic/angular';

@Component({
  selector: 'app-auth-header',
  templateUrl: './auth-header.component.html',
  styleUrls: [ './auth-header.component.scss' ],
})
export class AuthHeaderComponent implements OnInit {

  @Input() backGroundColor: string;
  @Input() backUrl: string;
  @Input() isLogo: boolean;
  @Input() signUp: string;
  @Input() isSignIn: boolean;

  constructor(
    public navController: NavController,
    public platform: Platform
  ) {
  }

  ngOnInit() {
  }

  async back() {
    await this.navController.pop();
  }

}
