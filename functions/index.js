'use strict';

const functions = require('firebase-functions'),
      admin = require('firebase-admin'),
      logging = require('@google-cloud/logging')();

admin.initializeApp(functions.config().firebase);

const cors = require('cors')({origin: true});

const request = require('request-promise');

exports.getFeed = functions.https.onRequest((req, res) => {

  // ...
  cors(req, res, () => {

    var passions = req.body;
    var passionsArray = Object.keys(passions);
    var length = passionsArray.length;
    var count = 0;
    var feed = {};
    getUsers();

    function getUsers () {
      if (count < length) {
        var passion = passionsArray[count];
        admin.database().ref(`user`).orderByChild(`passions/${passion}`).equalTo(true).once('value').then(snapshot => {
          var data = snapshot.val();
          for (var key in data) {
            if (data.hasOwnProperty(key)) {
              feed[key] = data[key];
            }
          }
          count++;
          getUsers();
        })
      } else {
        count = 0;
        getItems();
      }
    }

    function getItems () {
      if (count < length) {
        var passion = passionsArray[count];
        admin.database().ref(`post`).orderByChild(`passions/${passion}`).equalTo(true).once('value').then(snapshot => {
          var data = snapshot.val();
          for (var key in data) {
            if (data.hasOwnProperty(key)) {
              feed[key] = data[key];
            }
          }
          count++;
          getItems();
        })
      } else {

        return res.status(200).send(feed);
      }
    }

  });

});

exports.getOfflineCollaborators = functions.https.onRequest((req, res) => {

  // ...
  cors(req, res, () => {

    var passions = req.body;
    var passionsArray = Object.keys(passions);
    var length = passionsArray.length;
    var count = 0;
    var feed = {};
    getUsers();

    function getUsers () {
      if (count < length) {
        var passion = passionsArray[count];
        admin.database().ref(`user`).orderByChild(`passions/${passion}`).equalTo(true).once('value').then(snapshot => {
          var data = snapshot.val();
          for (var key in data) {
            if (data.hasOwnProperty(key)) {
              feed[key] = data[key];
            }
          }
          count++;
          getUsers();
        })
      } else {
        return res.status(200).send(feed);
      }
    }

  });

});

exports.getOnlineCollaborators = functions.https.onRequest((req, res) => {

  // ...
  cors(req, res, () => {

    var passions = req.body;
    var passionsArray = Object.keys(passions);
    var length = passionsArray.length;
    var count = 0;
    var feed = {};

    var d = new Date();
    var n = d.getDay();
    var days = ['sunday','monday','tuesday','wednesday','thursday','friday','saturday'];
    var currentDay = days[n];
    var currentHour = d.getHours();
    currentHour++;

    getUsers();

    function getUsers () {
      if (count < length) {
        var passion = passionsArray[count];
        admin.database().ref(`user`).orderByChild(`passions/${passion}`).equalTo(true).once('value').then(snapshot => {
          var data = snapshot.val();
          for (var key in data) {
            if (data.hasOwnProperty(key)) {

              if(data[key].status && data[key].status == 0) {

              } else if(data[key].status && data[key].status == 1) {
                feed[key] = data[key];
              } else if(data[key].availability && data[key].availability[currentDay].lower <= currentHour && data[key].availability[currentDay].upper > currentHour) {
                  feed[key] = data[key];
              }
            }
          }
          count++;
          getUsers();
        })
      } else {
        return res.status(200).send(feed);
      }
    }

  });

});
