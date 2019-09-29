// global administrator functions
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

// new salesperson page functions
function addSalesperson() {
  if($("#password").val()==$("#cpassword").val()){
    let email = $("#email").val();
    let password = $("#password").val();
    firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
      var errorMessage = error.message;
      window.alert(errorMessage);
    }).then(()=>{
      usersRef.child(firebase.auth().currentUser.uid).set({
        firstName: $("#fname").val(),
        lastName: $("#lname").val(),
        telephone: $("#tel").val(),
        address: $("#address").val(),
        type: 'Salesperson',
      });
    });
    window.alert("Salesperson added succesfully");
  }
  else{window.alert("Password fields do not match")}
}