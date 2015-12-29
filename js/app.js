// js/app.js

var app = app || {};
var ENTER_KEY = 13;

$(function() {

  var ref = new Firebase("https://blinding-torch-1635.firebaseIO.com");
  ref.onAuth(function(authData) {
    if (authData) {
      // kick off app
      new app.AppView();
    } else {
      // Try to authenticate with Google via OAuth redirection
      ref.authWithOAuthRedirect("google", function(error, authData) {
        if (error) {
          console.log("Login Failed!", error);
        } else {
          // kick off app
          new app.AppView();
        }
      });
    }
  });

// Create a callback which logs the current auth state
  function authDataCallback(authData) {
    if (authData) {
      console.log("User " + authData.uid + " is logged in with " + authData.provider);
      uid = authData.uid;
    } else {
      console.log("User is logged out");
    }
  }

  // Register the callback to be fired every time auth state changes
  var ref = new Firebase("https://blinding-torch-1635.firebaseio.com");
  ref.onAuth(authDataCallback);


});