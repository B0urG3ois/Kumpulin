import { Component, OnInit, ViewChild, ElementRef, Renderer2, AfterViewInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Plugins } from '@capacitor/core';
import { map } from 'rxjs/operators';
import { Storage } from '@ionic/storage';
import { HttpClient } from '@angular/common/http';
import { RegisterMerchantService } from '../../register/register-merchant/register-merchant.service';

@Component({
  selector: 'app-map-modal',
  templateUrl: './map-modal.component.html',
  styleUrls: ['./map-modal.component.scss'],
})
export class MapModalComponent implements OnInit {
 
  latTemp;
  lngTemp;
  lat: number;
  lng: number;
  address: string;
  apikey= "AIzaSyDjcvP9SjkYiFle1pr9-TMWq5PubSGaZ30";
  @ViewChild('map', { static: false }) mapElementRef: ElementRef;

  constructor(private modalCtrl: ModalController,
    private regMerchSvc: RegisterMerchantService,public http: HttpClient, private renderer: Renderer2, private storage: Storage) { }

  ngOnInit() {
    this.getCurrentLocation();
  }

  onCancel(lat: number, lng: number){

    var object = {latitude: lat, longitude: lng}
    console.log("tes",object);
    this.regMerchSvc.addLat(lat);
    this.regMerchSvc.addLng(lng);
    this.modalCtrl.dismiss(object);
  }

  onChooseLocation(event: any){
    this.lat = event.coords.lat;
    this.lng = event.coords.lng;
  }

  // ngAfterViewInit() {
  //   this.getGoogleMaps().then((googleMaps) => {
  //     const mapElement = this.mapElementRef.nativeElement;
  //     const map = new googleMaps.Map(mapElement, {
  //       center: { lat: this.lat, lng: this.lng },
  //       zoom: 16,
  //     });
  //     googleMaps.event.addListenerOnce(map, 'idle', () => {
  //       this.renderer.addClass(mapElement, 'visible');
  //     });
  //     const marker = new googleMaps.Marker({ position: { lat: this.lat, lng: this.lng }, map });
  //     console.log(marker);
  //     map.addListener('click', event => {
  //       const selectedCoords = {
  //         lat: event.latLng.lat(),
  //         lng: event.latLng.lng(),
  //       };
  //       this.modalCtrl.dismiss(selectedCoords);
  //     });
  //   }).catch(err => {
  //     console.log(err);
  //   });
  // }

  // private getGoogleMaps(): Promise<any> {
  //   const win = window as any;
  //   const googleModule = win.google;
  //   if (googleModule && googleModule.maps) {
  //     return Promise.resolve(googleModule.maps);
  //   }
  //   return new Promise((resolve, reject) => {
  //     const script = document.createElement('script');
  //     script.src = `https://maps.googleapis.com/maps/api/js?key=${this.apikey}&callback=initMap`;
  //     script.async = true;
  //     script.defer = true;
  //     document.body.appendChild(script);
  //     script.onload = () => {
  //       const loadedGoogleModule = win.google;
  //       if (loadedGoogleModule && loadedGoogleModule.maps) {
  //         resolve(loadedGoogleModule.maps);
  //       } else {
  //         reject('Google maps SDK is not available');
  //       }
  //     };
  //   });
  // }


  

  getCurrentLocation() {
    Plugins.Geolocation.getCurrentPosition().then( result => {
     this.lat = result.coords.latitude;
     this.lng = result.coords.longitude;
     console.log(this.lat);
     console.log(this.lng);

     // calling getAddress function to decode the address

   this.getAddress(this.lat, this.lng).subscribe(decodedAddress => {
       this.address = decodedAddress;
       console.log(this.address);
     });
   });
 }

   // This function makes an http call to google api to decode the cordinates

   private getAddress(lat: number, lan: number) {
     return  this.http
       .get<any>(
         `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lan}&key=${
           this.apikey
         }&callback=initMap`
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
}
