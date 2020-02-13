// Orders page functions
function loadOrders(){
  document.getElementById("pending-orders").innerHTML = ''
  ordersRef.once("value").then(function(snapshot){
      snapshot.forEach(function(childSnapshot){
      if(childSnapshot.val().Status == 'Pending'){
          document.getElementById("pending-orders").insertAdjacentHTML(
          'beforeend',
          "<div class='view-order'>"+
              "<b>Order ID: </b>"+
              "<span class='view-order-title' style='display: none'>"+childSnapshot.key+"</span>"+
              "<span class='view-order-id'>"+childSnapshot.val().orderId+"</span>"+
              "<div class='view-order-details'>"+
              "<b>Total Price : </b>"+childSnapshot.val().Total+"<br/></br/>"+
              "<button class='btn btn-primary view-order-button float-right ml-3' type='button'>Assign</button>"+
              "<button class='btn btn-danger reject-order-button float-right' type='button'>Reject Order</button><hr class='mt-5'/>"+
              "</div"+
          "</div>"
          )
      }
      })
      populateProducts()
  })
}
  
function populateProducts() {
    let rejectOrderButtons = document.getElementsByClassName('btn-danger')
    for (let i = 0; i < rejectOrderButtons.length; i++) {
        let button = rejectOrderButtons[i]
        button.addEventListener('click', rejectOrderClicked)
    }
    let viewOrderButtons = document.getElementsByClassName('view-order-button')
    for (let i = 0; i < viewOrderButtons.length; i++) {
        let button = viewOrderButtons[i]
        button.addEventListener('click', viewOrderClicked)
    }
}
  
let x = 0
  
function viewOrderClicked(event) {
    let button = event.target
    let shopItem = button.parentElement.parentElement
    let title = shopItem.getElementsByClassName('view-order-title')[0].innerText
    let uid = shopItem.getElementsByClassName('view-order-id')[0].innerText
    ordersRef.child(title+"/Products").once("value").then(function(snapshot){
      snapshot.forEach(function(childSnapshot){
        let tempKey = childSnapshot.key
        let tempVal = childSnapshot.val()
        inventoryRef.once("value").then(function(snapshot){
          snapshot.forEach(function(childSnapshot){
            if(tempKey==childSnapshot.val().ID){
              ++x
              childSnapshot.val().Quantity
              document.getElementById("order-body").insertAdjacentHTML(
                'beforeend',
                "<p><b>"+tempKey+"</b><br/>"+
                "<b id='key"+x+"'>"+childSnapshot.key+"</b></p>"+
                "<p class='ml-4'><b>Order Amount: </b><a id='quantity"+x+"'>"+tempVal+"</a></p>"+
                "<p class='ml-4'><b>Available Quantity: </b><a id='val"+x+"'>"+ childSnapshot.val().Quantity +"</a></p><hr/>"           
              )     
            }
          })
        })
      })
    })
    usersRef.once("value").then(function(snapshot){
    // <!-- snapshot of childs of root of database-->
      snapshot.forEach(function(childSnapshot) {
        if(childSnapshot.val().type == 'salesperson'){
          let item = childSnapshot.val().firstName+" "+childSnapshot.val().lastName
          document.getElementById("spSelect").insertAdjacentHTML(
            'beforeend',
            "<option>"+item+"</option>"
          )
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
    document.getElementById("order-title").innerHTML = title
    document.getElementById("order-id").innerHTML = uid
    $('#viewOrderModal').modal({backdrop: 'static', keyboard: false})
    $('#viewOrderModal').modal('show')
}
  
function rejectOrderClicked(){
    let button = event.target
    let shopItem = button.parentElement.parentElement
    let title = shopItem.getElementsByClassName('view-order-title')[0].innerText
    Swal.fire({
      title: 'Are you sure?',
      text: "You are trying to reject an order!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete!'
    }).then((result) => {
      if (result.value) {
        ordersRef.child(title).update({
          Status: 'Cancelled'
        }).then(()=>{
          Swal.fire(
            'Order Has been Rejected',
            '',
            'error'
          )
          loadOrders()
        })
      }
    })
}
  
function assign(){
    let title = document.getElementById("order-title").innerHTML
    let sp = document.getElementById("spSelect").value
    let key = ''
    usersRef.once("value").then(function(snapshot){
      snapshot.forEach(function(childSnapshot){
        if(childSnapshot.val().firstName+" "+childSnapshot.val().lastName == sp){
          key = childSnapshot.key
        }
      })
    }).then(()=>{
      ordersRef.child(title).update({
        Status: 'Assigned',
        salesperson: key,
      }).then(()=>{
        inventoryRef.once("value").then(function(snapshot){
          snapshot.forEach(function(childSnapshot){
            if(childSnapshot.key == document.getElementById("key"+x).innerHTML){
              let deduce = document.getElementById("val"+x).innerHTML - document.getElementById("quantity"+x).innerHTML
              inventoryRef.child(childSnapshot.key).update({
                Quantity: deduce
              })
              x--
            }
          })
        })
        Swal.fire({
          position: 'top',
          icon: 'success',
          title: 'You have successfully assigned the order',
          showConfirmButton: false,
          timer: 3000
        })
        loadOrders()
      })
    })
}
  
function clearOrderModal(){
    document.getElementById("order-body").innerHTML = ''
}
  