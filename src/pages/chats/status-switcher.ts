import { Component } from '@angular/core';
import { NavController, ViewController } from 'ionic-angular';
import * as firebase from 'firebase';
import {GlobalVars} from '../../providers/globalvars';
import { Storage } from '@ionic/storage';
import { AvailabilityPage } from '../availability/availability';

@Component({
  selector: 'StatusSwitcher',
  template: `
    <ion-list>
      <ion-list-header>Select your availability</ion-list-header>
      <button ion-item (click)="updateStatus(1)">
        <ion-icon name="notifications" color="secondary"></ion-icon>
        Available now
      </button>
      <button ion-item (click)="updateStatus(0)">
        <ion-icon name="notifications-off" color="danger"></ion-icon>
        Not available
      </button>
      <button ion-item text-wrap (click)="updateStatus(2)">
        <ion-icon name="time"></ion-icon>
        Scheduled availability
      </button>
      <button icon-left ion-item text-wrap (click)="goToAvailabilityPage()">
        <ion-icon name="options"></ion-icon> Edit scheduled availability
      </button>
    </ion-list>
  `
})
export class StatusSwitcher {
  _user;
  userData;
  constructor(public viewCtrl: ViewController, public navCtrl: NavController, public GlobalVars:GlobalVars,public storage: Storage) {
    this._user = firebase.database().ref('user');

    GlobalVars.getMyGlobalVar().then((data) =>{
        this.userData = JSON.parse(data);
    });
  }

  updateStatus(status){
    this.userData.status = status;
    let refUser = this._user.child(this.userData.userKey).update(this.userData);
    if(refUser) {
         this.storage.set('userData',JSON.stringify(this.userData));
         this.viewCtrl.dismiss(this.userData);
    }
  }

  goToAvailabilityPage () {
    this.navCtrl.push(AvailabilityPage);
    this.viewCtrl.dismiss(this.userData);
  }

}
