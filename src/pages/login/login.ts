import { Component } from '@angular/core';
import { NavController ,LoadingController, AlertController} from 'ionic-angular';
import { RegisterMenuPage } from '../register-menu/register-menu';
import { Service } from '../../providers/service';
import { TabsPage } from '../tabs/tabs';
import { Storage } from '@ionic/storage';
import * as firebase from 'firebase';
// import { HomePage } from '../home/home'
/*
  Generated class for the Login page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  loader:any;
  private _fireAuth:any;
  data={email:'',password:''}
  loggingIn;
  constructor(private navCtrl: NavController,private loadingCtrl: LoadingController, public alertCtrl: AlertController,public _service:Service,public storage: Storage) {
    // this.storage.get('userData').then((val) => {
    //     let data = JSON.parse(val)
    //     if(data)
    //     {
    //       this.navCtrl.setRoot(TabsPage)
    //     }
    // })

  }

  ionViewDidLoad() {
    console.log('Hello LoginPage Page');
  }
  ionViewWillEnter(){
    this.storage.get('userData').then((val) => {
        let data = JSON.parse(val)
        if(data)
        {
          this.navCtrl.setRoot(TabsPage)
        }
   })
  }
  login(){
    this.loggingIn = true;
    ///console.log(JSON.stringify(this.data);
    this._service.signIn(this.data).then((res)=>{
      if(res)
      {
           this._service.getLoginUserData(res).then((resp) =>{
              this.storage.set('userData',JSON.stringify(resp));
              this._service.toast('Login successful');
              this.navCtrl.setRoot(TabsPage)
              this.loggingIn = false;
            })
      }
      else
      {
           this.loggingIn = false;
      }
    });
  }

  goToRegisterPage()
  {
    this.navCtrl.push(RegisterMenuPage);
  }
  showLoading() {
    this.loader = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    this.loader.present();
  }

  resetPassword() {
    let alert = this.alertCtrl.create({
      title: 'Reset Password',
      message: 'Please enter your email address below.',
      inputs: [
        {
          name: 'email',
          placeholder: 'Email address'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: data => {

          }
        },
        {
          text: 'Reset',
          handler: data => {
            if (data.email) {
              // logged in!
              var auth = firebase.auth();
              auth.sendPasswordResetEmail(data.email).then(function() {
                // Email sent.
              }, function(error) {
                // An error happened.
                console.log(error)
              });
            } else {
              // invalid login
              return false;
            }
          }
        }
      ]
    });
    alert.present();
  }

}
