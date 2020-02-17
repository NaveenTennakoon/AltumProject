// new salesperson page functions
let id = 0
usersRef.once('value').then(function(snapshot){
    snapshot.forEach(function(childSnashot){
        if(childSnashot.val().id > id)
            id = childSnashot.val().id
    })
}).then(()=>{
    id++
    id = pad(id, 4)
})

function pad(num, size) {
    let s = num+"";
    while (s.length < size) s = "0" + s;
    return s;
}

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
                    id: id,
                    status: 'active'
                })
                gpsRef.child('live/'+firebase.auth().currentUser.uid).set({
                    name: $("#fname").val()+" "+$("#lname").val(),
                    lat: 0,
                    lng: 0,
                    status: 'inactive'
                })
                Swal.fire({
                    position: 'top',
                    icon: 'success',
                    title: 'Salesperson added successfully',
                    showConfirmButton: false,
                    timer: 3000
                })
                $("#addSalespersonForm").trigger('reset')
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