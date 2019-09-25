function login(){
  let user = document.getElementById("Email").value;
  let pwd = document.getElementById("Password").value;

  firebase.auth().signInWithEmailAndPassword(user, pwd).then(function(){
    usersRef.child(firebase.auth().currentUser.uid).once("value").then(function(snapshot){
      if(snapshot.val().type == 'customer'){
        location.href="cus_dashboard.html";
      }
      else if(snapshot.val().type == 'admin'){
        location.href="dashboard.html";
      }
    });
  }).catch(function(error){
      // Handle Errors here.
      let errorMessage = error.message;
      window.alert(errorMessage);
  });
}


function logout(){
  firebase.auth().signOut().then(function(){
    // Sign-out successful.
    location.href = "index.html";
  }).catch(function(error) {
    // An error happened.
    let errorMessage = error.message;
    window.alert(errorMessage);
  });
}

function resetMail(){
  let email = document.getElementById("Email").value;
  firebase.auth().sendPasswordResetEmail(email).then(function() {
    // Email sent.
    window.alert("Reset link was sent to your email address. Go check it!");
    location.href = "index.html";
  }).catch(function(error) {
    // An error happened.
    let errorMessage = error.message;
    window.alert(errorMessage);
  });
}