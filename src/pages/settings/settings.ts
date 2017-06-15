import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import * as firebase from 'firebase';
import {GlobalVars} from '../../providers/globalvars';
import { StartPage} from '../start/start';
import { FeedbackPage} from '../feedback/feedback';
import { ContactPage} from '../contact/contact';
import { TermsPage } from '../legals/terms';
import { PrivacyPage } from '../legals/privacy';

/*
  Generated class for the SettingsPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html'
})
export class SettingsPage {
  userData;
  _user;
  ContactPage: any;
  FeedbackPage: any;
  TermsPage: any;
  PrivacyPage: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController, public storage: Storage, public GlobalVars: GlobalVars) {
    this.ContactPage = ContactPage;
    this.FeedbackPage = FeedbackPage;
    this.TermsPage = TermsPage;
    this.PrivacyPage = PrivacyPage;
    GlobalVars.getMyGlobalVar().then((data) =>{
        this.userData =  JSON.parse(data);
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SettingsPagePage');
  }

  logout(){
    let confirm = this.alertCtrl.create({
      title: 'Logout?',
      message: 'Are you sure want to log out',
      buttons: [
        {
          text: 'No',
          handler: () => {
            console.log('Disagree clicked');
          }
        },
        {
          text: 'YES',
          handler: () => {
            this.storage.remove('userData')
            this.storage.clear();
            this.navCtrl.parent.parent.setRoot(StartPage);
            firebase.auth().signOut().then(function() {})
          }
        }
      ]
    });
    confirm.present();
  }

  resetPassword (emailAddress) {
    console.log(emailAddress)
    let confirm = this.alertCtrl.create({
      title: 'Reset Password',
      message: 'An email will be sent to you with a password reset link.',
      buttons: [
        {
          text: 'Cancel',
          handler: () => {
            console.log('Disagree clicked');
          }
        },
        {
          text: 'OKAY',
          handler: () => {
            var auth = firebase.auth();
            auth.sendPasswordResetEmail(emailAddress).then(function() {
              // Email sent.
            }, function(error) {
              // An error happened.
            });
          }
        }
      ]
    });
    confirm.present();

  }

}
