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

  // view profile of user
  function getProfile(){
    document.getElementById("view-profile-title").innerText = firebase.auth().currentUser.email
    usersRef.child(firebase.auth().currentUser.uid).once("value").then(function(snapshot){
      document.getElementById("view-profile-body").insertAdjacentHTML(
        'beforeend',
        "<div class='form-row my-3 mx-3'>"+
          "<div class='col-lg-3'>"+
            "<a value='Name'><strong>Name</strong></a>"+
          "</div>"+
          "<div class='col-lg-9'>"+
            "<input class='form-control' id='name' value='"+snapshot.val().name+"' readonly>"+
          "</div>"+
        "</div>"+
        "<div class='form-row my-3 mx-3'>"+
          "<div class='col-lg-3'>"+
            "<a value='Name'><strong>Company</strong></a>"+
          "</div>"+
          "<div class='col-lg-9'>"+
            "<input class='form-control' id='name' value='"+snapshot.val().company+"' readonly>"+
          "</div>"+
        "</div>"+
        "<div class='form-row my-3 mx-3'>"+
          "<div class='col-lg-3'>"+
            "<a value='Name'><strong>Contact Number</strong></a>"+
          "</div>"+
          "<div class='col-lg-7'>"+
            "<input class='form-control' id='name' value='"+snapshot.val().telephone+"' readonly>"+
          "</div>"+
        "</div>"+
        "<div class='form-row my-3 mx-3'>"+
          "<div class='col-lg-3'>"+
            "<a value='Name'><strong>Address</strong></a>"+
          "</div>"+
          "<div class='col-lg-9'>"+
            "<textarea class='form-control' id='name' readonly>"+snapshot.val().address+"</textarea>"+
          "</div>"+
        "</div>"
      )
    })
    $('#viewProfileModal').modal({backdrop: 'static', keyboard: false})
    $('#viewProfileModal').modal('show')
  }

  // update user profile
  function updateProfile(){
    usersRef.child(firebase.auth().currentUser.uid).update({
      name: $("#name").val(),
      company: $("#company").val(),
      telephone: $("#tel").val(),
      address: $("#address").val(),
    }).then(()=>{
      Swal.fire({
        position: 'top',
        icon: 'success',
        title: 'Profile Updated successfully',
        showConfirmButton: false,
        timer: 3000
      })
    }).catch(function(error){
        // Handle Errors here.
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: error.message,
        })
    })
  }
  
  // logout user
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
  
  // account deleting
  async function signout(){
    $('#signoutModal').modal('hide')
    // get authentication credentials
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
          // delete user
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
  