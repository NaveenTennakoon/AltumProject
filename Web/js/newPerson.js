// new salesperson page functions
function addSalesperson() {
    $('#addSalespersonForm').submit(function(e){     
        e.preventDefault() 
        if($("#password").val()==$("#cpassword").val()){
            let email = $("#email").val()
            let password = $("#password").val()
            firebase.auth().createUserWithEmailAndPassword(email, password).then(()=>{
                usersRef.child(firebase.auth().currentUser.uid).set({
                    firstName: $("#fname").val(),
                    lastName: $("#lname").val(),
                    email: email,
                    telephone: $("#tel").val(),
                    address: $("#address").val(),
                    type: 'salesperson',
                }).then(()=>{
                    Swal.fire({
                    position: 'top',
                    icon: 'success',
                    title: 'Salesperson added successfully',
                    showConfirmButton: false,
                    timer: 3000
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
        else{
            Swal.fire(
            'Password fields do not match',
            '',
            'warning'
            )
        }
    })
}