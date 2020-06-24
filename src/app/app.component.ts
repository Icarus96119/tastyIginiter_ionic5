import { Component } from '@angular/core';
import { FCM } from '@ionic-native/fcm/ngx';
import { Storage } from '@ionic/storage';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import {
  Event as RouterEvent,
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router
} from '@angular/router';

import { CommonService } from './core/services/common.service';
import { AuthService } from './core/services/auth.service';
import { environment } from '../environments/environment.prod';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: [ 'app.component.scss' ]
})
export class AppComponent {

  loading = false;

  constructor(
    public platform: Platform,
    public splashScreen: SplashScreen,
    public statusBar: StatusBar,
    public fcm: FCM,
    public router: Router,
    public storage: Storage,
    public commonService: CommonService,
    public authService: AuthService
  ) {
    this.initializeApp();
    this.router.events.subscribe((e: RouterEvent) => {
      this.navigationInterceptor(e);
    });
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.notificationSetup();
    });
  }

  async notificationSetup() {
    const w: any = window;
    await w.FCMPlugin.requestPushPermissionIOS();
    this.fcm.getToken().then(async (token) => {
      console.log('firebaseToken:', token);
      await this.storage.set(environment.storage.notificationToken, token);
    });
    this.fcm.onTokenRefresh().subscribe(async (token) => {
      console.log('refreshFirebaseToken:', token);
      await this.storage.set(environment.storage.notificationToken, token);
    });
    this.fcm.onNotification().subscribe(async (data) => {
      console.log(data);
      if (data.wasTapped) {
        console.log('Received in background');
        await this.router.navigateByUrl('tabs/order');
      } else {
        console.log('Received in foreground');
        await this.commonService.presentAlert(data.title, data.body);
      }
    });
  }

  navigationInterceptor(event: RouterEvent): void {
    if (event instanceof NavigationStart) {
      if (event.id === 1 && event.url === '/') {
        this.loading = true;
      }
      // this.loading = true;
    }
    if (event instanceof NavigationEnd) {
      this.loading = false;
    }
    // Set loading state to false in both of the below events to hide the spinner in case a request fails
    if (event instanceof NavigationCancel) {
      this.loading = false;
    }
    if (event instanceof NavigationError) {
      this.loading = false;
    }
  }

}
