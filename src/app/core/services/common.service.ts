import { Injectable } from '@angular/core';
import { LoadingController, ModalController, ToastController, AlertController } from '@ionic/angular';
import { environment } from '../../../environments/environment';
import { isArray, isObject } from 'util';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor(
    private toastController: ToastController,
    private alertContoller: AlertController,
    private loadingController: LoadingController,
    private modalController: ModalController
  ) {
  }

  async showLoading(message: string) {
    const loading = await this.loadingController.create({ message });
    await loading.present();
    return loading;
  }

  async showToast(message: string, duration = 2000) {
    const toast = await this.toastController.create({
      duration: 2000,
      message
    });
    await toast.present();
  }

  async presentAlert(warning, msg) {
    const alert = await this.alertContoller.create({
      header: warning,
      message: msg,
      buttons: [ 'OK' ]
    });
    await alert.present();
  }

  toCamel(s) {
    return s.replace(/([-_][a-z])/ig, ($1) => {
      return $1.toUpperCase()
        .replace('-', '')
        .replace('_', '');
    });
  }

  keysToCamel(o: any) {
    if (isObject(o)) {
      const n = {};

      Object.keys(o)
        .forEach((k) => {
          n[this.toCamel(k)] = this.keysToCamel(o[k]);
        });
      return n;
    } else if (isArray(o)) {
      return o.map((i) => {
        return this.keysToCamel(i);
      });
    }
    return o;
  }
}
