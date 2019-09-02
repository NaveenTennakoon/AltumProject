function login(usertype){
  let user = document.getElementById("Email").value;
  let pwd = document.getElementById("Password").value;

  if(usertype == "customer"){
    customerRef.once("value").then(function(snapshot){
          snapshot.forEach(function(childSnapshot) {
            if(childSnapshot.val().Username == user){
              if(childSnapshot.val().Password == pwd){
                location.href="dashboard.html";
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

function signup(){  
    // Get input values from each of the form elements
    var parentkey = $("#company").val();
    var telephone = $("#tel").val();
    var email = $("#email").val();
    var uname = $("#uname").val();
    var pwd = $("#password").val();
  
    // Push the new customer to the database using those values
    if($("#password").val() == $("#cpassword").val()){
      customerRef.child(parentkey).set({
        "Customer Name": parentkey,
        "Telephone Number": telephone,
        "Email": email,
        "Username": uname,
        "Password": pwd 
      });
      console.log("Success");
    }
}

function resetMail(){
  let email = document.getElementById("Email").value;
  firebase.auth().sendPasswordResetEmail(email).then(function() {
    // Email sent.
    location.href = "index.html";
  }).catch(function(error) {
    // An error happened.
    let errorMessage = error.message;
    window.alert(errorMessage);
  });
}