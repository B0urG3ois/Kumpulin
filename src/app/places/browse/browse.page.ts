import { Data } from './../../interface/browser.model';
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Plugins } from "@capacitor/core";
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';
import { map, timeout } from "rxjs/operators";
import { BrowseService } from './browse.service';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage'
import { Place, PlaceMapModel } from '../../models/place.model';
import { ToastController, LoadingController } from '@ionic/angular';
import { google } from "google-maps";
import { BehaviorSubject } from 'rxjs';


// @Component({
//   selector: 'select-example',
//   templateUrl: 'select-example.html',
//   styleUrls: ['./select-example.css'],
// })
// export class SelectExample {
//   customAlertOptions: any = {
//     header: 'Pizza Toppings',
//     subHeader: 'Select your toppings',
//     message: '$1.00 per topping',
//     translucent: true
//   };

//   customPopoverOptions: any = {
//     header: 'Hair Color',
//     subHeader: 'Select your hair color',
//     message: 'Only select your dominant hair color'
//   };

//   customActionSheetOptions: any = {
//     header: 'Colors',
//     subHeader: 'Select your favorite color'
//   };
// }

@Component({
  selector: 'select-browse',
  templateUrl: './browse.page.html',
  styleUrls: ['./browse.page.scss'],
})
export class BrowsePage implements OnInit {

  google : google;

  public lat: number;
  public lng: number;
  address: string;
  userEmail: string;
  addressMarker: string;
  result: any;
  distance: any;
  duration:any;
  apikey= "AIzaSyDjcvP9SjkYiFle1pr9-TMWq5PubSGaZ30";
  tes: Data[];
  tempData: PlaceMapModel
  i: number;
  hasil:any;
  data:[];
  origins:{};


  
  
  destinations = new google.maps.LatLng(-6.2478778, 106.5130372);

  public recommededPlace:PlaceMapModel[] = [];
  public loadedPlaces: PlaceMapModel[];
  constructor(
    private browseSvc: BrowseService,
    private http: HttpClient,
    public toastController: ToastController,
    public loginAuth: AngularFireAuth,
    private loading: LoadingController,
    private router: Router,
    private storage: Storage) { }
    

  ngOnInit() {
    // this.protokol();
  }
  

 ionViewDidEnter(){
  this.countingDistance();
 } 
 ionViewWillLeave(){
  //  this.countingDistance();
   this.recommededPlace = [];
   this.tempData = this.loadedPlaces.reduce(function(prev, current) {     
      return (prev.jarak < current.jarak) ? prev : current
    })
   this.recommededPlace.push(this.tempData);
 }

 protokol(){
  this.storage.ready().then(() => {
    this.storage.get('user_session').then((val) => {
      this.userEmail = val
      console.log(this.userEmail)
    })
  })
  this.origins = new google.maps.LatLng(this.lat,this.lng);
  this.getCurrentLocation();
  this.browseSvc.getAllPlaces().subscribe((places) => {
    // this.loadedPlaces = places; in case kalau behavior subject error nyalain ini
  this.browseSvc.setTempat(places);
  let convert = this.browseSvc.getAllTempat()
  convert.subscribe((result) =>{
    this.loadedPlaces = result;  
  })
  this.origins = new google.maps.LatLng(this.lat,this.lng); 
  var tempDestination;
  for(this.i=0; this.i<this.loadedPlaces.length ; ){
     tempDestination = new google.maps.LatLng(this.loadedPlaces[this.i].coordinateLat,this.loadedPlaces[this.i].coordinateLng);
     this.getDistance(this.origins, tempDestination, this.loadedPlaces[this.i].id);
     this.i++
   }
  this.countingDistance();

})
 }

 countingDistance(){
   this.loadingDulu();
   this.recommededPlace = [];
   this.tempData = this.loadedPlaces.reduce(function(prev, current) {     
      return (prev.jarak < current.jarak) ? prev : current
    })
   this.recommededPlace.push(this.tempData);
  }

  public getDistance(origino: any, destino: any, key: any) {
    var tes = key;

    return new google.maps.DistanceMatrixService()
      .getDistanceMatrix({ 
        'origins': [origino], 
        'destinations': [destino], 
        'travelMode': google.maps.TravelMode.DRIVING, 
        'unitSystem': google.maps.UnitSystem.METRIC }, 
        (results: any) => {
        this.loadedPlaces.find(index => index.id === tes).jarak = (results.rows[0].elements[0].distance.value /1000);
        this.loadedPlaces.find(index => index.id === tes).waktu = results.rows[0].elements[0].duration.text ;
    });
}

   getCurrentLocation() {
      Plugins.Geolocation.getCurrentPosition().then(  result => {
      this.lat = result.coords.latitude;
      this.lng = result.coords.longitude;
      
      // calling getAddress function to decode the address
     this.getAddress(this.lat, this.lng).subscribe(decodedAddress => {
        this.address = decodedAddress;
      });
    });
  
  }

    // This function makes an http call to google api to decode the cordinates

    private getAddress(lat: number, lan: number) {
    return  this.http
        .get<any>(
          `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lan}&key=${
            this.apikey
          }`
        )
        .pipe(
          map(geoData => {
            if (!geoData || !geoData.results || geoData.results === 0) {
              return null;
            }
            return geoData.results[0].formatted_address;
          })
        );
    }
    markerIconUrl() {
       var require: any
      return require('../../../assets/me/standing-man.png')
  }
    
    //  click function to display a toast message with the address
    
   async onMarkerClick(a:number,b:number) {

        ( await this.getAddress(a, b)).subscribe(decodedAddress => {
            this.addressMarker = decodedAddress;
            console.log(this.addressMarker);
          });
          await this.presentToast();
        }      
    
    async presentToast() {
     
      if(this.addressMarker){
        const toast = await this.toastController.create({
          message: this.addressMarker,
          animated:true,
          mode:"ios",
          position: "middle",
          buttons: [
            {
              icon: "close-circle",
              role: "cancel"
            }
          ]
        });
       await toast.present();
 
      }
     
     
    }
   

  ionViewWillEnter(){
    this.protokol()
    this.countingDistance();
  }

  loadingDulu() {
    this.loading.create({
      keyboardClose: true
    })
    .then(loadingEl => {
      loadingEl.present();
      setTimeout(() => {
        loadingEl.dismiss();
      }, 1700);
    });
  }

  customPopoverOptions: any = {
    header: 'Hair Color',
    subHeader: 'Select your hair color',
    message: 'Only select your dominant hair color'
  };
 
}
