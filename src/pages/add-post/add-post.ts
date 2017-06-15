import { Component } from '@angular/core';
import { NavController ,ViewController,ActionSheetController,NavParams,ToastController, LoadingController} from 'ionic-angular';
import { Camera,NativeAudio } from 'ionic-native';
import * as firebase from 'firebase';

// import {NativeAudio} from 'ionic-native';
/*
  Generated class for the AddPost page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-add-post',
  templateUrl: 'add-post.html'
})
export class AddPostPage {
  postData;
  userData;
  _post;
  loader;
  passionArrayOfKeys;
  constructor(public navCtrl: NavController, public viewCtrl: ViewController,public actionSheetCtrl: ActionSheetController,public params:NavParams,public toastCtrl: ToastController, public loadingCtrl: LoadingController) {

    this.postData = {

    }
    this.userData =  this.params.get('loginuser');
    if(this.userData.passions) this.passionArrayOfKeys = Object.keys(this.userData.passions);
    this._post = firebase.database().ref('post')
  }

  ionViewDidLoad() {
    console.log('Hello AddPostPage Page');
  }
  dismiss() {
      this.viewCtrl.dismiss();
  }
  imageShare()
  {
    let actionSheet = this.actionSheetCtrl.create({
     title: 'Choose your image',
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

    // choose image from gallery/camera
  openCamera(type){

    var options = {
      quality: 70,
      destinationType: Camera.DestinationType.DATA_URL,
      sourceType: type,
      allowEdit: true,
      targetWidth: 500,
      targetHeight: 500,
      encodingType: Camera.EncodingType.JPEG,
      saveToPhotoAlbum: false,
	    correctOrientation:true
    };

    Camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64:
      this.postData.image = 'data:image/jpeg;base64,' + imageData;
    }, (err) => {
      // Handle error
    });
  }
  removeImage(){
    delete this.postData.image;
  }

  addPassion (passion) {

    if(!this.postData.passions) {
      this.postData.passions = {};
    }
    this.postData.passions[passion] = true;
  }

  removePassion (passion) {

    delete this.postData.passions[passion];
  }

  togglePassion (passion) {

    if(this.postData.passions && this.postData.passions[passion]) {
      this.removePassion(passion);
    } else {

      if(this.postData.passions && Object.keys(this.postData.passions).length > 2) {

        let toast = this.toastCtrl.create({
          message: 'Maximum of 3 passions allowed.',
          duration: 2000,
          position: 'top'
        });

        toast.present();
        return
      }
      this.addPassion(passion);
    }
  }

  addPost()
  {

      this.loader = this.loadingCtrl.create({ content: 'Uploading your Showcase' });
      this.loader.present();

      let tempData = {
        userId : this.userData.uid,
        userKey:this.userData.userKey,
        description: this.postData.description ? this.postData.description:'',
        image: this.postData.image ? this.postData.image:null,
        url: this.postData.url ? 'http://'+this.postData.url:null,
        created_at:Date.now(),
        passions:this.postData.passions ? this.postData.passions : [],
        isType:0 // here isType is use for user post type 0 means new post and 1 means user update profile pic
      }

      let res = this._post.push(tempData).key;
      if(res) {
        this.loader.dismiss();
        let toast = this.toastCtrl.create({
          message: 'Cool! Nice achievement.',
          duration: 2000,
          position: 'top'
        });
        setTimeout(() =>{
          this.viewCtrl.dismiss();
        },1000)
        toast.present();
      }

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
