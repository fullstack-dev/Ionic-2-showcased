import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { RegisterMenuPage } from '../register-menu/register-menu';
import { LoginPage } from '../login/login';

/*
  Generated class for the StartPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-start',
  templateUrl: 'start.html'
})
export class StartPage {
  LoginPage: any;
  RegisterMenuPage: any;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.LoginPage = LoginPage;
    this.RegisterMenuPage = RegisterMenuPage;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad StartPagePage');
  }

}
