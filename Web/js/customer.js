window.onload = loadCustomers()

function loadCustomers(){
  let customerArr = []
  // populate customer ids to customer array
  usersRef.once("value").then(function(snapshot){
      snapshot.forEach(function(childSnapshot) {
        if(childSnapshot.val().type == 'customer' && childSnapshot.val().status == 'active'){
            let item = childSnapshot.val().name
            customerArr.push(item) 
        }
      })
  }).catch(function(error){
      // Handle Errors here.
      Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: error.message,
      })
  })
  autocomplete(document.getElementById("customer-search"), customerArr)
}

// load customer details with search
function customerDetails(){
  $('#customerForm').trigger('reset')
    let userName = document.getElementById("customer-search").value
    usersRef.once("value").then(function(snapshot){
      snapshot.forEach(function(childSnapshot){
        if(childSnapshot.val().name == userName && childSnapshot.val().status == 'active'){
          document.getElementById("name").value = childSnapshot.val().name
          document.getElementById("company").value = childSnapshot.val().company
          document.getElementById("email").value = childSnapshot.val().email
          document.getElementById("tel").value = childSnapshot.val().telephone
          document.getElementById("address").value = childSnapshot.val().address
        }
      })
    }).catch(function(error){
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: error.message,
      })
    })
}
  
// delete customer
function deleteCustomer(){
    let sp = document.getElementById("customer-search").value
    if(sp == ''){
      Swal.fire(
        'No customer selected',
        '',
        'info'
      )
    }
    else{
      Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete!'
      }).then((result) => {
        // if confirmed deactivate user status
        if (result.value) {
          usersRef.once("value").then(function(snapshot){
            snapshot.forEach(function(childSnapshot){
              if(childSnapshot.val().name == sp){
                usersRef.child(childSnapshot.key).update({
                  status: 'inactive'
                }).then(()=>{
                  Swal.fire({
                    position: 'top',
                    icon: 'success',
                    title: 'Customer successfully deleted',
                    showConfirmButton: false,
                    timer: 3000
                  })
                })
              }
            })
          })
          loadCustomers()
          $('#searchbox').trigger('reset')
          $('#customerForm').trigger('reset')
        }
      })
    }
}
  