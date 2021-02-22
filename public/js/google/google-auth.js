function onSignIn(googleUser) {
    var profile = googleUser.getBasicProfile();
    
  }

function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
      console.log('User signed out.');
    });
} 