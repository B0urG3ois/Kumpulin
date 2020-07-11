import { NgModule } from '@angular/core';
import { AuthGuard } from '../app/services/user/auth.guard';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'places', pathMatch: 'full' , canActivate:[AuthGuard]},
  { path: 'places', loadChildren: './places/places.module#PlacesPageModule', canActivate:[AuthGuard] },
  { path: 'register', loadChildren: './register/register-main/register-main.module#RegisterMainPageModule' },
  { path: 'register-member', loadChildren: './register/register-member/register-member.module#RegisterMemberPageModule' },
  { path: 'register-merchant', loadChildren: './register/register-merchant/register-merchant.module#RegisterMerchantPageModule' },
  { path: 'login', loadChildren: './login/login/login.module#LoginPageModule' },
  { path: 'login-main', loadChildren: './login/login-main/login-main.module#LoginMainPageModule' },
  { path: 'login-member', loadChildren: './login/login-member/login-member.module#LoginMemberPageModule' },
  { path: 'login-merchant', loadChildren: './login/login-merchant/login-merchant.module#LoginMerchantPageModule' },
  { path: 'register-details', loadChildren: './register/register-merchant/register-details/register-details.module#RegisterDetailsPageModule' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
