import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { User } from '../../models/user.model';
import { auth } from 'firebase/app';
import { LoadingController } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { NavController } from '@ionic/angular';

import * as firebase from 'firebase/app';

@Component({
  selector: 'app-register-member',
  templateUrl: './register-member.page.html',
  styleUrls: ['./register-member.page.scss'],
})
export class RegisterMemberPage implements OnInit {

  fname: string = ""
  lname: string = ""
  address: string = ""
  phone: string = ""
  email: string = ""
  password: string = ""
  cpassword: string = ""

  validations_form: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';
  userData: User = {} as any;

  validation_messages = {
    'firstname': [
      { type: 'required', message: 'Name is required.' }
    ],
    'lastname': [
      { type: 'required', message: 'Name is required.' }
    ],
    'address': [
      { type: 'required', message: 'Address is required.' }
    ],
    'phone': [
      { type: 'required', message: 'Phone Number is required.' }
    ],
    'email': [
      { type: 'required', message: 'Email is required.' },
      { type: 'pattern', message: 'Enter a valid email.' }
    ],
    'password': [
      { type: 'required', message: 'Password is required.' },
      { type: 'minlength', message: 'Password must be at least 6 characters long.' }
    ],
    'cpassword': [
      { type: 'required', message: 'Password is required.' },
      { type: 'minlength', message: 'Password must be at least 6 characters long.' }
    ],
 };

  constructor(
    public userAuth: AngularFireAuth, 
    private loadingCtrl: LoadingController,
    private navCtrl: NavController,
    private formBuilder: FormBuilder
    ) { }

  ngOnInit() {
    this.validations_form = this.formBuilder.group({
      firstname: new FormControl('', Validators.compose([
        Validators.required
      ])),
      lastname: new FormControl('', Validators.compose([
        Validators.required
      ])),
      address: new FormControl('', Validators.compose([
        Validators.required
      ])),
      phone: new FormControl('', Validators.compose([
        Validators.required
      ])),
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])),
      password: new FormControl('', Validators.compose([
        Validators.minLength(6),
        Validators.required
      ])),
      cpassword: new FormControl('', Validators.compose([
        Validators.minLength(6),
        Validators.required
      ])),
    });
  }

  async register(value){
    const email = value.email;
    const password = value.password;
    const cpassword = value.cpassword;
    const fname = value.firstname;
    const lname = value.lastname;
    const address = value.address;
    const phone = value.phone;
    // const { email, password, cpassword } = this
    if(password !== cpassword){
      return console.error("Password dont match!")
    }
    
    try{
      this.loadingCtrl.create({
        keyboardClose: true,
        message: 'Please wait...'
      }).then(loadingEl => {
        const res = this.userAuth.auth.createUserWithEmailAndPassword(email, password)
        .then((newUserCredential: firebase.auth.UserCredential) => {
          firebase
            .firestore().collection('users')
            .doc(`${newUserCredential.user.uid}`)
            .set({ address: address, email: email, firstName: fname, lastName: lname, phoneNumber: phone, point: 0 });
         })
        console.log(res)
        loadingEl.present();
        setTimeout(() => {
          loadingEl.dismiss();
        }, 2000);
        this.navCtrl.navigateForward('/login-main');
      })
    }catch(error){
      console.dir(error)
    }
  }

  goLoginPage(){
    this.navCtrl.navigateForward('/login-main');
  }

  goToRegisMerchant() {
    this.navCtrl.navigateForward('/register-merchant');
  }

}
