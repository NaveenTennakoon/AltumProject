// global administrator functions
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

// new salesperson page functions
function addSalesperson() {
  if($("#password").val()==$("#cpassword").val()){
    let email = $("#email").val();
    let password = $("#password").val();
    firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
      var errorMessage = error.message;
      window.alert(errorMessage);
    }).then(()=>{
      usersRef.child(firebase.auth().currentUser.uid).set({
        firstName: $("#fname").val(),
        lastName: $("#lname").val(),
        email: email,
        telephone: $("#tel").val(),
        address: $("#address").val(),
        type: 'Salesperson',
      });
    });
    window.alert("Salesperson added succesfully");
  }
  else{window.alert("Password fields do not match")}
}

// stock management page functions
let itemNo = 0;

function loadProducts(){
  inventoryRef.once("value").then(function(snapshot){
    snapshot.forEach(function(childSnapshot){
      document.getElementById("product-items").insertAdjacentHTML(
        'beforeend',
        "<div class='shop-item'>"+
            "<b>Unique ID: </b>"+
            "<span class='shop-item-title'>"+childSnapshot.key+"</span>"+
            "<b class='ml-5'>Product ID: </b>"+childSnapshot.val().ID+
            "<div class='shop-item-details'>"+
            "<b>Name : </b>"+childSnapshot.val().Name+"<br/>"+
                "<button class='btn btn-primary view-item-button float-right' type='button'>Edit Item</button><hr class='mt-5'/>"+
            "</div>"+
        "</div>"
      );
    });
    if (document.readyState == 'loading'){
      document.addEventListener('DOMContentLoaded', ready)
    } 
    else{
      ready()
    }
  });
}

function ready() {
  let viewItemButtons = document.getElementsByClassName('view-item-button');
  for (let i = 0; i < viewItemButtons.length; i++) {
    let button = viewItemButtons[i]
    button.addEventListener('click', viewItemClicked)
  }
}

function viewItemClicked(event) {
  let button = event.target
  let shopItem = button.parentElement.parentElement
  let title = shopItem.getElementsByClassName('shop-item-title')[0].innerText
  inventoryRef.child(title).once("value").then(function(snapshot){
    snapshot.forEach(function(childSnapshot){
      document.getElementById("item-body").insertAdjacentHTML(
        'beforeend',
        "<div class='form-row my-3 mx-5'>"+
          "<div class='col-lg-4'>"+
            "<input class='form-control' id='key"+itemNo+"' value='"+childSnapshot.key+"' readonly>"+
          "</div>"+
          "<div class='col-lg-8'>"+
            "<input class='form-control' id='value"+itemNo+"' value='"+childSnapshot.val()+"'>"+
          "</div>"+
        "</div>"
      );
      itemNo++;
    });
  });
  document.getElementById("item-title").innerHTML = title;
  $('#viewModal').modal('show')
}

function clearViewModal(){
  document.getElementById("item-body").innerHTML = '';
}

function update(){
  let title = document.getElementById('item-title').innerText;
  while(itemNo>0){
    itemNo--;
    inventoryRef.child(title).update({
      [$("#key"+itemNo).val()]: $("#value"+itemNo).val(),
    });
  }
  clearViewModal();
  window.alert("Product updated successfully");
}

// add new item page functions
let counter = 0;

function typesnapshotToArray() {
  let typeArr = [];
  inventoryRef.once("value").then(function(snapshot){
  // <!-- snapshot of childs of root of database-->
    snapshot.forEach(function(childSnapshot) {
      if(typeArr.length == 0){
        let item = childSnapshot.val().Type;
        typeArr.push(item);
    }
      else{
        let flag = i = 0;
        while(i<typeArr.length){
          if(childSnapshot.val().Type == typeArr[i]){
            flag = 1;
          }
          i++;
        }
        if(flag == 0){
          let item = childSnapshot.val().Type;
          typeArr.push(item);
        }     
      }
    });
  }).catch(function(error){
    // Handle Errors here.
    let errorMessage = error.message;
    window.alert(errorMessage);
  });
  autocomplete(document.getElementById("defaultval3"), typeArr);
};

