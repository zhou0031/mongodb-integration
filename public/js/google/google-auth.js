async function onSignIn(googleUser) {
    var id_token = googleUser.getAuthResponse().id_token
   
    try{
          await fetch("/user/google/verifyGoogleIdToken",{
          method:"POST",
          headers:{"Content-Type":"application/json"},
          body:JSON.stringify({id_token})
        })
        .then(response => response.json())
        .then(data=>{
          
        })
    }catch(error){
      console.log("Error: "+error)
    }
    
}

function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
      console.log('User signed out.');
    });
} 