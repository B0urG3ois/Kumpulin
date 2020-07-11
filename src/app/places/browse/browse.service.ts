import { Origins } from './../../interface/origins.models';
import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Place , PlaceMapModel } from '../../models/place.model';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { Data } from 'src/app/interface/browser.model';

@Injectable({
  providedIn: 'root'
})
export class BrowseService {

  private placeCollections: AngularFirestoreCollection<Place>;
  private dataTemp: Data[] = [
    {
  
    nama: 'gading',
    jarak: null,
    waktu: null,
    alamat:null,
    destinations: [-6.2565775,106.6161383]
  },
  {
 
    nama: 'citra',
    jarak: null,
    waktu: null,
    alamat:null,
    destinations: [-6.2478778,106.5130372]
  },
  {
   
    nama: 'curug',
    jarak: null,
    waktu: null,
    alamat:null,
    destinations: [-6.2710735,106.5896235]
  }
];
  placeObservable: Observable<PlaceMapModel[]>;
  singlePlaceObservable: Observable<Place>;

  constructor(private db: AngularFirestore) {
    this.placeObservable = this.db.collection('places').snapshotChanges().pipe(map(changes => {
      return changes.map((a:any) => {
        const data = a.payload.doc.data();
        const id = a.payload.doc.id;
        const jarak = 0;
        const waktu = 0;

        return{id, ...data, jarak, waktu};
      })
    }));

  }


  

  getAllPlaces(){
    // console.log(this.placeObservable);
    return this.placeObservable;
  }

  getPlace(id: string){
    return this.singlePlaceObservable = this.db.collection('places').doc(id).snapshotChanges().pipe(map(
      (changes) => {
        const data = changes.payload.data() as Place;
        const id = changes.payload.id;

        return{id, ...data};
      }
    ));
}
  getall(){
    return[...this.dataTemp];
  }

  _rekomendasiTempat = new BehaviorSubject<PlaceMapModel[]>([]);

    getAllRekomendasi(){
      return this._rekomendasiTempat.asObservable();
    }
    setSyncRekomendasi(newPlace){
      let convert = this._rekomendasiTempat.asObservable();
      convert.subscribe(( result ) => {
        if(result.length == 0){
          this._rekomendasiTempat.next(newPlace);
          let convert = this._rekomendasiTempat.asObservable();
          convert.subscribe((a) => {
            a.find(o => o.id === newPlace.id).jarak = newPlace.jarak;
            a.find(o => o.id === newPlace.id).waktu = newPlace.waktu;
            
          })

          
        }else {
          let convert = this._rekomendasiTempat.asObservable();
          convert.subscribe((a) => {
            a.find(o => o.id === newPlace.id).jarak = newPlace.jarak;
            a.find(o => o.id === newPlace.id).waktu = newPlace.waktu;
            
          })
          }
      })
    
      //   this._rekomendasiTempat.next({...this._rekomendasiTempat.value, ...newPlace})
      // if(this._rekomendasiTempat.getValue){
      //   this._rekomendasiTempat.next({...this._rekomendasiTempat.value, ...newPlace})
      // }else {
      //   }
      //   this._rekomendasiTempat.next({...this._rekomendasiTempat.value, ...newPlace})
    }

    _tempatSemua = new BehaviorSubject<PlaceMapModel[]>([]);

    getAllTempat(){
      return this._tempatSemua.asObservable();
    }
    setTempat(newPlace){
      // this.getAllTempat()
      // .pipe(take(1))
      // .subscribe((offersArray) => {
      //   this._tempatSemua.next(offersArray.concat(newPlace));
      // });
    
      this._tempatSemua.next(newPlace);
    }
    setJarak(newPlace, key){
      let convert = this._rekomendasiTempat.asObservable();
      convert.subscribe((a) => {
        a.find(o => o.id === key).jarak = newPlace.jarak;
        a.find(o => o.id === key).waktu = newPlace.waktu;
        
      });

    }
  addData(placeData: Place){
    const id = this.db.createId()
    return this.db.collection('places').doc(id).set(placeData)
  }

  addDataTempat(place: Place, id: string){
    return this.db.collection('places').doc(id).set(place)
  }
}