function addInput(divName){
  counter++;
  let newdiv = document.createElement('div');
  newdiv.setAttribute('id', 'div_' + counter);
  newdiv.innerHTML = "<div class='form-row my-3'><div class='col-lg-4'><input class='form-control' id='addedkey"+counter+"' placeholder='Enter key field'> </div><div class='col-lg-8'><input class='form-control' id='addedval"+counter+"' placeholder='Value of key'></div></div>";           
  document.getElementById(divName).appendChild(newdiv);     
}


function deleteInput(divName){
  if(0 < counter) {
    document.getElementById(divName).removeChild(document.getElementById('div_' + counter));
    counter--;
  } else {
    alert("Nothing to remove");
  }
}

function additem(){
  let i = temp = 1;
  inventoryRef.once("value").then(function(snapshot){ 
    snapshot.forEach(function(childSnapshot) {
      if(childSnapshot.val().ID == $("#defaultval1").val()){
        temp = 0;
        window.alert('This Product is already available in the stock');
      }
    });
    if(temp == 1){
      inventoryRef.push({
        ID: $("#defaultval1").val(),
        Name: $("#defaultval2").val(),
        Type: $("#defaultval3").val(),
        Description: $("#defaultval4").val(),
        Price: $("#defaultval5").val(),   
        Quantity: $("#defaultval6").val(),      
      }).then((snap) => {
        const key = snap.key;
        while (i<=counter) {
          inventoryRef.child(key).update({
            [$("#addedkey"+i).val()]: $("#addedval"+i).val(),
          });
          i++;
        }
      }).catch(function(error){
        // Handle Errors here.
        let errorMessage = error.message;
        window.alert(errorMessage);
      });
    }
  });
}

// location history page functions
function spsnapshotToArray() {
  let spArr = [];
  usersRef.once("value").then(function(snapshot){
  // <!-- snapshot of childs of root of database-->
    snapshot.forEach(function(childSnapshot) {
      if(childSnapshot.val().type == 'salesperson'){
        let item = childSnapshot.val().firstName+" "+childSnapshot.val().lastName;
        spArr.push(item); 
      }
    });
  }).catch(function(error){
    // Handle Errors here.
    let errorMessage = error.message;
    window.alert(errorMessage);
  });
  autocomplete(document.getElementById("spLocations"), spArr);
};

