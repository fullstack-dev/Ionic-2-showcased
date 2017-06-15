import { Component } from '@angular/core';
import { NavController, NavParams,ToastController } from 'ionic-angular';
import * as firebase from 'firebase';
import { GlobalVars } from '../../providers/globalvars';

/*
  Generated class for the FeedbackPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-feedback',
  templateUrl: 'feedback.html'
})
export class FeedbackPage {
  feedback;
  _feedback;
  userData;
  constructor(public navCtrl: NavController, public navParams: NavParams, public toastCtrl:ToastController,public GlobalVars:GlobalVars) {
    this.feedback = '';
    this._feedback = firebase.database().ref('feedback');

    this.GlobalVars = GlobalVars;
    this.GlobalVars.getMyGlobalVar().then((data) =>{
        this.userData =  JSON.parse(data);
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FeedbackPagePage');
  }

  submitFeedback () {

    let tempData = {
      user:this.userData,
      message:this.feedback
    }

    let res = this._feedback.push(tempData).key;
    if(res) {
      let toast = this.toastCtrl.create({
        message: 'Thank you! Your feedback has been sent and we will look at it shortly.',
        duration: 2000,
        position: 'top'
      });

      toast.present();
      this.feedback = '';
    }
  }

}
