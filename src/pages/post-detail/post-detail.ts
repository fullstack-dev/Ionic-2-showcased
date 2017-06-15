import { Component } from '@angular/core';
import { NavController,NavParams,ModalController} from 'ionic-angular';
import * as firebase from 'firebase';
import * as _ from 'lodash';
import * as moment from 'moment';
import {MomentModule} from 'angular2-moment/moment.module';
import {NativeAudio} from 'ionic-native';
/*
  Generated class for the PostDetail page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-post-detail',
  templateUrl: 'post-detail.html'
})
export class PostDetailPage {
  _post;
  _user;
  postDetail;
  userData;
  _notification;
  constructor(public navCtrl: NavController,public params:NavParams,public modalCtrl: ModalController) {
    this._post = firebase.database().ref('post');
    this._user = firebase.database().ref('user');
    this._notification = firebase.database().ref('notification')
  }

  ionViewWillEnter(){
    let postKey  =  this.params.get('postKey');
    this.userData = this.params.get('userData');
    let loginUserID = this.userData.uid
    this._post.child(postKey).on('value',(data) => {

      let tempArray = data.val();
      tempArray.id =data.key;
      if(tempArray.isType == 2)
      {
        tempArray.mapData = JSON.parse(tempArray.postText);
        tempArray.mapUrl ="https://maps.googleapis.com/maps/api/staticmap?center="+tempArray.mapData.address+"&zoom=13&size=500x200&maptype=roadmap&markers=color:red|label:S|"+tempArray.mapData.lat+","+tempArray.mapData.long
      }
      // Get post user data by userKey
      this._user.child(tempArray.userKey).on('value',(res) =>{
        tempArray.userData = res.val()
      })

      this.postDetail = tempArray;
    })
  }


}
