firebase.auth().onAuthStateChanged(function (user) {
  if (!user)
    location.href = "index.html"
})


function logout() {
  Swal.fire({
    title: 'Are you sure?',
    text: "You are logging out of Altum",
    icon: 'info',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#aaa',
    confirmButtonText: 'Logout'
  }).then((result) => {
    if (result.value) {
      firebase.auth().signOut().then(function () {
        // Sign-out successful.
        location.href = "index.html"
      }).catch(function (error) {
        // An error happened.
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: error.message,
        })
      })
    }
  })
}