// global funcitons for customer pages
function userid(){
  firebase.auth().onAuthStateChanged(function(user){
    if(user){
      usersRef.child(firebase.auth().currentUser.uid).once("value").then(function(snapshot){
        let uid = snapshot.val().name;
        document.getElementById("uid").innerHTML = uid; 
      }).catch(function(error){
        window.alert(error.message);
      });
    }
  });
}

function logout(){
  firebase.auth().signOut().then(function(){
    // Sign-out successful.
    location.href = "index.html";
  }).catch(function(error) {
    // An error happened.
    let errorMessage = error.message;
    window.alert(errorMessage);
  });
}

function signout(){
  usersRef.child(firebase.auth().currentUser.uid).remove().then(() => {
    firebase.auth().currentUser.delete().then(() => {
      location.href = 'index.html';
    }).catch(function(error){
      window.alert(error.message);
    })
  })
}

// Customer dashboard page functions
function getProfile(){
  document.getElementById("view-profile-title").innerText = firebase.auth().currentUser.email;
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
    );
  });
  $('#viewProfileModal').modal({backdrop: 'static', keyboard: false});
  $('#viewProfileModal').modal('show')
}

function populateEditModal(){
  document.getElementById("view-profile-body").innerHTML = '';
  document.getElementById("edit-profile-title").innerText = firebase.auth().currentUser.email;
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
    );
  });
  $('#editProfileModal').modal({backdrop: 'static', keyboard: false});
  $('#editProfileModal').modal('show')
}

function updateProfile(){
  usersRef.child(firebase.auth().currentUser.uid).update({
    name: $("#name").val(),
    company: $("#company").val(),
    telephone: $("#tel").val(),
    address: $("#address").val(),
  }).then(()=>{
    window.alert("Profile updated successfully");
  }).catch(function(error){
      // Handle Errors here.
      let errorMessage = error.message;
      window.alert(errorMessage);
  });
}

function loadProducts(){
  inventoryRef.once("value").then(function(snapshot){
    snapshot.forEach(function(childSnapshot){
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
      );
    });
    populateProducts()
  });
}

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
  let addToCartButtons = document.getElementsByClassName('shop-item-button');
  for (let i = 0; i < addToCartButtons.length; i++) {
      let button = addToCartButtons[i]
      button.addEventListener('click', addToCartClicked)
  }
  let viewItemButtons = document.getElementsByClassName('view-item-button');
  for (let i = 0; i < viewItemButtons.length; i++) {
      let button = viewItemButtons[i]
      button.addEventListener('click', viewItemClicked)
  }
  document.getElementsByClassName('btn-purchase')[0].addEventListener('click', purchaseClicked)
}

function purchaseClicked() {
  let cartItem = document.getElementsByClassName('cart-item')
  let cartTotal = document.getElementsByClassName('cart-total-price')[0].innerText
  let cartItems = document.getElementsByClassName('cart-items')[0]
  let date = new Date();
  ordersRef.push({
      Customer: firebase.auth().currentUser.uid,
      Total: cartTotal,
      Status: 'Pending',
      payment: 'Cash',
      orderDate: date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate(),
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
}

function clearOrder(){
  let cartItems = document.getElementsByClassName('cart-items')[0]
  while (cartItems.hasChildNodes()) {
      cartItems.removeChild(cartItems.firstChild)
  }
  updateCartTotal()
}

function removeCartItem(event) {
  let buttonClicked = event.target
  buttonClicked.parentElement.parentElement.remove()
  updateCartTotal()
}

function quantityChanged(event) {
  let input = event.target
  if (isNaN(input.value) || input.value <= 0) {
      input.value = 1
  }
  updateCartTotal()
}

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
          );
        })
      }
    });
  });
  document.getElementById("item-title").innerHTML = title;
  $('#viewProductModal').modal({backdrop: 'static', keyboard: false});
  $('#viewProductModal').modal('show')
}

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
          alert('This item is already added to the cart')
          return
      }
  }
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
  document.getElementById("item-body").innerHTML = '';
}

