// salesperson page functions
let spArr = []

usersRef.once("value").then(function(snapshot){
// <!-- snapshot of childs of root of database-->
    snapshot.forEach(function(childSnapshot) {
    if(childSnapshot.val().type == 'salesperson' && childSnapshot.val().status == 'active'){
        let item = childSnapshot.val().firstName+" "+childSnapshot.val().lastName
        spArr.push(item) 
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
autocomplete(document.getElementById("salesperson-search"), spArr)

function spDetails(){
let userName = document.getElementById("salesperson-search").value
usersRef.once("value").then(function(snapshot){
    snapshot.forEach(function(childSnapshot){
    let tempName = childSnapshot.val().firstName+" "+childSnapshot.val().lastName
    if(tempName == userName){
        document.getElementById("fname").value = childSnapshot.val().firstName
        document.getElementById("lname").value = childSnapshot.val().lastName
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

function deleteSp(){
let sp = document.getElementById("salesperson-search").value
if(sp == ''){
    Swal.fire(
    'No salesperson selected',
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
                title: 'Salesperson successfully deleted',
                showConfirmButton: false,
                timer: 3000
                })
            })
            }
        })
        })
    }
    })
}
}
  