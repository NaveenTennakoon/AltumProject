let typesArr = []
inventoryRef.once("value").then(function(snapshot){
    snapshot.forEach(function(childSnapshot){
      // pouplate the types array
      if(childSnapshot.val().Status == 'active'){
        if(typesArr.length == 0){
            let item = childSnapshot.val().Type
            typesArr.push(item)
        }
        else{
            let flag = i = 0
            while(i<typesArr.length){
            if(childSnapshot.val().Type == typesArr[i]){
                flag = 1
            }
            i++
            }
            if(flag == 0){
            let item = childSnapshot.val().Type
            typesArr.push(item)
            }
        }
        // add product to items div
        document.getElementById("product-items").insertAdjacentHTML(
            'beforeend',
            "<div class='shop-item'>"+
            "<p><b>Product ID: </b><a class='shop-item-title'>"+childSnapshot.val().ID+"</a><b class='ml-3'>Unique ID: </b><a>"+childSnapshot.key+"</a></p>"+
            "<div class='shop-item-details'>"+
            "<b>Name : </b>"+childSnapshot.val().Name+"<br/>"+
            "<b>Price : </b>"+"<a class='shop-item-price'>"+childSnapshot.val().Price+"</a><br/>"+
                "<button class='btn btn-primary shop-item-button float-right ml-4' type='button'>Add to Order</button>"+
                "<button class='btn btn-primary view-item-button float-right' type='button'>View Item</button><hr class='mt-5'/>"+
            "</div>"+
            "</div>"
        )
      }
    })
    populateProducts()
}).then(()=>{
  // populate the types filter
    let x = 0
    while(x<typesArr.length){
    document.getElementById("product-type").insertAdjacentHTML(
        'beforeend',
        "<a class='dropdown-item' type='button' onclick='filterbyType(\""+typesArr[x]+"\")'>"+typesArr[x]+"</a>"
    )
    x++
    }
})
  
  // populate the edit modal with details of selected item
  function populateEditModal(){
    document.getElementById("view-profile-body").innerHTML = ''
    document.getElementById("edit-profile-title").innerText = firebase.auth().currentUser.email
    usersRef.child(firebase.auth().currentUser.uid).once("value").then(function(snapshot){
      document.getElementById("edit-profile-body").insertAdjacentHTML(
        'beforeend',
        "<div class='form-row my-3 mx-3'>"+
          "<div class='col-lg-3'>"+
            "<a value='Name'><strong>Name</strong></a>"+
          "</div>"+
          "<div class='col-lg-9'>"+
            "<input class='form-control' id='name' value='"+snapshot.val().name+"'>"+
          "</div>"+
        "</div>"+
        "<div class='form-row my-3 mx-3'>"+
          "<div class='col-lg-3'>"+
            "<a value='Name'><strong>Company</strong></a>"+
          "</div>"+
          "<div class='col-lg-9'>"+
            "<input class='form-control' id='company' value='"+snapshot.val().company+"'>"+
          "</div>"+
        "</div>"+
        "<div class='form-row my-3 mx-3'>"+
          "<div class='col-lg-3'>"+
            "<a value='Name'><strong>Contact Number</strong></a>"+
          "</div>"+
          "<div class='col-lg-7'>"+
            "<input class='form-control' id='tel' value='"+snapshot.val().telephone+"'>"+
          "</div>"+
        "</div>"+
        "<div class='form-row my-3 mx-3'>"+
          "<div class='col-lg-3'>"+
            "<a value='Name'><strong>Address</strong></a>"+
          "</div>"+
          "<div class='col-lg-9'>"+
            "<textarea class='form-control' id='address'>"+snapshot.val().address+"</textarea>"+
          "</div>"+
        "</div>"
      )
    })
    // show modal
    $('#editProfileModal').modal({backdrop: 'static', keyboard: false})
    $('#editProfileModal').modal('show')
  }
  
  // filtering process
  function filterbyType(type){
    document.getElementById("product-items").innerHTML = ''
    // no filters
    if(type == 'all'){
      inventoryRef.once("value").then(function(snapshot){
        snapshot.forEach(function(childSnapshot){
          // populate products
          if(childSnapshot.val().Status == 'active'){
            document.getElementById("product-items").insertAdjacentHTML(
              'beforeend',
              "<div class='shop-item'>"+
                "<p><b>Product ID: </b><a class='shop-item-title'>"+childSnapshot.val().ID+"</a><b class='ml-3'>Unique ID: </b><a>"+childSnapshot.key+"</a></p>"+
                "<div class='shop-item-details'>"+
                "<b>Name : </b>"+childSnapshot.val().Name+"<br/>"+
                "<b>Price : </b>"+"<a class='shop-item-price'>"+childSnapshot.val().Price+"</a><br/>"+
                  "<button class='btn btn-primary shop-item-button float-right ml-4' type='button'>Add to Order</button>"+
                  "<button class='btn btn-primary view-item-button float-right' type='button'>View Item</button><hr class='mt-5'/>"+
                "</div>"+
              "</div>"
            )
          }
        })
        if (document.readyState == 'loading'){
          document.addEventListener('DOMContentLoaded', ready)
        } 
        else{
          populateProducts()
        }
      })
    }
    // filter selected
    else{
      inventoryRef.once("value").then(function(snapshot){
        snapshot.forEach(function(childSnapshot){
          // populate products
          if(childSnapshot.val().Type == type && childSnapshot.val().Status == 'active'){
            document.getElementById("product-items").insertAdjacentHTML(
              'beforeend',
              "<div class='shop-item'>"+
                "<p><b>Product ID: </b><a class='shop-item-title'>"+childSnapshot.val().ID+"</a><b class='ml-3'>Unique ID: </b><a>"+childSnapshot.key+"</a></p>"+
                "<div class='shop-item-details'>"+
                "<b>Name : </b>"+childSnapshot.val().Name+"<br/>"+
                "<b>Price : </b>"+"<a class='shop-item-price'>"+childSnapshot.val().Price+"</a><br/>"+
                  "<button class='btn btn-primary shop-item-button float-right ml-4' type='button'>Add to Order</button>"+
                  "<button class='btn btn-primary view-item-button float-right' type='button'>View Item</button><hr class='mt-5'/>"+
                "</div>"+
              "</div>"
            )
          }
        })
        if (document.readyState == 'loading'){
          document.addEventListener('DOMContentLoaded', ready)
        } 
        else{
          populateProducts()
        }
      })
    }
  }
  
  // event listeners for the product items
  function populateProducts() {
    let removeCartItemButtons = document.getElementsByClassName('btn-danger')
    for (let i = 0; i < removeCartItemButtons.length; i++) {
        let button = removeCartItemButtons[i]
        button.addEventListener('click', removeCartItem)
    }
    let quantityInputs = document.getElementsByClassName('cart-quantity-input')
    for (let i = 0; i < quantityInputs.length; i++) {
        let input = quantityInputs[i]
        input.addEventListener('change', quantityChanged)
    }
    let addToCartButtons = document.getElementsByClassName('shop-item-button')
    for (let i = 0; i < addToCartButtons.length; i++) {
        let button = addToCartButtons[i]
        button.addEventListener('click', addToCartClicked)
    }
    let viewItemButtons = document.getElementsByClassName('view-item-button')
    for (let i = 0; i < viewItemButtons.length; i++) {
        let button = viewItemButtons[i]
        button.addEventListener('click', viewItemClicked)
    }
    document.getElementsByClassName('btn-purchase')[0].addEventListener('click', purchaseClicked)
  }
  
  // checking out the cart
  function purchaseClicked() {
    let cartItem = document.getElementsByClassName('cart-item')
    let cartTotal = document.getElementsByClassName('cart-total-price')[0].innerText
    // no selected items
    if(cartTotal == 0){
      Swal.fire(
        'No items in the cart',
        '',
        'warning'
      )
    }
    else{
      let cartItems = document.getElementsByClassName('cart-items')[0]
      let date = new Date()
      let qtyFlag = 0
      inventoryRef.once("value").then(function(snapshot){
        for(let i = 0; i < cartItem.length; i++){
          let cartItemName = document.getElementsByClassName('cart-item-title')[i].innerText
          let cartItemQuantity = document.getElementsByClassName('cart-quantity-input')[i].value
          snapshot.forEach(function(childSnapshot){
            if((childSnapshot.val().ID === cartItemName) && parseInt(childSnapshot.val().Quantity) < cartItemQuantity) 
              qtyFlag = 1
          })
        }
      }).then(()=>{
        // items exceeding stock
        if(qtyFlag == 1){
          Swal.fire(
          'One or more items are exceeding our stock quantity',
          '',
          'warning'
          )
        }
        else{
          //generate order id
          let str = firebase.auth().currentUser.uid+date.getTime()
          let hash = Math.abs(str.split('').reduce((a, b) => {a = ((a << 5) - a) + b.charCodeAt(0); return a&a}, 0))
          // record order in database
          ordersRef.push({
            Customer: firebase.auth().currentUser.uid,
            Total: cartTotal,
            Status: 'Pending',
            payment: 'Cash',
            orderDate: date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate(),
            orderId: hash,
          }).then((snap) => {
            Swal.fire({
              position: 'top',
              icon: 'success',
              title: 'Order Submitted successfully',
              showConfirmButton: false,
              timer: 3000
            })
            const key = snap.key
            for(let i = 0; i < cartItem.length; i++){
              let cartItemName = document.getElementsByClassName('cart-item-title')[i].innerText
              let cartItemQuantity = document.getElementsByClassName('cart-quantity-input')[i].value
              ordersRef.child(key+'/Products').update({
                [cartItemName]: cartItemQuantity,
              })
            }  
            while (cartItems.hasChildNodes()) {
              cartItems.removeChild(cartItems.firstChild)
            }
            updateCartTotal()
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
  }
  
  // clear the cart
  function clearOrder(){
    let cartItems = document.getElementsByClassName('cart-items')[0]
    while (cartItems.hasChildNodes()) {
        cartItems.removeChild(cartItems.firstChild)
    }
    updateCartTotal()
  }
  
  // removing item from the cart
  function removeCartItem(event) {
    let buttonClicked = event.target
    buttonClicked.parentElement.parentElement.remove()
    updateCartTotal()
  }
  
  // changing the quantity of a cart item
  function quantityChanged(event) {
    let input = event.target
    if (isNaN(input.value) || input.value <= 0) input.value = 1
    updateCartTotal()
  }
  
  // viewing an item
  function viewItemClicked(event) {
    let button = event.target
    let shopItem = button.parentElement.parentElement
    let title = shopItem.getElementsByClassName('shop-item-title')[0].innerText
    inventoryRef.once("value").then(function(snapshot){
      snapshot.forEach(function(childSnapshot){
        if(childSnapshot.val().ID == title){
          childSnapshot.forEach(function(ccSnapshot){
            document.getElementById("item-body").insertAdjacentHTML(
              'beforeend',
              "<p><b>"+ccSnapshot.key+"</b>: "+ccSnapshot.val()+"</p>"
            )
          })
        }
      })
    })
    document.getElementById("item-title").innerHTML = title
    $('#viewProductModal').modal({backdrop: 'static', keyboard: false})
    $('#viewProductModal').modal('show')
  }
  
  // adding item to cart
  function addToCartClicked(event) {
    let button = event.target
    let shopItem = button.parentElement.parentElement
    let title = shopItem.getElementsByClassName('shop-item-title')[0].innerText
    let price = shopItem.getElementsByClassName('shop-item-price')[0].innerText
    addItemToCart(title, price)
    updateCartTotal()
  }
  
  function addItemToCart(title, price) {
    let cartRow = document.createElement('div')
    cartRow.classList.add('cart-row')
    let cartItems = document.getElementsByClassName('cart-items')[0]
    let cartItemNames = cartItems.getElementsByClassName('cart-item-title')
    for (let i = 0; i < cartItemNames.length; i++) {
        if (cartItemNames[i].innerText == title) {
            Swal.fire(
              'Item is already in the cart',
              '',
              'warning'
              )
            return
        }
    }
    // a row for the product
    let cartRowContents = 
        `<div class="cart-item cart-column">
            <span class="cart-item-title">${title}</span>
        </div>
        <span class="cart-price cart-column">${price}</span>
        <div class="cart-quantity cart-column mb-3">
            <input class="cart-quantity-input" type="number" value="1">
            <button class="btn btn-danger ml-4" type="button">REMOVE</button>
        </div><hr/>`
    cartRow.innerHTML = cartRowContents
    cartItems.append(cartRow)
    cartRow.getElementsByClassName('btn-danger')[0].addEventListener('click', removeCartItem)
    cartRow.getElementsByClassName('cart-quantity-input')[0].addEventListener('change', quantityChanged)
  }
  
  // update the total price of the cart
  function updateCartTotal() {
    let cartItemContainer = document.getElementsByClassName('cart-items')[0]
    let cartRows = cartItemContainer.getElementsByClassName('cart-row')
    let total = 0
    for (let i = 0; i < cartRows.length; i++) {
        let cartRow = cartRows[i]
        let priceElement = cartRow.getElementsByClassName('cart-price')[0]
        let quantityElement = cartRow.getElementsByClassName('cart-quantity-input')[0]
        let price = parseFloat(priceElement.innerText.replace('$', ''))
        let quantity = quantityElement.value
        total = total + (price * quantity)
    }
    total = Math.round(total * 100) / 100
    document.getElementsByClassName('cart-total-price')[0].innerText = total
  }
  
  function clearViewModal(){
    document.getElementById("item-body").innerHTML = ''
  }
  
// paypal buttons for checkout
paypal.Buttons({
    createOrder: function(data, actions) {
    let cartTotal = document.getElementsByClassName('cart-total-price')[0].innerText;
    return actions.order.create({
        purchase_units: [{
        amount: {
            value: cartTotal
        }
        }],
        application_context: {
        shipping_preference: 'NO_SHIPPING'
        }
        
    });
    },
    onApprove: function(data, actions) {
      // record order in the database
    let cartItem = document.getElementsByClassName('cart-item')
    let cartTotal = document.getElementsByClassName('cart-total-price')[0].innerText
    let cartItems = document.getElementsByClassName('cart-items')[0]
    let date = new Date();
    let str = firebase.auth().currentUser.uid+date.getTime()
    let hash = Math.abs(str.split('').reduce((a, b) => {a = ((a << 5) - a) + b.charCodeAt(0); return a&a}, 0))
    ordersRef.push({
        Customer: firebase.auth().currentUser.uid,
        Total: cartTotal,
        Status: 'Pending',
        payment: 'Online',
        orderDate: date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate(),
        paymentDate: date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate(), 
        orderId: hash,
        }).then((snap) => {
        const key = snap.key;
        for(let i = 0; i < cartItem.length; i++){
            let cartItemName = document.getElementsByClassName('cart-item-title')[i].innerText
            let cartItemQuantity = document.getElementsByClassName('cart-quantity-input')[i].value
            ordersRef.child(key+'/Products').update({
                [cartItemName]: cartItemQuantity,
            })
        }  
        while (cartItems.hasChildNodes()) {
            cartItems.removeChild(cartItems.firstChild)
        }
        updateCartTotal()
    }).catch(function(error){
        // Handle Errors here.
        let errorMessage = error.message;
        window.alert(errorMessage);
    });
    
    return actions.order.capture().then(function(details) {
        alert('Transaction completed by ' + details.payer.name.given_name);
        // Call server to save the transaction
        return fetch('/paypal-transaction-complete', {
        method: 'post',
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify({
            orderID: data.orderID 
        })
        });
    });
    }, 
}).render('#paypal-button-container');
    
  