import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

import { MenuResolver } from './core/resolvers/menu.resolver';
import { LocationResolver } from './core/resolvers/location.resolver';

import { AuthGuard } from './core/guards/auth.guard';

const routes: Routes = [
  {
    path: 'login',
    loadChildren: () => import('./pages/auth/login/login.module').then(m => m.LoginPageModule)
  },
  {
    path: 'forgot-password',
    loadChildren: () => import('./pages/auth/forgot-password/forgot-password.module').then(m => m.ForgotPasswordPageModule)
  },
  {
    path: 'signup',
    loadChildren: () => import('./pages/auth/signup/signup.module').then(m => m.SignupPageModule)
  },
  {
    path: 'set-address',
    loadChildren: () => import('./pages/auth/set-address/set-address.module').then(m => m.SetAddressPageModule)
  },
  {
    path: '',
    loadChildren: () => import('./pages/tabs/tabs.module').then(m => m.TabsPageModule),
    canActivate: [ AuthGuard ],
    resolve: { user: MenuResolver },
  },
  {
    path: 'menu-detail/:id',
    loadChildren: () => import('./pages/menu-deatil/menu-deatil.module').then(m => m.MenuDeatilPageModule),
  },
  {
    path: 'your-order',
    loadChildren: () => import('./pages/your-order/your-order.module').then(m => m.YourOrderPageModule)
  },
  {
    path: 'profile',
    loadChildren: () => import('./pages/profile/profile.module').then(m => m.ProfilePageModule)
  },
  {
    path: 'checkout',
    loadChildren: () => import('./pages/checkout/checkout.module').then(m => m.CheckoutPageModule)
  },
  {
    path: 'order',
    loadChildren: () => import('./pages/order/order.module').then(m => m.OrderPageModule)
  },
  {
    path: 'terms',
    loadChildren: () => import('./pages/terms/terms.module').then(m => m.TermsPageModule)
  },
  {
    path: 'policy',
    loadChildren: () => import('./pages/policy/policy.module').then(m => m.PolicyPageModule)
  },
  {
    path: 'set-location',
    loadChildren: () => import('./pages/auth/set-location/set-location.module').then( m => m.SetLocationPageModule),
    resolve: { user: LocationResolver },
  },

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {
}
