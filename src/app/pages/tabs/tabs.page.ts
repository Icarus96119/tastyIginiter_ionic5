import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Router } from '@angular/router';

import { MenuService } from '../../core/services/menu.service';
import { CommonService } from '../../core/services/common.service';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: [ './tabs.page.scss' ],
})
export class TabsPage implements OnInit {

  constructor(
    public menuService: MenuService,
    public navController: NavController,
    public commonService: CommonService,
    public router: Router
  ) {
  }

  ngOnInit() {
  }

  async goOrder() {
    if (this.menuService.order.totalPrice > 0) {
      await this.router.navigate([ 'your-order' ]);
      // this.navController.navigateForward('your-order');
    } else {
      await this.commonService.presentAlert('Warning', 'Your cart is empty.');
    }
  }

}
