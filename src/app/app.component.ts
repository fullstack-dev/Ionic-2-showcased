import { Component,ViewChild } from '@angular/core';
import { Platform ,Nav} from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';
import { StartPage } from '../pages/start/start';
import { TabsPage } from '../pages/tabs/tabs';
import { HomePage } from '../pages/home/home';
import { Service } from '../providers/service';
import * as firebase from 'firebase';
import * as moment from 'moment';
import { Storage } from '@ionic/storage';
import { MomentModule } from 'angular2-moment/moment.module';
import {NativeAudio,Keyboard} from 'ionic-native';

@Component({
  templateUrl: 'app.html',
  providers: [Service],
})
export class MyApp {
    @ViewChild(Nav) nav: Nav;
      rootPage;
  constructor(public platform: Platform,public storage: Storage) {
    this.rootPage = StartPage;

   var config = {
     apiKey: "AIzaSyC9ZUziwYI3_HIsp612CuO5l2r8F30rk98",
     authDomain: "showcased-60f52.firebaseapp.com",
     databaseURL: "https://showcased-60f52.firebaseio.com",
     projectId: "showcased-60f52",
     storageBucket: "showcased-60f52.appspot.com",
     messagingSenderId: "1067827587746"
  };

    moment.locale('en', {
      relativeTime: {
        future: "in %s",
        past: "%s ago",
        s: "%d sec",
        m: "a min",
        mm: "%d min",
        h: "an hour",
        hh: "%d hours",
        d: "a day",
        dd: "%d days",
        M: "a month",
        MM: "%d months",
        y: "a year",
        yy: "%d years"
      }
    });
    platform.ready().then(() => {
      firebase.initializeApp(config);
      this.storage.get('userData').then((val) => {
          // console.log('LOGIN USER DATA'+ val)
          let data = JSON.parse(val)
          if(data)
          {

            this.rootPage = TabsPage
          }
          else
          {
            this.rootPage = StartPage
          }
     })

      //   firebase.auth().onAuthStateChanged(user => {
      //    if (user) {
      //     this.rootPage = TabsPage
      //    } else {
      //     this.rootPage = LoginPage
      //    }
      //  });
      // this.nav.setRoot(LoginPage);
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
      // StatusBar.overlaysWebView(false);
      // StatusBar.backgroundColorByHexString('#ffffff');
      if (this.platform.is('ios')) {
          Keyboard.disableScroll(false);
      }
    });
  }
  initializeApp() {

  }
}
