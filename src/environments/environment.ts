// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  enableLog: true,
  addressKey: 'h8oJpLQObUWNXeSh4vtDiw25701',
  supportPhoneNumber: '07833360935',
  supportDialCode: '+447833360935',

  serverURL: 'https://www.grubsupdev.com/',
  apiURL: 'https://www.grubsupdev.com/api/v1',

  // serverURL: 'http://192.168.108.123/grubsupdev/',
  // apiURL: 'http://192.168.108.123/grubsupdev/api/v1',
  stripeApiKey: 'pk_test_KGSgL4Ccd2oGEKsSYXBF4SD600LfoqUiWa',

  debitCardURL: 'assets/media/debitcards/',
  menuBlankImage: 'https://via.placeholder.com/60',

  // android.useAndroidX=true
  // android.enableJetifier=true

  storage: {
    token: 'token',
    user: 'user',
    order: 'order',
    locations: 'locations',
    notificationToken: 'notificationToken'
  },
  baseColors: {
    burningOrange: '#fc6c35',
    pistachio: '#8FD400'
  },
  stripeElementStyles: {
    style: {
      base: {
        iconColor: '#c4f0ff',
        fontWeight: 500,
        fontFamily: 'Roboto, Open Sans, Segoe UI, sans-serif',
        lineHeight: '22px',
        fontSize: '16px',
        fontSmoothing: 'antialiased',
        ':-webkit-autofill': {
          color: '#fce883',
        },
        '::placeholder': {
          color: '#87BBFD',
        },
      },
      invalid: {
        iconColor: '#FFC7EE',
        color: '#FFC7EE',
      },
    },
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
