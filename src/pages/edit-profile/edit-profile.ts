import { Component } from '@angular/core';
import { NavController,ActionSheetController,LoadingController,NavParams} from 'ionic-angular';
import { ProfilePage } from '../profile/profile';
import { FormBuilder, FormGroup, Validators,AbstractControl } from '@angular/forms';
import { Camera } from 'ionic-native';
import { Service } from '../../providers/service';
import { TabsPage }  from '../tabs/tabs';
import { Storage } from '@ionic/storage';
import * as firebase from 'firebase';

/*
  Generated class for the EditProfile page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-edit-profile',
  templateUrl: 'edit-profile.html'
})
export class EditProfilePage {

  registerForm:any;
  loader:any;
  firstName :AbstractControl;
  userData;
  _user;

  constructor(public navCtrl: NavController, public formBuilder: FormBuilder,private loadingCtrl: LoadingController,public params:NavParams,public actionSheetCtrl: ActionSheetController,public _service:Service,public storage: Storage) {
    this.userData =  this.params.get('userData');
    this._user = firebase.database().ref('user')
  }

  ionViewDidLoad() {
    console.log('Hello EditProfilePage Page');
  }

  uploadImage(imageType) {

    let actionSheet = this.actionSheetCtrl.create({
     title: 'Choose your image',
     buttons: [
       {
         text: 'Gallery',
         role: 'destructive',
         handler: () => {
           this.openCamera(0, imageType)
           console.log('Destructive clicked');
         }
       },{
         text: 'Camera',
         handler: () => {
           this.openCamera(1, imageType)
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
  openCamera(type, imageType){

    var options = {
      quality: 70,
      destinationType: Camera.DestinationType.DATA_URL,
      sourceType: type,
      allowEdit: true,
      encodingType: Camera.EncodingType.JPEG,
      targetWidth: imageType == 'cover' ? 500:500,
      targetHeight: imageType == 'cover' ? 300:500,
      saveToPhotoAlbum: false,
	    correctOrientation:true
    };

    Camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64:
      if(imageType == 'cover') {
          this.userData.coverPhoto = 'data:image/jpeg;base64,' + imageData;
      } else {
          this.userData.profilePic = 'data:image/jpeg;base64,' + imageData;
      }
    }, (err) => {
    // Handle error
    });
  }

  updateProfile(){
    let refUser = this._user.child(this.userData.userKey).update(this.userData);
    if(refUser) {
         this.storage.set('userData',JSON.stringify(this.userData));
         this.navCtrl.pop();
    }
  }
}
