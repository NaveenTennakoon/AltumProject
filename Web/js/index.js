function login(){
  modalLoading.init(true);
  let user = document.getElementById("Email").value;
  let pwd = document.getElementById("Password").value;

  firebase.auth().signInWithEmailAndPassword(user, pwd).then(function(){
    usersRef.child(firebase.auth().currentUser.uid).once("value").then(function(snapshot){
      if(snapshot.val().type == 'customer'){
        if(snapshot.val().status == 'active'){
          location.href="cus_dashboard.html";
        }
        else{
          let element = document.getElementById("openModalLoading");
          element.parentNode.removeChild(element);
          Swal.fire(
            'Your account has been deactivated by Altum',
            '',
            'error'
          )
        }
      }
      else if(snapshot.val().type == 'admin'){
        location.href="dashboard.html";
      }
    });
  }).catch(function(error){
      // Handle Errors here.
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: error.message,
      })
      let element = document.getElementById("openModalLoading");
      element.parentNode.removeChild(element);
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
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: error.message,
    })
  });
}