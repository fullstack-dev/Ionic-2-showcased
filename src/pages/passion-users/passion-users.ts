import { Component, NgZone } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import * as firebase from 'firebase';

/*
  Generated class for the PassionUsersPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-passion-users',
  templateUrl: 'passion-users.html'
})
export class PassionUsersPage {

  passion:string;
  users:any;
  usersLoading:boolean;
  _post:any;
  _user:any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public zone: NgZone) {
    this.passion =  this.navParams.data;
    this._user = firebase.database().ref('user');
    this.users = [];
    this.usersLoading = true;
    this.getUsers();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PassionUsersPagePage');
  }

  getUsers() {
    this.users = [];
    this.usersLoading = true;

    setTimeout(() =>{
      this._user.orderByChild(`passions/${this.passion}`).equalTo(true).on('child_added',(data) =>{
          this.usersLoading = false;
          this.zone.run(() => {
              let tempArray = data.val();
              tempArray.id =data.key;

              // Setting the keys for passions
              tempArray.arrayOfKeys = Object.keys(tempArray.passions);

              this.users.unshift(tempArray);
              this.usersLoading = false;
              // this.loader.dismiss();
            })
       })
    },300)
  }

}
