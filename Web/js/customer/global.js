// global functions for customer pages
function userid(){
    firebase.auth().onAuthStateChanged(function(user){
      if(user){
        usersRef.child(firebase.auth().currentUser.uid).once("value").then(function(snapshot){
          let uid = snapshot.val().name
          document.getElementById("uid").innerHTML = uid 
        }).catch(function(error){
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: error.message,
          })
        })
      }
    })
  }
  
  function logout(){
    firebase.auth().signOut().then(function(){
      // Sign-out successful.
      location.href = "index.html"
    }).catch(function(error) {
      // An error happened.
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: error.message,
      })
    })
  }
  
  async function signout(){
    $('#signoutModal').modal('hide')
    const { value: formValues } = await Swal.fire({
      title: 'Re-Authenticate user credentials',
      html:
        '<input id="swalEmail" class="swal2-input" placeholder="Email address">' +
        '<input id="swalPassword" class="swal2-input" placeholder="Password" type="password">',
      focusConfirm: false,
    }) 
    if (formValues) {
      let user = firebase.auth().currentUser
      let credential = firebase.auth.EmailAuthProvider.credential(
        document.getElementById('swalEmail').value,
        document.getElementById('swalPassword').value
      )
      // Prompt the user to re-provide their sign-in credentials
      user.reauthenticateWithCredential(credential).then(function() {
        usersRef.child(firebase.auth().currentUser.uid).update({
          status: "inactive",
        }).then(() => {
          firebase.auth().currentUser.delete().then(() => {
            Swal.fire({
              position: 'top',
              icon: 'success',
              title: 'Thank you for staying with us. See you again',
              showConfirmButton: false,
              timer: 3000
            })
            location.href = 'index.html'
          }).catch(function(error){
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: error.message,
            })
          })
        })
      }).catch(function(error) {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: error.message,
        })
      })
    }
  }
  