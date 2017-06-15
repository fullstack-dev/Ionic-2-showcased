import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import * as firebase from 'firebase';
import {GlobalVars} from '../../providers/globalvars';
import { Storage } from '@ionic/storage';

/*
  Generated class for the AvailabilityPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-availability',
  templateUrl: 'availability.html'
})
export class AvailabilityPage {

  _user;
  userData;
  week;

  constructor(public navCtrl: NavController, public navParams: NavParams,public storage: Storage, public GlobalVars:GlobalVars) {

    this._user = firebase.database().ref('user');

    this.week = ['monday','tuesday','wednesday','thursday','friday','saturday','sunday'];

    GlobalVars.getMyGlobalVar().then((data) =>{
        this.userData = JSON.parse(data);

        if(!this.userData.availability) {
          this.userData.availability = {
            monday: { lower:9, upper:17 },
            tuesday: { lower:9, upper:17 },
            wednesday: { lower:9, upper:17 },
            thursday: { lower:9, upper:17 },
            friday: { lower:9, upper:17 },
            saturday: { lower:9, upper:17 },
            sunday: { lower:9, upper:17 }
          }
        }
    });

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AvailabilityPagePage');
  }

  updateRange() {
    // console.log(this.userData.availability.monday);
  }

  updateAvailability(){
    this.userData.availability = this.userData.availability;
    this.userData.status = 2;
    let refUser = this._user.child(this.userData.userKey).update(this.userData);
    if(refUser) {
        this.storage.set('userData',JSON.stringify(this.userData));
        this.navCtrl.pop();
    }
  }

}
