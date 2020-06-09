import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { Facebook } from '@ionic-native/facebook/ngx';

import { environment } from '../../../environments/environment';
import { CommonService } from './common.service';
import { MenuService } from './menu.service';
import { parseToPayload } from '../utils/dto.util';
import { anonParam } from '../utils/api.util';

import { LoginRequest, LoginResponse, PrepareLocationRequest, SignUpRequest, User } from '../models/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user: User;
  token: string;
  isFaceBookLoggedIn = false;

  constructor(
    private http: HttpClient,
    private storage: Storage,
    private router: Router,
    private  commonService: CommonService,
    private menuService: MenuService,
    private fb: Facebook
  ) {
  }

  getToken(): Promise<string> {
    return this.storage.get(environment.storage.token);
  }

  getUser(): Promise<User> {
    return this.storage.get(environment.storage.user);
  }

  async isAuthenticated(): Promise<number> {
    const localUser = await this.getUser();
    const payload = {
      user: localUser
    };
    // tslint:disable-next-line:ban-types
    const res: number = await this.http.post<number>(environment.apiURL + '/auth/validateToken', payload).toPromise();
    return res;
  }

  isLocationExist(): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      // tslint:disable-next-line:no-shadowed-variable
      this.getUser().then(user => {
        if (user.areaId == null || user.areaId === '') {
          resolve(false);
        } else {
          resolve(true);
        }
      }).catch(err => {
        resolve(false);
      });
    });
  }

  async signin(payload: LoginRequest): Promise<LoginResponse> {
    try {
      // tslint:disable-next-line:max-line-length
      const res: LoginResponse = await this.http.post<LoginResponse>(environment.apiURL + '/auth/signIn', parseToPayload(payload), { params: anonParam() }).toPromise();
      this.user = res.user;
      this.token = res.token;
      // save token to the storage
      await this.storage.set(environment.storage.token, res.token);
      await this.storage.set(environment.storage.user, res.user);

      this.menuService.order = {
        totalCount: 0,
        currentPrice: 0,
        totalPrice: 0,
        items: new Array(),
      };
      await this.storage.set(environment.storage.order, this.menuService.order);
      return res;
    } catch (e) {
      throw e;
    }
  }

  async signup(payload: SignUpRequest): Promise<LoginResponse> {
    try {
      // tslint:disable-next-line:max-line-length
      const res: LoginResponse = await this.http.post<LoginResponse>(environment.apiURL + '/auth/signUp', parseToPayload(payload), { params: anonParam() }).toPromise();
      console.log(res);
      this.user = res.user;
      this.token = res.token;
      // save token to the storage
      await this.storage.set(environment.storage.token, res.token);
      await this.storage.set(environment.storage.user, res.user);

      this.menuService.order = {
        totalCount: 0,
        currentPrice: 0,
        totalPrice: 0,
        items: new Array(),
      };
      await this.storage.set(environment.storage.order, this.menuService.order);
      return res;
    } catch (e) {
      throw e;
    }
  }

  async setLocation(beforePayload: PrepareLocationRequest) {
    try {
      // tslint:disable-next-line:max-line-length
      const url = 'https://api.getAddress.io/find/' + beforePayload.postcode + '/' + beforePayload.houseName + '?expand=true&api-key=' + environment.addressKey;
      const addressInfo: any = await this.http.get(url).toPromise();
      const payload = {
        user: this.user,
        address: {
          address1: addressInfo.addresses[0].line_1,
          address2: '',
          postcode: beforePayload.postcode,
          city: addressInfo.addresses[0].town_or_city,
          state: addressInfo.addresses[0].county,
          countryId: (addressInfo.addresses[0].country === 'England') ? '222' : addressInfo.addresses[0].country
        }
      };
      const res: LoginResponse = await this.http.post<LoginResponse>(environment.apiURL + '/auth/setLocation', payload).toPromise();
      this.user = res.user;
      this.token = res.token;
      // save token to the storage
      await this.storage.set(environment.storage.token, res.token);
      await this.storage.set(environment.storage.user, res.user);
      return res;

    } catch (e) {
      throw e;
    }
  }

  async logout() {
    if (this.user.isFacebook === true) {
      await this.fb.logout()
        .then( res => {
          this.storage.clear();
          this.router.navigate([ '/login' ], { replaceUrl: true });
        })
        .catch(e => {
          this.storage.clear();
          this.router.navigate([ '/login' ], { replaceUrl: true });
        });
    } else {
      await this.storage.clear();
      this.user = await this.getUser();
      await this.router.navigate([ '/login' ], { replaceUrl: true });
    }
  }
}