function loadPaypal(){
  paypal.Buttons({
    createOrder: function(data, actions) {
      let cartTotal = document.getElementsByClassName('cart-total-price')[0].innerText;
      console.log(cartTotal);
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
      let cartItem = document.getElementsByClassName('cart-item')
      let cartTotal = document.getElementsByClassName('cart-total-price')[0].innerText
      let cartItems = document.getElementsByClassName('cart-items')[0]
      let date = new Date();
      ordersRef.push({
        Customer: firebase.auth().currentUser.uid,
        Total: cartTotal,
        Status: 'Completed',
        payment: 'Online',
        orderDate: date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate(),
        paymentDate: date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate(), 
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
        // Call your server to save the transaction
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
}
  

// Personal Orders page functions
function loadOrders(){
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      ordersRef.once("value").then(function(snapshot){
        snapshot.forEach(function(childSnapshot){
          if(childSnapshot.val().Customer == firebase.auth().currentUser.uid){
            if(childSnapshot.val().Status == 'Pending'){
              document.getElementById("pending").insertAdjacentHTML(
                'beforeend',
                "<p><b>Order ID</b></p>"+
                "<p class='ml-4'>"+childSnapshot.key+"</p>"+
                "<p><b>Total Price</b></p>"+
                "<p class='ml-4'>"+childSnapshot.val().Total+"</p><br/>"
              );
              ordersRef.child(childSnapshot.key+"/Products").once("value").then(function(ccSnapshot){
                ccSnapshot.forEach(function(products){
                  document.getElementById("pending").insertAdjacentHTML(
                    'beforeend',
                    "<p><a class='mx-3'>"+products.key+": </a>"+products.val()+"</p>"
                  );
                })
              })
            }
            else if(childSnapshot.val().Status == 'Completed'){
              document.getElementById("completed").insertAdjacentHTML(
                'beforeend',
                "<div class='view-item'>"+
                  "<b>Product ID: </b>"+
                  "<span class='view-item-title'>"+childSnapshot.key+"</span>"+
                  "<div class='view-item-details'>"+
                    "<b>Total Price : </b>"+childSnapshot.val().Total+"<br/>"+
                        "<button class='btn btn-primary view-item-button float-right' type='button'>View Products</button><hr class='mt-5'/>"+
                    "</div>"+
                "</div>"
              );
              ready();
            }
          }
        });
      });
    }
  });
}

function ready(){
  let viewItemButtons = document.getElementsByClassName('view-item-button');
  for (let i = 0; i < viewItemButtons.length; i++) {
      let button = viewItemButtons[i]
      button.addEventListener('click', viewOrderItemClicked)
  }
}

function viewOrderItemClicked(event){
  let button = event.target
  let order = button.parentElement.parentElement
  let title = order.getElementsByClassName('view-item-title')[0].innerText
  ordersRef.child(title+"/Products").once("value").then(function(snapshot){
      snapshot.forEach(function(childSnapshot){
          document.getElementById("order-body").insertAdjacentHTML(
              'beforeend',
              "<p><b>Product ID: </b>"+childSnapshot.key+"<b class='ml-4'>Items: </b>"+childSnapshot.val()+"</p>"
          );
      });
  });
  document.getElementById("order-title").innerHTML = title;
  $('#viewModal').modal({backdrop: 'static', keyboard: false});
  $('#viewModal').modal('show')
}

function clearOrderViewModal(){
  document.getElementById("order-body").innerHTML = '';
}

// Feedback page functions
function ordersnapshotToArray() {
  let orderArr = [];
  ordersRef.once("value").then(function(snapshot){
      snapshot.forEach(function(childSnapshot){
          if(childSnapshot.val().Customer == firebase.auth().currentUser.uid){
              if(childSnapshot.val().Status == 'Completed'){
                  let item = childSnapshot.key;
                  orderArr.push(item);
              }
          }
      });
      for(let i = 0; i < orderArr.length; i++){
          document.getElementById("order_id").insertAdjacentHTML(
              'beforeend',
              "<option>"+orderArr[i]+"</option>"
          );
      }
  }).catch(function(error){
      // Handle Errors here.
      let errorMessage = error.message;
      window.alert(errorMessage);
  });
  return orderArr;
};

function view(){
    let productArr = [];
    let quantityArr = [];
    let dropdown = document.getElementById("order_id");
    let selected = dropdown.options[dropdown.selectedIndex].text;
    ordersRef.child(selected+"/Products").once("value").then(function(snapshot){
        snapshot.forEach(function(childSnapshot){
            productArr.push(childSnapshot.key);
            quantityArr.push(childSnapshot.val());
        });
    }).then(() => {
        for(let i = 0; i < productArr.length; i++){
            inventoryRef.once("value").then(function(snapshot){
              snapshot.forEach(function(childSnapshot){
                if(childSnapshot.val().ID == productArr[i]){
                  document.getElementById("order_content").insertAdjacentHTML(
                    'beforeend',
                    "<p>Name : "+childSnapshot.val().Name+"</p>"+
                    "<p>Product ID : "+childSnapshot.val().ID+"</p>"+
                    "<b>Quantity : "+quantityArr[i]+"</b><hr/>"
                );
                }
              })
            });
        }
        $('#viewfbModal').modal({backdrop: 'static', keyboard: false});
        $('#viewfbModal').modal('show')
    })
}

function clearViewOrderModal(){
  document.getElementById("order_content").innerHTML = '';
}

function submitFeedback() {
    let dropdown = document.getElementById("order_id");
    let selected = dropdown.options[dropdown.selectedIndex].text;
    let Feedback = document.getElementById("cus_feedback").value;
    ordersRef.child(selected).update({
        Feedback: Feedback
    }).then(() => {window.alert("Feedback has been successfully submitted")}).catch(function(error){
        // Handle Errors here.
        let errorMessage = error.message;
        window.alert(errorMessage);
    });
}




  







 