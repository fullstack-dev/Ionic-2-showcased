import { Component,NgZone } from '@angular/core';
import * as _ from 'lodash';
import * as moment from 'moment';
import * as firebase from 'firebase';
import {MomentModule} from 'angular2-moment/moment.module';
import { NavController,ModalController,ActionSheetController ,ToastController,AlertController,Events,LoadingController}from 'ionic-angular';
import {NativeAudio,Camera} from 'ionic-native';
import { GlobalVars } from '../../providers/globalvars';
import { AddPostPage } from '../add-post/add-post';
import { Storage } from '@ionic/storage';
import { LocationSharePage } from '../location-share/location-share'
import { UserProfilePage } from '../user-profile/user-profile';
import { PassionsPage } from '../passions/passions';
import {Http, Headers,Response, RequestOptions} from "@angular/http";
import { InAppBrowser } from '@ionic-native/in-app-browser';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  userData;
  _post;
  _user;
  _notification;
  showcasedItems :any;
  postsLoading :boolean;
  profilePic;
  isType;
  _onlineUser;
  loader;
  UserProfilePage;
  PassionsPage;
  constructor(private navCtrl: NavController,public modalCtrl: ModalController,private iab: InAppBrowser,private http: Http,private zone: NgZone,public loadingCtrl: LoadingController,public GlobalVars:GlobalVars,public actionSheetCtrl: ActionSheetController,public alertCtrl:AlertController,public storage: Storage,public  toastCtrl:ToastController,public events: Events) {

    // this.loader = this.loadingCtrl.create({
    //   content: 'Please wait...'
    // });
    // this.loader.present();

    this._post = firebase.database().ref('post');
    this._user = firebase.database().ref('user');
    this.UserProfilePage = UserProfilePage;
    this.PassionsPage = PassionsPage;
    //    var scrollRef = new firebase.util.Scroll(this._post,'post');

    this._notification = firebase.database().ref('notification');
    this.showcasedItems = [];
    this.postsLoading = true;
    events.publish('notificationGet:created', 1);

    this.GlobalVars = GlobalVars;

    // this._post.orderByKey().limitToLast(5).on('child_added',(data) =>{
    //   alert('asd')
    // })

  }

  reportUser () {
    let toast = this.toastCtrl.create({
      message: 'Thank you. One of our moderators will take action.',
      duration: 2000,
      position: 'top'
    });

    toast.present();
  }

  reportContent () {
    let toast = this.toastCtrl.create({
      message: 'Thank you. One of our moderators will take action.',
      duration: 2000,
      position: 'top'
    });

    toast.present();
  }

  openItem (item) {
    if(item.url) {
        const browser = this.iab.create(item.url, '_blank');
    } else if(item.uid){
      this.navCtrl.push(UserProfilePage, {userKey:item.userKey, userData:this.userData});
    }
  }

  addPost() {
    if(!this.userData.passions) {
      let toast = this.toastCtrl.create({
        message: 'Please add some passions before you create a new Showcased item.',
        duration: 2000,
        position: 'top'
      });

      toast.present();
    } else {
      let modal = this.modalCtrl.create(AddPostPage,{loginuser:this.userData});
      modal.present();
    }
  }
  ionViewWillEnter(){
    console.log("entering now")
    this.GlobalVars.getMyGlobalVar().then((data) =>{
        this.userData =  JSON.parse(data);
        if(this.userData.passions) this.userData.arrayOfKeys = Object.keys(this.userData.passions);
        this.getPost(null);
    })
  }

  doRefresh(refresher){
      this.getPost(refresher);
  }

  getPost(refresher) {

    if(!this.userData.passions) {
      this.showcasedItems = [];
      this.postsLoading = false;
      return
    };

    let headers = new Headers();
    headers.append('Content-Type', 'application/json');

    this.http.post('https://us-central1-showcased-60f52.cloudfunctions.net/getFeed', JSON.stringify(this.userData.passions), {headers: headers})
      .subscribe(res => {
        this.showcasedItems = [];
        var response = res.json();

        for (var key in response) {
          let tempArray = response[key];

          // Setting the keys for passions
          tempArray.arrayOfKeys = Object.keys(tempArray.passions);

          // Get post user data by userKey
          this._user.child(tempArray.userKey).on('value',(res) =>{
            tempArray.userData = res.val();
            this.showcasedItems.unshift(tempArray);
            // Sort by price high to low
            this.showcasedItems = this.showcasedItems.sort(function(obj1, obj2) { return obj2.created_at - obj1.created_at; });
            this.postsLoading = false;
          })

          if(refresher) refresher.complete();
          // this.loader.dismiss();
        }


      }, (err) => {
        console.log(err);
        this.postsLoading = false;
        if(refresher) refresher.complete();
      });
  }

  changeProfile(){
    let actionSheet = this.actionSheetCtrl.create({
     title: 'Change your profile picture',
     buttons: [
       {
         text: 'Gallery',
         role: 'destructive',
         handler: () => {
            this.openCamera(0)
           console.log('Destructive clicked');
         }
       },{
         text: 'Camera',
         handler: () => {
           this.openCamera(1)
           console.log('Archive clicked');
         }
       },{
         text: 'Cancel',
         role: 'cancel',
         handler: () => {
           console.log('Cancel clicked');
         }
       }
     ]
   });
   actionSheet.present();
  }

  openCamera(type){

    var options = {
      quality: 100,
      destinationType: Camera.DestinationType.DATA_URL,
      sourceType: type,
      allowEdit: true,
      encodingType: Camera.EncodingType.JPEG,
      targetWidth: 500,
      targetHeight: 500,
      saveToPhotoAlbum: false,
	     correctOrientation:true
    };

    Camera.getPicture(options).then((imageData) => {
    // imageData is either a base64 encoded string or a file URI
    // If it's base64:
    this.profilePic = 'data:image/jpeg;base64,' + imageData;

    let confirm = this.alertCtrl.create({
       title: 'Set as profile picture',
       message: "<img src='"+this.profilePic +"' height='200px'>",
       buttons: [
         {
           text: 'Cancle',
           handler: () => {
             console.log('Disagree clicked');
           }
         },
         {
           text: 'Set',
           handler: () => {
             let  currentDate= new Date().toString()
              let tempData = {
                userId : this.userData.uid,
                // userData: this.userData,
                userKey:this.userData.userKey,
                postText: '',
                postImage: this.profilePic,
                postDateTime:currentDate,
                isType:1 // here isType is use for user post type 0 means new post and 1 means user update profile pic
              }

              let res = this._post.push(tempData).key;
              if(res)
              {
                NativeAudio.play('post', () => console.log('uniqueId1 is done playing'));
                let toast = this.toastCtrl.create({
                  message: 'Update Profile successfully',
                  duration: 2000,
                  position: 'top'
                });

                toast.present();
              }
              setTimeout(() =>{
                delete this.userData.profilePic;
                let  tempArray = this.userData;
                tempArray.profilePic = this.profilePic;
                let refUser = this._user.child(this.userData.userKey).update(tempArray);
                if(refUser)
                {
                     this.storage.set('userData',JSON.stringify(tempArray));
                }
                setTimeout(() =>{
                  this.events.publish('changeProfile:created',{});
                },1000)
              },100)
           }
         }
       ]
     });
     confirm.present();


    }, (err) => {
    // Handle error
    });
  }
  userProfile(userKey){
    this.navCtrl.push(UserProfilePage,{userKey:userKey,userData:this.userData})
  }

  goToChatTab () {
    this.navCtrl.parent.select(3);
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
