import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { NavController } from '@ionic/angular';
import { Router } from '@angular/router';

import { MenuService } from '../../core/services/menu.service';
import { AuthService } from '../../core/services/auth.service';
import { CommonService } from '../../core/services/common.service';
import { Coupon, Item } from '../../core/models/menu';
import { environment } from '../../../environments/environment';
import { associateArrayToArray } from '../../core/utils/dto.util';

@Component({
  selector: 'app-your-order',
  templateUrl: './your-order.page.html',
  styleUrls: [ './your-order.page.scss' ],
})
export class YourOrderPage implements OnInit {

  serverConfig = environment;
  menuBlankImage = environment.menuBlankImage;
  discount = 0;
  discountType = '';
  delivery = 0;
  currentPrice = 0;
  coupons: Array<Coupon>;
  discountCode = '';
  discountApplied = false;

  constructor(
    public menuService: MenuService,
    public authService: AuthService,
    public storage: Storage,
    public navController: NavController,
    public commonService: CommonService,
    public router: Router
  ) {
  }

  async ngOnInit() {
    this.coupons = associateArrayToArray(this.menuService.menu.coupons);
    // this.discount = this.menuService.order.discount;
    // this.discountType = this.menuService.order.discountType;
    if (this.menuService.menu.deliveryTotal === 0 || this.menuService.order.totalPrice === 0 && this.menuService.order.totalCount === 0) {
      this.delivery = 0;
    } else {
      if (this.menuService.order.totalPrice >= Number(this.menuService.menu.deliveryTotal)
        && Number(this.menuService.menu.deliveryTotal) !== 0) {
        this.delivery = 0;
      } else {
        this.delivery = Number(this.menuService.menu.deliveryAmount);
      }
    }
    await this.calcPrice();
  }

  async checkOut() {
    if (this.currentPrice === 0) {
      await this.commonService.presentAlert('Warning', 'Your cart is empty.');
      return;
    }
    this.menuService.order.delivery = this.delivery;
    this.menuService.order.currentPrice = this.currentPrice;
    await this.storage.set(environment.storage.order, this.menuService.order);
    await this.router.navigateByUrl('checkout');
  }

  async calcPrice() {
    if (this.menuService.order.totalPrice === 0) {
      this.currentPrice = 0;
      this.menuService.order.discountAmount = 0;
      return;
    }
    if (this.discountType === 'P') {
      this.menuService.order.discountAmount = this.menuService.order.totalPrice / 100 * this.discount;
      this.currentPrice = this.menuService.order.totalPrice / 100 * (100 - this.discount) + this.delivery;
    } else {
      if (this.discountType === 'F') {
        if (this.menuService.order.totalPrice - this.discount + this.delivery < 0) {
          const discount = this.discount;
          this.discountApplied = false;
          if (this.discountCode !== '') {
            await this.commonService.presentAlert('Warning', 'Your discount code can not be applied on orders below £' + discount);
          }
          this.discount = 0;
          this.menuService.order.discountAmount = 0;
          return;
        } else {
          this.currentPrice = this.menuService.order.totalPrice - this.discount + this.delivery;
          this.menuService.order.discountAmount = this.discount;
        }
      } else {
        if (this.menuService.order.totalPrice - this.discount + this.delivery > 0) {
          this.menuService.order.discountAmount = this.discount;
          this.currentPrice = this.menuService.order.totalPrice - this.discount + this.delivery;
        } else {
          this.menuService.order.discountAmount = 0;
          this.currentPrice = 0;
        }
      }
    }
  }

  async couponApply() {
    if (this.discountCode === '') {
      this.discount = 0;
      this.discountType = '';
      this.menuService.order.couponId = 0;
      this.menuService.order.discountAmount = 0;
      this.menuService.order.discount = this.discount;
      this.menuService.order.discountType = this.discountType;
      await this.storage.set(environment.storage.order, this.menuService.order);
      await this.calcPrice();
      await this.commonService.presentAlert('Warning', 'Please set your discount code.');
      return;
    }

    let found = false;
    let coupon: Coupon;
    Object.keys(this.coupons).forEach(i => {
      if (this.coupons[i].code === this.discountCode) {
        found = true;
        coupon = this.coupons[i];
      }
    });

    if (found) {
      const loading = await this.commonService.showLoading('Please wait...');
      try {
        const payload = {
          userId: this.authService.user.id,
          couponId: coupon.couponId
        };
        const res: boolean = await this.menuService.validateCoupon(payload).toPromise();
        this.discountApplied = true;
        this.discountType = coupon.type;
        this.discount = coupon.discount;
        this.menuService.order.discount = this.discount;
        this.menuService.order.discountType = this.discountType;
        this.menuService.order.couponId = coupon.couponId;
        await this.storage.set(environment.storage.order, this.menuService.order);
        await this.calcPrice();
        if (this.discountApplied) {
          await this.commonService.presentAlert('Success', 'Your discount has been applied.');
        }
      } catch (e) {
        if (e.status === 500) {
          await this.commonService.presentAlert('Warning', 'Internal Server Error');
        } else {
          await this.commonService.presentAlert('Warning', e.error.message);
        }
      } finally {
        await loading.dismiss();
      }
    } else {
      this.discount = 0;
      this.discountType = '';
      this.menuService.order.discount = this.discount;
      this.menuService.order.discountType = this.discountType;
      this.menuService.order.couponId = 0;
      await this.storage.set(environment.storage.order, this.menuService.order);
      await this.calcPrice();
      await this.commonService.presentAlert('We’re Sorry', 'Your discount code has expired or is invalid.');
      return;
    }
  }

  async delete(index) {
    Object.keys(this.menuService.order.items).forEach(i => {
      if (Number(i) === index) {
        this.menuService.order.totalPrice -= this.menuService.order.items[i].itemPrice * this.menuService.order.items[i].quantity;
        this.menuService.order.totalCount -= this.menuService.order.items[i].quantity;
      }
    });
    const items: Array<Item> = [];
    Object.keys(this.menuService.order.items).forEach(i => {
      if (Number(i) !== index) {
        items.push(this.menuService.order.items[i]);
      }
    });
    this.menuService.order.items = items;
    if (this.menuService.menu.deliveryTotal === 0 || this.menuService.order.totalPrice === 0 && this.menuService.order.totalCount === 0) {
      this.delivery = 0;
    } else {
      if (this.menuService.order.totalPrice >= Number(this.menuService.menu.deliveryTotal)) {
        this.delivery = 0;
      } else {
        this.delivery = Number(this.menuService.menu.deliveryAmount);
      }
    }
    await this.storage.set(environment.storage.order, this.menuService.order);
    await this.calcPrice();
  }
}
