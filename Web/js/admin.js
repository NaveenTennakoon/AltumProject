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
        type: 'salesperson',
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
            "<b>Location ID: </b>"+
            "<span class='location-item-title'>"+childSnapshot.key+"</span><br/><br/>"+
            "<b class='col-lg-3'>Salesperson ID: </b>"+childSnapshot.val().salesperson+
            "<b class='ml-5'>Latitude: </b><a class='location-lat'>"+childSnapshot.val().lat+"</a>"+
            "<b class='ml-3'>Longitude: </b><a class='location-lng'>"+childSnapshot.val().lng+"</a><br/>"+
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
              "<b>Location ID: </b>"+
              "<span class='location-item-title'>"+childSnapshot.key+"</span><br/><br/>"+
              "<b class='col-lg-3'>Salesperson ID: </b>"+childSnapshot.val().salesperson+
              "<b class='ml-5'>Latitude: </b><a class='location-lat'>"+childSnapshot.val().lat+"<a/>"+
              "<b class='ml-3'>Longitude: </b><a class='location-lng'>"+childSnapshot.val().lng+"</a><br/>"+
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

let history_map;

function viewLocationClicked(event){
  let button = event.target
  let locationItem = button.parentElement;
  let title = locationItem.getElementsByClassName('location-item-title')[0].innerText;
  let loc_lat = parseFloat(locationItem.getElementsByClassName('location-lat')[0].innerHTML);
  let loc_lng = parseFloat(locationItem.getElementsByClassName('location-lng')[0].innerHTML);
  document.getElementById('location-modal-title').innerHTML = title;
  history_map = new google.maps.Map(document.getElementById('map'), {
    streetViewControl: false,
    mapTypeControl: false,
    center: {lat: loc_lat, lng: loc_lng},
    zoom: 9
  });
  let position = {
    lat: loc_lat,
    lng: loc_lng
  };
  marker = new google.maps.Marker({
    icon: {
      url: './img/marker.png',
    },
    position: position,
    map: history_map
  });
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
              "<button class='btn btn-primary view-order-button float-right ml-3' type='button'>Assign</button>"+
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
              "<p class='ml-4'><b>Available Quantity: </b><a id='val"+x+"'>"+ childSnapshot.val().Quantity +"</a></p><hr/>"           
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

// signup page functions
let map, marker, lat, lng;

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    streetViewControl: false,
    mapTypeControl: false,
    center: {lat: -34.397, lng: 150.644},
    zoom: 11
  });
  map.addListener('click', function(e) {
    lat = e.latLng.lat();
    lng = e.latLng.lng();
    placeMarker(e.latLng, map);
  });

  if (navigator.geolocation){
    navigator.geolocation.getCurrentPosition(function(position) {
      let pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      lat = position.coords.latitude;
      lng = position.coords.longitude;
      placeMarker(pos, map);
      map.setCenter(pos);
    });
  } 
  else{
    window.alert("Something went wrong with location Access");
  }
}

function placeMarker(position, map) {
  if (marker == null){
    marker = new google.maps.Marker({
      icon: {
        url: './img/marker.png',
      },
      position: position,
      map: map
    });
  }
  else{   
    marker.setPosition(position); 
  }
  map.panTo(position);
}

function signup(){
  // Get input values from each of the form elements
  let company = $("#company").val();
  let telephone = $("#tel").val();
  let email = $("#email").val();
  let name = $("#name").val();
  let pwd = $("#password").val();
  let address = $("#address").val();

  if(pwd == $("#cpassword").val()){
    firebase.auth().createUserWithEmailAndPassword(email, pwd).catch(function(error) {
      var errorMessage = error.message;
      window.alert(errorMessage);
    }).then(()=>{
      // Push the new customer to the database using those values
        usersRef.child(firebase.auth().currentUser.uid).set({
          company: company,
          telephone: telephone,
          email: email,
          name: name,
          address: address,
          type: 'customer',
          longitude: lng,
          latitude: lat
        });
        window.alert("You have successfully signed in to Altum")
      location.href='cus_dashboard.html'
    });
  }
  else{
    window.alert("Password Mismatch");
  }
}

// track now page functions
function spkeysToArray() {
  let spKeyArr = [];
  gpsRef.child("live").once("value").then(function(snapshot){
  // <!-- snapshot of childs of root of database-->
    snapshot.forEach(function(childSnapshot) {
      let item = childSnapshot.key;
      spKeyArr.push(item); 
    });
  }).catch(function(error){
    // Handle Errors here.
    let errorMessage = error.message;
    window.alert(errorMessage);
  });
  autocomplete(document.getElementById("track_id"), spKeyArr);
};

let markers = [];

function initTrackMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    streetViewControl: false,
    mapTypeControl: false,
    center: {lat: -34.397, lng: 150.644},
    zoom: 15
  });

  if (navigator.geolocation){
    navigator.geolocation.getCurrentPosition(function(position) {
      let pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      lat = position.coords.latitude;
      lng = position.coords.longitude;
      map.setCenter(pos);
    });
  } 
  else{
    window.alert("Something went wrong with location Access");
  }

  gpsRef.child('live').on('child_added', function (snapshot) {
    AddMarker(snapshot);
    if(snapshot.val().status == 'inactive'){
      markers[snapshot.key].setMap(null);
    }
  });
  
  gpsRef.child('live').on('child_changed', function (snapshot) {
      markers[snapshot.key].setMap(null);
      AddMarker(snapshot);
      if(snapshot.val().status == 'inactive'){
        markers[snapshot.key].setMap(null);
      }
  });
}

function AddMarker(snapshot) {
  let uluru = { lat: snapshot.val().lat, lng: snapshot.val().lng };
  let marker = new google.maps.Marker({
      position: uluru,
      icon: {
        url: '../marker.svg',
      },
      map: map,
      title: snapshot.key,
  });
  markers[snapshot.key] = marker;
}

function searchClicked(){
  child = document.getElementById("track_id").value;
  gpsRef.child('live/'+child).once('value').then(function(snapshot){
    if(snapshot.val().status == 'inactive'){
      window.alert("Sales person's location is inactive");
    }
    else if(snapshot.val().status == 'active'){
      let pos = {
        lat: snapshot.val().lat,
        lng: snapshot.val().lng
      }; 
      map.panTo(pos);
    }
  })
}

