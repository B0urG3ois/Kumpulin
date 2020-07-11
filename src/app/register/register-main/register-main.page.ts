import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-register-main',
  templateUrl: './register-main.page.html',
  styleUrls: ['./register-main.page.scss'],
})
export class RegisterMainPage implements OnInit {

  constructor(
    private navCtrl: NavController,
  ) { }

  ngOnInit() {
  }

  goToLoginPage(){
    this.navCtrl.navigateForward('/login-main');
  }

  goToRegisUser(){
    this.navCtrl.navigateForward('/register-member');
  }

  goToRegisMerchant(){
    this.navCtrl.navigateForward('/register-merchant');
  }

}
