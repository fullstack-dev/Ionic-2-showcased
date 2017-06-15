import { Component, NgZone } from '@angular/core';
import { NavController,AlertController ,Events,NavParams,ModalController} from 'ionic-angular';
import {NativeAudio} from 'ionic-native';
import { Service } from '../../providers/service';
import { StartPage} from '../start/start';
import {EditProfilePage} from '../edit-profile/edit-profile';
import {GlobalVars} from '../../providers/globalvars';
import * as firebase from 'firebase';
import * as _ from 'lodash';
import * as moment from 'moment';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'profile-page',
  templateUrl: 'profile.html'
})
export class ProfilePage {
  userData;
  rootPage;
  passionsArrayOfKeys;
  _post;
  _user;
  showcasedItems :any;
  isType;
  _onlineUser;
  postsLoading:boolean;
  constructor(public navCtrl: NavController,public _service:Service, private zone: NgZone,public alertCtrl: AlertController,public GlobalVars:GlobalVars,public storage: Storage,public events: Events,public modalCtrl: ModalController) {
    this._post = firebase.database().ref('post');
    this._user = firebase.database().ref('user');
    this.showcasedItems = [];
    this.postsLoading = true;

    GlobalVars.getMyGlobalVar().then((data) =>{
        this.userData =  JSON.parse(data);
        if(this.userData.passions) this.passionsArrayOfKeys = Object.keys(this.userData.passions);
    })
    events.subscribe('changeProfile:created', (userEventData) => {
      GlobalVars.getMyGlobalVar().then((data) =>{
          this.userData =  JSON.parse(data);
      })
    });

    setTimeout(() =>{
      this._post.orderByChild('userKey').equalTo(this.userData.userKey).on('child_changed',(data) =>{
          this.changeData(data)
      })
      // remove post data
      this._post.orderByChild('userKey').equalTo(this.userData.userKey).on('child_removed',(data) =>{
          this.changeData(data)
      })
      this.getPost()
    },1000)

  }
  getPost()
  {
    this.showcasedItems = [];
    this.postsLoading = true;
    let loginUserID = this.userData.uid
    this._post.orderByChild('userKey').equalTo(this.userData.userKey).on('child_added',(data) =>{

      this.zone.run(() => {
          let tempArray = data.val();
          tempArray.id =data.key;

          // Setting the keys for passions
          tempArray.arrayOfKeys = Object.keys(tempArray.passions);

          this.showcasedItems.unshift(tempArray);
          this.postsLoading = false;
          // this.loader.dismiss();
      })

    })
  }

  changeData(data){
    let res =_.find(this.showcasedItems, function(o) { return o.id == data.key});
    if(res)
    {
      let tempArray = data.val();
      let loginUserID = this.userData.uid
      tempArray.id =data.key;
    }
  }


  editProfile() {
    this.navCtrl.push(EditProfilePage,{userData:this.userData})
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
