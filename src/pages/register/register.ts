import { Component, ViewChild } from '@angular/core';
import { NavController,ActionSheetController,LoadingController, Slides} from 'ionic-angular';
import { LoginPage } from '../login/login';
import { FormBuilder, FormGroup, Validators,AbstractControl } from '@angular/forms';
import { Camera } from 'ionic-native';
import { Service } from '../../providers/service';
import { TabsPage }  from '../tabs/tabs';
import { Storage } from '@ionic/storage';

 /*
  Generated class for the Register page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-register',
  templateUrl: 'register.html'
})
export class RegisterPage {
  @ViewChild(Slides) slides: Slides;
  registerForm:any;
  loader:any;
  fullName :AbstractControl;
  profileimage:any;
  formSlides:any;
  constructor(public navCtrl: NavController, public formBuilder: FormBuilder,private loadingCtrl: LoadingController,public actionSheetCtrl: ActionSheetController,public _service:Service,public storage: Storage) {
        this.profileimage = 'assets/profile-default.jpg'
        this.registerForm = formBuilder.group({
           fullName: ['',Validators.compose([Validators.required, Validators.minLength(2)])],
           age:['',Validators.required],
           email:['',Validators.compose([Validators.required])],
           password:['',Validators.required],
           confirmPassword:['',Validators.required],
        });

        this.formSlides = [
          {
            description: "What do we call you?",
            placeholder: "Full name",
            type: "text",
            model:"fullName"
          },
          {
            description: "It's just a number",
            placeholder: "Age (optional)",
            type: "tel",
            model:"age"
          },
          {
            description: "World's best invention",
            placeholder: "Email address",
            type: "text",
            model:"email",
            pattern:"^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$"
          },
          {
            description: "I always forget this one",
            placeholder: "Password",
            type: "password",
            model:"password"
          },
          // {
          //   description: "Forgotten already?",
          //   placeholder: "Confirm Password",
          //   type: "password",
          //   model:"confirmPassword"
          // },
      ];

  }

  ionViewDidLoad() {
    console.log('Hello RegisterPage');
    this.slides.lockSwipeToNext(true);
  }

  nextSlide () {
    let isLastSlide = this.slides.isEnd();
    if(isLastSlide) {
      console.log("Process registration");
      this.register();
    } else {
      this.slides.lockSwipeToNext(false);
      this.slides.slideNext();
      this.slides.lockSwipeToNext(true);
    }
  }

  profilePic()
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
    this.profileimage = 'data:image/jpeg;base64,' + imageData;
    }, (err) => {
    // Handle error
    });
  }

  login()
  {
    // console.log(this.registerForm.value)
     this.navCtrl.setRoot(LoginPage)
  }


  register(){
    this.showLoading()
    let _data = {
      fullName: this.registerForm.controls['fullName']._value,
      age: this.registerForm.controls['age']._value,
      email: this.registerForm.controls['email']._value,
      password: this.registerForm.controls['password']._value,
      created_at:Date.now()
    }
    console.log(_data);

    this._service.registerUser(_data).then((data) => {

      if(data)
      {
        this._service.getLoginUserData(data).then((resp) =>{
          console.log(resp)
          this.storage.set('userData',JSON.stringify(resp))
          setTimeout(() =>{
              this._service.toast('Register Succesfully..');
              this.loader.dismiss();
              this.navCtrl.setRoot(TabsPage);
          },3000)
        })
      }
      else
      {
        this.loader.dismiss();
      }
    });

  }

  showLoading() {
    this.loader = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    this.loader.present();
  }


}
