import { Component } from '@angular/core';
import { NavController, ViewController } from 'ionic-angular';

@Component({
  selector: 'PrivacyPage',
  templateUrl: 'privacy.html'
})
export class PrivacyPage {

  constructor(public viewCtrl: ViewController, public navCtrl: NavController) {}

}
