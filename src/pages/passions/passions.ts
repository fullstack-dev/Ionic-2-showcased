import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import {GlobalVars} from '../../providers/globalvars';
import * as firebase from 'firebase';
import { PassionDetailPage } from '../passion-detail/passion-detail';
import { TutorialPage } from '../tutorial/tutorial';
import { Service } from '../../providers/service';

/*
  Generated class for the PassionsPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-passions',
  templateUrl: 'passions.html'
})
export class PassionsPage {

  passions:any;
  PassionDetailPage:any;
  TutorialPage:any;
  userData;
  _user;
  passionArrayOfKeys:any;
  tutorial:boolean;
  constructor(public navCtrl: NavController, public _service:Service, public navParams: NavParams, public storage: Storage, public GlobalVars:GlobalVars) {
    this.initializeItems();
    this.PassionDetailPage = PassionDetailPage;
    this.TutorialPage = TutorialPage;
    GlobalVars.getMyGlobalVar().then((data) =>{
        this.userData =  JSON.parse(data);

        // Setting the keys for passions
        if(this.userData.passions) this.passionArrayOfKeys = Object.keys(this.userData.passions);
    })
    this.tutorial = this.navParams.data.tutorial;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PassionsPagePage');
  }

  initializeItems() {
    this.passions = ["Accounting",
    "Biology",
    "Chemistry",
    "Darts",
    "Economics",
    "Finance",
    "Graphics design",
    "Health & Wellness",
    "Mindfulness",
    "Ping pong/table tennis",
    "Science",
    "Spirituality & Meditation",
    "Squash",
    "Yoga",
    "Art",
    "Astronomy",
    "Baking",
    "Basketball",
    "Baseball",
    "Biology",
    "Bowling",
    "Boxing",
    "Cooking",
    "Cricket",
    "Cycling",
    "Dance",
    "Design",
    "Drama",
    "Drawing",
    "Entrepreneurship",
    "Exercise & Fitness",
    "Fashion",
    "Field Hockey & Ice Hockey",
    "Games & Gaming",
    "Golf",
    "Guitar",
    "Ice Skating",
    "Journalism",
    "Languages",
    "Literature",
    "Martial Arts",
    "Mathematics",
    "Music",
    "Nature & Wildlife",
    "Painting",
    "Photography",
    "Physics",
    "Piano",
    "Product Management",
    "Programming",
    "Politics",
    "Public Speaking",
    "Reading",
    "Singing",
    "Soccer/Football",
    "Songwriting",
    "Scuba Diving",
    "Swimming",
    "Startups",
    "Technology",
    "Tennis",
    "Theatre",
    "Travel",
    "Tutoring",
    "UX Design",
    "Volleyball",
    "Volunteering",
    "Web Development",
    "Writing & Blogging",
    "Ballet",
    "Board Games",
    "Cards",
    "Puzzles",
    "Running/Jogging"]
  }

  getItems(ev: any) {
    // Reset items back to all of the items
    this.initializeItems();

    // set val to the value of the searchbar
    let val = ev.target.value;

    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.passions = this.passions.filter((item) => {
        return (item.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
  }

  addPassion (passion) {

    if(this.userData.passions && Object.keys(this.userData.passions).length > 9) {
      this._service.toast('Maximum of 10 passions allowed.');
      return
    }

    if(!this.userData.passions) {
      this.userData.passions = {};
    }
    this.userData.passions[passion] = true;
    this.updateProfile();
    this.passionArrayOfKeys = Object.keys(this.userData.passions);

  }

  removePassion (passion) {

    delete this.userData.passions[passion];
    this.updateProfile();
    this.passionArrayOfKeys = Object.keys(this.userData.passions);

  }

  updateProfile(){
    let refUser = firebase.database().ref('user').child(this.userData.userKey).update(this.userData);
    if(refUser) {
         this.storage.set('userData',JSON.stringify(this.userData));
    }
  }

  generateAvatarColor (passion) {

		if(passion){
			var numColors = 19;
	    var hash = 0;
	    if(passion.length == 0) return hash;

	    for(let i = 0; i < passion.length; i++){
	        let char = passion.charCodeAt(i);
	        hash = ((hash<<5)-hash)+char;
	        hash = hash & hash; // Convert to 32bit integer
	    }
	    hash = Math.abs(hash) % numColors;

	    return hash;
		}

  }

}
