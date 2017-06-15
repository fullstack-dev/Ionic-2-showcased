import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { RegisterPage } from '../register/register';
import { TermsPage } from '../legals/terms';
import { PrivacyPage } from '../legals/privacy';

/*
  Generated class for the RegisterMenuPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-register-menu',
  templateUrl: 'register-menu.html'
})
export class RegisterMenuPage {
  RegisterPage: any;
  TermsPage: any;
  PrivacyPage: any;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.RegisterPage = RegisterPage;
    this.TermsPage = TermsPage;
    this.PrivacyPage = PrivacyPage;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegisterMenuPagePage');
  }

}
