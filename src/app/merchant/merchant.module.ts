import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { MerchantPage } from './merchant.page';

import { PopmenuComponent } from './../components/popmenu/popmenu.component';

const routes: Routes = [
  {
    path: '',
    component: MerchantPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [MerchantPage, PopmenuComponent]
})
export class MerchantPageModule {}
