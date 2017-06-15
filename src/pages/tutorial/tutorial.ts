import { Component } from '@angular/core';
import { NavController, NavParams, ModalController } from 'ionic-angular';
import { GlobalVars } from '../../providers/globalvars';
import { AddPostPage } from '../add-post/add-post';
import { TabsPage } from '../tabs/tabs';

/*
  Generated class for the TutorialPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-tutorial',
  templateUrl: 'tutorial.html'
})
export class TutorialPage {

  userData;
  showFinished;

  constructor(public navCtrl: NavController, public GlobalVars:GlobalVars, public navParams: NavParams, public modalCtrl: ModalController) {
    this.GlobalVars = GlobalVars;

    this.GlobalVars.getMyGlobalVar().then((data) =>{
        this.userData =  JSON.parse(data);
        if(this.userData.passions) this.userData.arrayOfKeys = Object.keys(this.userData.passions);
    })

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TutorialPagePage');
  }

  openModal () {
    console.log(this.userData);
    let modal = this.modalCtrl.create(AddPostPage,{loginuser:this.userData});
    modal.present();
    this.showFinished = true;
  }

  finished () {
    // this.navCtrl.parent.parent.setRoot(HomePage);
    this.navCtrl.setRoot(TabsPage);
  }

}
