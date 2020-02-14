firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
    ordersRef.once("value").then(function(snapshot){
        snapshot.forEach(function(childSnapshot){
        // load pending orders    
        if(childSnapshot.val().Customer == firebase.auth().currentUser.uid){
            if(childSnapshot.val().Status == 'Pending'){   
                ordersRef.child(childSnapshot.key+"/Products").once("value").then(function(ccSnapshot){
                    document.getElementById("pending").insertAdjacentHTML(
                    'beforeend',
                    "<div class='form-row'>"+
                        "<p><b class='col-lg-3'>Order ID: </b>"+childSnapshot.val().orderId+"</p>"+
                    "</div>"+
                    "<div class='form-row'>"+
                        "<p><b class='col-lg-3'>Total Price: </b>"+childSnapshot.val().Total+"</p>"+
                    "</div>"
                    )
                    ccSnapshot.forEach(function(products){
                    document.getElementById("pending").insertAdjacentHTML(
                        'beforeend',
                        "<p><a class='mx-3'>"+products.key+": </a>"+products.val()+"</p>"
                    )
                    })
                    document.getElementById("pending").insertAdjacentHTML(
                    'beforeend',
                    "<hr/>"
                    )
                })
            }
            // load cancelled orders
            if(childSnapshot.val().Status == 'Cancelled'){   
                ordersRef.child(childSnapshot.key+"/Products").once("value").then(function(ccSnapshot){
                    document.getElementById("cancelled").insertAdjacentHTML(
                    'beforeend',
                    "<div class='form-row'>"+
                        "<p><b class='col-lg-3'>Order ID: </b>"+childSnapshot.val().orderId+"</p>"+
                    "</div>"+
                    "<div class='form-row'>"+
                        "<p><b class='col-lg-3'>Total Price: </b>"+childSnapshot.val().Total+"</p>"+
                    "</div>"
                    )
                    ccSnapshot.forEach(function(products){
                    document.getElementById("cancelled").insertAdjacentHTML(
                        'beforeend',
                        "<p><a class='mx-3'>"+products.key+": </a>"+products.val()+"</p>"
                    )
                    })
                    document.getElementById("cancelled").insertAdjacentHTML(
                    'beforeend',
                    "<hr/>"
                    )
                })
            }
            // load completed orders
            else if(childSnapshot.val().Status == 'Completed'){
            document.getElementById("completed").insertAdjacentHTML(
                'beforeend',
                "<div class='view-item'>"+
                "<b>Order ID: </b>"+
                "<span class='view-item-title' style='display: none'>"+childSnapshot.key+"</span>"+
                "<span class='view-item-id'>"+childSnapshot.val().orderId+"</span>"+
                "<div class='view-item-details'>"+
                    "<b>Total Price : </b>"+childSnapshot.val().Total+"<br/>"+
                    "<button class='btn btn-primary view-item-button float-right' type='button'>View Products</button><hr class='mt-5'/>"+
                    "</div>"+
                "</div>"
            )
            ready()
            }
        }
        })
    })
    }
})
  
  // listeners for view buttons
  function ready(){
    let viewItemButtons = document.getElementsByClassName('view-item-button')
    for (let i = 0; i < viewItemButtons.length; i++) {
        let button = viewItemButtons[i]
        button.addEventListener('click', viewOrderItemClicked)
    }
  }
  
  // view the selected order in modal
  function viewOrderItemClicked(event){
    let button = event.target
    let order = button.parentElement.parentElement
    let title = order.getElementsByClassName('view-item-title')[0].innerText
    let id = order.getElementsByClassName('view-item-id')[0].innerText
    ordersRef.child(title+"/Products").once("value").then(function(snapshot){
        snapshot.forEach(function(childSnapshot){
            document.getElementById("order-body").insertAdjacentHTML(
                'beforeend',
                "<p><b>Product ID: </b>"+childSnapshot.key+"<b class='ml-4'>Items: </b>"+childSnapshot.val()+"</p>"
            )
        })
    })
    document.getElementById("order-title").innerHTML = id
    $('#viewModal').modal({backdrop: 'static', keyboard: false})
    $('#viewModal').modal('show')
  }
  
  function clearOrderViewModal(){
    document.getElementById("order-body").innerHTML = ''
  }
  