import { SharedModule } from './../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';


import { IonicModule } from '@ionic/angular';

import { BrowsePage } from './browse.page';
import { AgmCoreModule } from '@agm/core';

const routes: Routes = [
  {
    path: '',
    component: BrowsePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyDjcvP9SjkYiFle1pr9-TMWq5PubSGaZ30',
      libraries: ['geometry']  
    }),
      
      // AgmCoreModule.forRoot({
      //   apiKey: 'AIzaSyCiGmgkM7dne3L8NbnIU2imUVPkZOtVBC4',
      //   }),
    RouterModule.forChild(routes)
  ],
  declarations: [BrowsePage]
})
export class BrowsePageModule {}
