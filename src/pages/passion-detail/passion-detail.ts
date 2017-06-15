import { Component, NgZone } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import * as firebase from 'firebase';
import {GlobalVars} from '../../providers/globalvars';
import { PassionItemsPage } from '../passion-items/passion-items';
import { PassionUsersPage } from '../passion-users/passion-users';
import { UserProfilePage } from '../user-profile/user-profile';
import { InAppBrowser } from '@ionic-native/in-app-browser';

/*
  Generated class for the PassionDetailPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-passion-detail',
  templateUrl: 'passion-detail.html'
})
export class PassionDetailPage {

  passion:string;
  showcasedItems:any;
  users:any;
  postsLoading:boolean;
  usersLoading:boolean;
  userData:any;
  _post:any;
  _user:any;
  PassionItemsPage:any;
  PassionUsersPage:any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public GlobalVars: GlobalVars, public zone: NgZone,private iab: InAppBrowser) {
    this.passion =  this.navParams.data;
    this._post = firebase.database().ref('post');
    this._user = firebase.database().ref('user');
    this.showcasedItems = [];
    this.users = [];
    this.postsLoading = true;
    this.usersLoading = true;

    this.PassionItemsPage = PassionItemsPage;
    this.PassionUsersPage = PassionUsersPage;

    GlobalVars.getMyGlobalVar().then((data) =>{
        this.userData =  JSON.parse(data);
        this.getPost();
        this.getUsers();
    })

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PassionDetailPagePage');
  }

  openItem (item) {
    if(item.url) {
        const browser = this.iab.create(item.url, '_blank');
    } else if(item.uid){
      this.navCtrl.push(UserProfilePage, {userKey:item.userKey, userData:this.userData});
    }
  }

  getPost() {
    this.showcasedItems = [];
    this.postsLoading = true;
    let loginUserID = this.userData.uid
    setTimeout(() =>{
      this._post.orderByChild(`passions/${this.passion}`).equalTo(true).limitToLast(2).on('child_added',(data) =>{
          this.zone.run(() => {
              let tempArray = data.val();
              tempArray.id =data.key;

              // Get post user data by userKey
              this._user.child(tempArray.userKey).on('value',(res) =>{
                tempArray.userData = res.val()
              })

              // Setting the keys for passions
              tempArray.arrayOfKeys = Object.keys(tempArray.passions);

              this.showcasedItems.unshift(tempArray);
              this.postsLoading = false;
              // this.loader.dismiss();
            })
       })
    },300)
  }

  getUsers() {
    this.users = [];
    this.usersLoading = true;

    setTimeout(() =>{
      this._user.orderByChild(`passions/${this.passion}`).equalTo(true).limitToLast(4).on('child_added',(data) =>{
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

  generateAvatarColor (passion) {

		if(passion){
			var numColors = 19;
	    var hash = 0;
	    if(passion.length == 0) return hash;

	    for(let i = 0; i < passion.length; i++){
	        let char = passion.charCodeAt(i);
	        hash = ((hash<<5)-hash)+char;
	        hash = hash & hash; // Convert to 32bit integer
	    }
	    hash = Math.abs(hash) % numColors;

	    return hash;
		}

  }

}