function loadLocations(){
  let search = document.getElementById("spLocations").value;
  document.getElementById("locations").innerHTML = '';
  if(!search){
    gpsRef.child("locations").once("value").then(function(snaphot){
      snaphot.forEach(function(childSnapshot){
        document.getElementById("locations").insertAdjacentHTML(
          'beforeend',
          "<div class='location-item'>"+
            "<p><b>Location ID: </b>"+
            "<span class='location-item-title'>"+childSnapshot.key+"</span><p>"+
            "<b class='col-lg-3'>Salesperson ID: </b>"+childSnapshot.val().salesperson+
            "<b class='ml-5'>Latitude: </b>"+childSnapshot.val().lat+
            "<b class='ml-3'>Longitude: </b>"+childSnapshot.val().lng+"<br/>"+
            "<b class='col-lg-3'>Time Stamp: </b>"+childSnapshot.val().timestamp+"<br/>"+
            "<b class='col-lg-3'>Customer Name: </b>"+childSnapshot.val().customer+"<br/>"+
            "<b class='col-lg-3'>Shop: </b>"+childSnapshot.val().shopname+"<br/>"+
            "<b class='col-lg-3'>Address : </b>"+childSnapshot.val().address+"<br/>"+
            "<button class='btn btn-primary view-location-button float-right' type='button'>View on Map</button><hr class='mt-5'/>"+
          "</div>"
        );
      })
    }).then(()=>{
      locationButtons();
    })
  }
  else{
    let name = '';
    usersRef.once("value").then(function(snapshot){
      snapshot.forEach(function(childSnapshot){
        if(childSnapshot.val().firstName+" "+childSnapshot.val().lastName == search){
          name = childSnapshot.key;
        }
      })
    })
    gpsRef.child("locations").once("value").then(function(snaphot){
      snaphot.forEach(function(childSnapshot){
        if(childSnapshot.val().salesperson == name){
          document.getElementById("locations").insertAdjacentHTML(
            'beforeend',
            "<div class='location-item'>"+
              "<p><b>Location ID: </b>"+
              "<span class='location-item-title'>"+childSnapshot.key+"</span><p>"+
              "<b class='col-lg-3'>Salesperson ID: </b>"+childSnapshot.val().salesperson+
              "<b class='ml-5'>Latitude: </b>"+childSnapshot.val().lat+
              "<b class='ml-3'>Longitude: </b>"+childSnapshot.val().lng+"<br/>"+
              "<b class='col-lg-3'>Time Stamp: </b>"+childSnapshot.val().timestamp+"<br/>"+
              "<b class='col-lg-3'>Customer Name: </b>"+childSnapshot.val().customer+"<br/>"+
              "<b class='col-lg-3'>Shop: </b>"+childSnapshot.val().shopname+"<br/>"+
              "<b class='col-lg-3'>Address : </b>"+childSnapshot.val().address+"<br/>"+
              "<button class='btn btn-primary view-location-button float-right' type='button'>View on Map</button><hr class='mt-5'/>"+
            "</div>"
          );
        }
      })
    }).then(()=>{
      locationButtons();
    }) 
  }
}

function locationButtons() {
  let viewLocationButtons = document.getElementsByClassName('view-location-button');
  for (let i = 0; i < viewLocationButtons.length; i++) {
    let button = viewLocationButtons[i]
    button.addEventListener('click', viewLocationClicked)
  }
}

function viewLocationClicked(event){
  let button = event.target
  let locationItem = button.parentElement;
  console.log(locationItem)
  let title = locationItem.getElementsByClassName('location-item-title')[0].innerText
  document.getElementById("location-modal-title").innerHTML = title;
  $('#locationModal').modal('show');
}

function refresh(){
  loadLocations();
  $('#locations').fadeOut('slow').load('locations').fadeIn('slow');
}

// salesperson page functions
function spkeysnapshotToArray() {
  let spArr = [];
  usersRef.once("value").then(function(snapshot){
  // <!-- snapshot of childs of root of database-->
    snapshot.forEach(function(childSnapshot) {
      if(childSnapshot.val().type == 'salesperson'){
        let item = childSnapshot.key;
        spArr.push(item); 
      }
    });
  }).catch(function(error){
    // Handle Errors here.
    let errorMessage = error.message;
    window.alert(errorMessage);
  });
  autocomplete(document.getElementById("salesperon-search"), spArr);
};

function spDetails(){
  let userid = document.getElementById("salesperon-search").value;
  usersRef.child(userid).once("value").then(function(snapshot){
    document.getElementById("fname").value = snapshot.val().firstName;
    document.getElementById("lname").value = snapshot.val().lastName;
    document.getElementById("email").value = snapshot.val().email;
    document.getElementById("tel").value = snapshot.val().telephone;
    document.getElementById("address").value = snapshot.val().address;
  }).catch(function(error){
    window.alert(error.message);
  })
}

// customer profiles page functions
function customerkeysnapshotToArray() {
  let customerArr = [];
  usersRef.once("value").then(function(snapshot){
  // <!-- snapshot of childs of root of database-->
    snapshot.forEach(function(childSnapshot) {
      if(childSnapshot.val().type == 'customer'){
        let item = childSnapshot.key;
        customerArr.push(item); 
      }
    });
  }).catch(function(error){
    // Handle Errors here.
    let errorMessage = error.message;
    window.alert(errorMessage);
  });
  autocomplete(document.getElementById("customer-search"), customerArr);
};

