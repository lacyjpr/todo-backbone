// js/app.js

var app = app || {};
var ENTER_KEY = 13;

$(function() {

  var ref = new Firebase("https://blinding-torch-1635.firebaseIO.com");
  var authData = ref.getAuth();
  if (authData) {
    ref.authWithOAuthRedirect("google", function(error, authData) {
      if (error) {
        console.log("Login Failed!", error);
      } else {
        // kick off app
        new app.AppView();
      }
    });
  } else {
     new app.AppView();
  }

});