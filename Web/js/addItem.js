let counter = 0
let typeArr = []

// populate type array
inventoryRef.once("value").then(function(snapshot){
  snapshot.forEach(function(childSnapshot) {
    if(typeArr.length == 0){
      let item = childSnapshot.val().Type
      typeArr.push(item)
    }
    else{
      let flag = i = 0
      while(i<typeArr.length){
        if(childSnapshot.val().Type == typeArr[i]){
          flag = 1
        }
        i++
      }
      if(flag == 0){
        let item = childSnapshot.val().Type
        typeArr.push(item)
      }     
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
autocomplete(document.getElementById("defaultval3"), typeArr)

// validation for the inputs
function validateNewItem(){
  $('#addItemForm').submit(function(e){     
    e.preventDefault() 
    $('#promptModal').modal('show')
  })
}

// add input to the form
function addInput(divName){
  counter++
  let newdiv = document.createElement('div')
  newdiv.setAttribute('id', 'div_' + counter)
  newdiv.innerHTML = "<div class='form-row my-3'><div class='col-lg-4'><input class='form-control' id='addedkey"+counter+"' placeholder='Enter key field'> </div><div class='col-lg-8'><input class='form-control' id='addedval"+counter+"' placeholder='Value of key'></div></div>"           
  document.getElementById(divName).appendChild(newdiv)     
}

// remove added input from the form
function deleteInput(divName){
  if(0 < counter) {
    document.getElementById(divName).removeChild(document.getElementById('div_' + counter))
    counter--
  } 
  else {
    Swal.fire({
      position: 'center',
      icon: 'info',
      title: 'No more inputs can be deleted',
      showConfirmButton: false,
      timer: 1500
    })
  }
}

// record product details in the database
function additem(){
  let i = temp = 1
  inventoryRef.once("value").then(function(snapshot){ 
    snapshot.forEach(function(childSnapshot) {
      // product is in the database
      if(childSnapshot.val().ID == $("#defaultval1").val()){
        temp = 0
        Swal.fire(
          'This Product is already available in the stock',
          '',
          'warning'
        )
      }
    })
    if(temp == 1){
      inventoryRef.push({
        ID: $("#defaultval1").val(),
        Name: $("#defaultval2").val(),
        Type: $("#defaultval3").val(),
        Description: $("#defaultval4").val(),
        Price: $("#defaultval5").val(),   
        Quantity: $("#defaultval6").val(),
        Status: 'active',      
      }).then((snap) => {
        const key = snap.key
        while (i<=counter) {
          inventoryRef.child(key).update({
            [$("#addedkey"+i).val()]: $("#addedval"+i).val(),
          })
          i++
        }
        Swal.fire({
          position: 'top',
          icon: 'success',
          title: 'Product added successfully',
          showConfirmButton: false,
          timer: 3000
      })
      $("#addItemForm").trigger('reset')
      }).catch(function(error){
        // Handle Errors here.
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: error.message,
        })
      })
    }
  })
}
