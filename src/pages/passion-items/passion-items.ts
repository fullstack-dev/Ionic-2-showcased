import { Component, NgZone } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import * as firebase from 'firebase';

/*
  Generated class for the PassionItemsPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-passion-items',
  templateUrl: 'passion-items.html'
})
export class PassionItemsPage {

  passion:string;
  showcasedItems:any;
  postsLoading:boolean;
  _post:any;
  _user:any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public zone: NgZone) {
    this.passion =  this.navParams.data;
    this._post = firebase.database().ref('post');
    this._user = firebase.database().ref('user');
    this.showcasedItems = [];
    this.postsLoading = true;
    this.getPost();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PassionItemsPagePage');
  }

  getPost() {
    this.showcasedItems = [];
    this.postsLoading = true;

    setTimeout(() =>{
      this._post.orderByChild(`passions/${this.passion}`).equalTo(true).on('child_added',(data) =>{
          this.postsLoading = false;
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
