function login(usertype){
  let user = document.getElementById("Email").value;
  let pwd = document.getElementById("Password").value;
  firebase.database().ref("orders").once('value', function(snapshot) {
    snapshot.forEach(function (childSnapshot){
      if (childSnapshot.val().Salesperson == "Sachini Nayanathara") {
        console.log(childSnapshot.val().Salesperson);
      }
    });
  });
      

  if(usertype == "customer"){
    customerRef.once("value").then(function(snapshot){
          snapshot.forEach(function(childSnapshot) {
            if(childSnapshot.val().Username == user){
              if(childSnapshot.val().Password == pwd){
                location.href="cus_dashboard.html";
              }
            }
          });
      });
  }

  if(usertype == "admin"){
    firebase.auth().signInWithEmailAndPassword(user, pwd).then(function(){
      location.href="dashboard.html";
    }).catch(function(error){
        // Handle Errors here.
        var errorMessage = error.message;
        window.alert(errorMessage);
    });
  }
  
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
    location.href = "admin_login.html";
  }).catch(function(error) {
    // An error happened.
    switch (error.code) {
      case 'auth/user-not-found':
        customerRef.once("value").then(function(snapshot){
          snapshot.forEach(function(childSnapshot) {
            if(childSnapshot.val().Email == email){
              window.alert("Customer Password Reset is not implemeted yet")
             }
          });
        });
        break;
      default:
        let errorMessage = error.message;
        window.alert(errorMessage);
    }
  });
}