function customerDetails(){
  let userid = document.getElementById("customer-search").value;
  usersRef.child(userid).once("value").then(function(snapshot){
    document.getElementById("name").value = snapshot.val().name;
    document.getElementById("company").value = snapshot.val().company;
    document.getElementById("email").value = snapshot.val().email;
    document.getElementById("tel").value = snapshot.val().telephone;
    document.getElementById("address").value = snapshot.val().address;
  }).catch(function(error){
    window.alert(error.message);
  })
}

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
            "<span class='view-order-title'>"+childSnapshot.key+"</span>"+
            "<div class='view-order-details'>"+
              "<b>Total Price : </b>"+childSnapshot.val().Total+"<br/></br/>"+
              "<button class='btn btn-primary view-order-button float-right ml-2' type='button'>View Products</button>"+
              "<button class='btn btn-danger reject-order-button float-right' type='button'>Reject Order</button><hr class='mt-5'/>"+
            "</div"+
          "</div>"
        );
      }
    });
    populateProducts();
  });
}

function populateProducts() {
  let rejectOrderButtons = document.getElementsByClassName('btn-danger')
  for (let i = 0; i < rejectOrderButtons.length; i++) {
      let button = rejectOrderButtons[i]
      button.addEventListener('click', rejectOrderClicked)
  }
  let viewOrderButtons = document.getElementsByClassName('view-order-button');
  for (let i = 0; i < viewOrderButtons.length; i++) {
      let button = viewOrderButtons[i]
      button.addEventListener('click', viewOrderClicked)
  }
}

let x = 0;

function viewOrderClicked(event) {
  let button = event.target
  let shopItem = button.parentElement.parentElement
  let title = shopItem.getElementsByClassName('view-order-title')[0].innerText
  ordersRef.child(title+"/Products").once("value").then(function(snapshot){
    snapshot.forEach(function(childSnapshot){
      let tempKey = childSnapshot.key;
      let tempVal = childSnapshot.val();
      inventoryRef.once("value").then(function(snapshot){
        snapshot.forEach(function(childSnapshot){
          if(tempKey==childSnapshot.val().ID){
            ++x;
            childSnapshot.val().Quantity
            document.getElementById("order-body").insertAdjacentHTML(
              'beforeend',
              "<p><b>"+tempKey+"</b><br/>"+
              "<b id='key"+x+"'>"+childSnapshot.key+"</b></p>"+
              "<p class='ml-4'><b>Order Amount: </b><a id='quantity"+x+"'>"+tempVal+"</a></p>"+
              "<p class='ml-4'><b>Available Quantity: </b><a id='val"+x+"'>"+ childSnapshot.val().Quantity +"</a></p>"           
            );     
          }
        })
      })
    });
  });
  document.getElementById("order-title").innerHTML = title;
  $('#viewOrderModal').modal('show')
}

function rejectOrderClicked(){
  let button = event.target
  let shopItem = button.parentElement.parentElement
  let title = shopItem.getElementsByClassName('view-order-title')[0].innerText
  ordersRef.child(title).update({
    Status: 'Cancelled'
  }).then(()=>{
    window.alert("Order Has been Rejected");
    loadOrders();
  })
}

function assign(){
  let title = document.getElementById("order-title").innerHTML
  ordersRef.child(title).update({
    Status: 'Assigned'
  }).then(()=>{
    inventoryRef.once("value").then(function(snapshot){
      snapshot.forEach(function(childSnapshot){
        if(childSnapshot.key==document.getElementById("key"+x).innerHTML){
          let deduce = document.getElementById("val"+x).innerHTML - document.getElementById("quantity"+x).innerHTML;
          inventoryRef.child(childSnapshot.key).update({
            Quantity: deduce
          })
          x--;
        }
      })
    })
    window.alert("Order Has been assigned and the stock has been updated");
    loadOrders();
  })
}

function clearOrderModal(){
  document.getElementById("order-body").innerHTML = '';
}