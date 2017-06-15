import { Component, NgZone } from '@angular/core';
import { NavController,NavParams,ModalController, ToastController} from 'ionic-angular';
import {NativeAudio} from 'ionic-native';
import {ChattingPage} from '../chatting/chatting';
import * as firebase from 'firebase';
import * as _ from 'lodash';

@Component({
  selector: 'page-user-profile',
  templateUrl: 'user-profile.html'
})
export class UserProfilePage {
  userData;
  selectedUserData;
  _post;
  _user;
  recentPost :any;
  isType;
  userKey;
  showcasedItems;
  passionsArrayOfKeys;
  postsLoading:boolean;
  constructor(public navCtrl: NavController,public  toastCtrl:ToastController,public params: NavParams,public modalCtrl: ModalController,public zone: NgZone){
      this.userKey =  this.params.get('userKey');
      this.userData = this.params.get('userData')
      this._post = firebase.database().ref('post');
      this._user = firebase.database().ref('user');
      this.showcasedItems = [];
      this.postsLoading = true;

      console.log(this.userKey);
      this._user.child(this.userKey).on('value',(res)=>{
          this.selectedUserData = res.val();
          if(this.selectedUserData.passions) this.passionsArrayOfKeys = Object.keys(this.selectedUserData.passions);
      },(err)=>{
          console.log(err)
      })

      setTimeout(() =>{
        this._post.orderByChild('userKey').equalTo(this.userKey).on('child_changed',(data) =>{
            this.changeData(data)
        })
        // remove post data
        this._post.orderByChild('userKey').equalTo(this.userKey).on('child_removed',(data) =>{
            this.changeData(data)
        })
        this.getPost()
      },1000)

    }
    getPost()
    {
      this.showcasedItems = [];
      this.postsLoading = true;
      this._post.orderByChild('userKey').equalTo(this.userKey).on('child_added',(data) =>{

        this.zone.run(() => {
            let tempArray = data.val();
            tempArray.id =data.key;

            // Setting the keys for passions
            tempArray.arrayOfKeys = Object.keys(tempArray.passions);

            this.showcasedItems.unshift(tempArray);
            // this.loader.dismiss();
        })
        this.postsLoading = false;
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

    goToChat(data){
      this.navCtrl.parent.parent.push(ChattingPage,{toUserData:data,userData:this.userData})
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

    reportUser () {
      let toast = this.toastCtrl.create({
        message: 'Thank you. One of our moderators will take action.',
        duration: 2000,
        position: 'top'
      });

      toast.present();
    }

  }
