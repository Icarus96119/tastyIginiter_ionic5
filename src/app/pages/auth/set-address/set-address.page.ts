import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';

import { CommonService } from '../../../core/services/common.service';
import { AuthService } from '../../../core/services/auth.service';
import { PrepareLocationRequest } from '../../../core/models/auth';

@Component({
  selector: 'app-set-address',
  templateUrl: './set-address.page.html',
  styleUrls: [ './set-address.page.scss' ],
})
export class SetAddressPage implements OnInit {

  form: FormGroup = this.formBuilder.group({
    houseName: [ '', Validators.compose([ Validators.required ]) ],
    postcode: [ '', Validators.compose([ Validators.required ]) ],
  });

  constructor(
    public formBuilder: FormBuilder,
    public authService: AuthService,
    public commonService: CommonService,
    public router: Router,
    public navController: NavController,
  ) {
  }

  ngOnInit() {
  }

  async setAddress() {
    const loading = await this.commonService.showLoading('Please wait...');
    try {
      const payload: PrepareLocationRequest = {
        postcode: this.form.value.postcode,
        houseName: this.form.value.houseName
      };
      await this.authService.setAddress(payload);
      await this.router.navigate([ '' ], { replaceUrl: true });
    } catch (e) {
      if (e.url.indexOf('https://api.getaddress.io/find') >= 0) {
        await this.commonService.presentAlert('Warning',
          'Your House Name/ Number or Postcode is incorrect, please try again.');
      }
      if (e.error.message.indexOf('expired') >= 0) {
        await this.commonService.presentAlert('Warning', e.error.message);
        await this.router.navigate([ '/login' ], { replaceUrl: true });
      } else {
        await this.commonService.presentAlert('Warning', e.error.message);
      }
    } finally {
      await loading.dismiss();
    }
  }

  async back() {
    await this.navController.pop();
  }

}
