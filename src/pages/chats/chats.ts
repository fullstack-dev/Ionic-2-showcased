import { Component } from '@angular/core';
import { NavController, PopoverController } from 'ionic-angular';
import * as firebase from 'firebase';
import * as _ from 'lodash';
import {GlobalVars} from '../../providers/globalvars';
import {ChattingPage} from '../chatting/chatting';
import {Http, Headers,Response, RequestOptions} from "@angular/http";
import {StatusSwitcher} from '../chats/status-switcher';
/*
  Generated class for the Chats page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-chats',
  templateUrl: 'chats.html'
})
export class ChatsPage {
  segmentSelected;
  _user;
  onlineCollaborators:any;
  onlineCollaboratorsLoading:boolean;
  offlineCollaborators:any;
  offlineCollaboratorsLoading:boolean;
  recentChats;
  recentChatsLoading;
  userData;
  _chats;
  _lastChats;
  constructor(public navCtrl: NavController,public GlobalVars:GlobalVars, private http: Http, public popoverCtrl: PopoverController) {
    this.segmentSelected = 'online';

    this.onlineCollaborators = [];
    this.onlineCollaboratorsLoading = true;

    this.offlineCollaborators = [];
    this.offlineCollaboratorsLoading = true;

    this.recentChats = [];
    this.recentChatsLoading = false;

    this._user = firebase.database().ref('user');
    this._chats = firebase.database().ref('chats');
    this._lastChats = firebase.database().ref('lastchat');

    this.GlobalVars = GlobalVars;
    this.GlobalVars.getMyGlobalVar().then((data) =>{
        this.userData =  JSON.parse(data);
        if(this.userData.passions) this.userData.arrayOfKeys = Object.keys(this.userData.passions);
        if(!this.userData.status) this.userData.status = 0;

        this.loadData();

    })
  }

  ionViewDidLoad() {
    console.log('Hello ChatsPage Page');
  }

  loadData () {
    this.getOnlineCollaborators();
    this.getOfflineCollaborators();
    this.offlineCollaboratorsLoading = true;
    this.onlineCollaboratorsLoading = true;
    this.recentChatsLoading = true;
    this.recentChats = [];

    this._lastChats.child(this.userData.userKey).on('child_added',(res) =>{

        let tempData = res.val();

        let key = res.key;
        this._user.child(key).once('value',(data)=>{
          if(data.val()) {
            tempData.aboutSelf = data.val().aboutSelf;
            tempData.email = data.val().email;
            tempData.fullName = data.val().fullName;
            tempData.profilePic = data.val().profilePic;
            tempData.uid = data.val().uid;
            tempData.userKey = key;
            tempData.status = data.val().status;
            tempData.availability = data.val().availability;
            if(tempData.uid != this.userData.uid) this.recentChats.push(tempData)
          }
        })
        this.recentChatsLoading = false;
    })

  }

  doRefresh(refresher){
      this.loadData();
      refresher.complete();
  }

  presentPopover(myEvent) {
    let popover = this.popoverCtrl.create(StatusSwitcher);
    popover.present({
      ev: myEvent
    });

    popover.onDidDismiss((userData) => {
      if(userData) this.userData = userData;
    })
  }

  getOnlineCollaborators () {

    let headers = new Headers();
    headers.append('Content-Type', 'application/json');

    this.http.post('https://us-central1-showcased-60f52.cloudfunctions.net/getOnlineCollaborators', JSON.stringify(this.userData.passions), {headers: headers})
      .subscribe(res => {
        this.onlineCollaborators = [];
        var response = res.json();

        for (var key in response) {
          let tempArray = response[key];

          // Setting the keys for passions
          if(tempArray.passions) tempArray.arrayOfKeys = Object.keys(tempArray.passions);
          if(tempArray.uid != this.userData.uid) this.onlineCollaborators.unshift(tempArray);
          // this.showcasedItems = this.showcasedItems.sort(function(obj1, obj2) { return obj2.created_at - obj1.created_at; });

        }

        this.onlineCollaboratorsLoading = false;

      }, (err) => {
        console.log(err);
        this.onlineCollaboratorsLoading = false;
      });

  }

  getOfflineCollaborators () {

    let headers = new Headers();
    headers.append('Content-Type', 'application/json');

    this.http.post('https://us-central1-showcased-60f52.cloudfunctions.net/getOfflineCollaborators', JSON.stringify(this.userData.passions), {headers: headers})
      .subscribe(res => {
        this.offlineCollaborators = [];
        var response = res.json();

        for (var key in response) {
          let tempArray = response[key];

          // Setting the keys for passions
          if(tempArray.passions) tempArray.arrayOfKeys = Object.keys(tempArray.passions);
          if(tempArray.uid != this.userData.uid) this.offlineCollaborators.unshift(tempArray);
          // this.showcasedItems = this.showcasedItems.sort(function(obj1, obj2) { return obj2.created_at - obj1.created_at; });


        }
        this.offlineCollaboratorsLoading = false;

      }, (err) => {
        console.log(err);
        this.offlineCollaboratorsLoading = false;
      });

  }

  updateSchedule(){

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
  
}
