import { Component } from '@angular/core';
import { NavController, ViewController } from 'ionic-angular';

@Component({
  selector: 'TermsPage',
  templateUrl: 'terms.html'
})
export class TermsPage {

  constructor(public viewCtrl: ViewController, public navCtrl: NavController) {}

}
