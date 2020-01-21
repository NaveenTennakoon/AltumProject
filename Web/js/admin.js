// global administrator functions
function logout(){
  firebase.auth().signOut().then(function(){
    // Sign-out successful.
    location.href = "index.html"
  }).catch(function(error) {
    // An error happened.
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: error.message,
    })
  })
}

// dashboard page functions
let date = new Date()
let annualTotal = 0
let monthlyTotal = 0
let year
let month
let customerNo = 0
let salesNo = 0
let recentLocCounter = 0
function dashboard(){
  ordersRef.once("value").then(function(snapshot){
    snapshot.forEach(function(childSnapshot){
      if(childSnapshot.val().paymentDate) {
        year = childSnapshot.val().paymentDate.split("/")[0]
        month = childSnapshot.val().paymentDate.split("/")[1]
        if(year == date.getFullYear()){
          annualTotal += parseFloat(childSnapshot.val().Total.replace("$", ""))
          if(month == (date.getMonth() + 1))
            monthlyTotal += parseFloat(childSnapshot.val().Total.replace("$", ""))
        } 
      }
    })
  }).then(() => {
    document.getElementById('annual-total').innerHTML = "$ "+annualTotal
    document.getElementById('monthly-total').innerHTML = "$ "+monthlyTotal
  })
  
  usersRef.once("value").then(function(snapshot){
    snapshot.forEach(function(childSnapshot){
      if(childSnapshot.val().type == 'customer')
        customerNo++
      if(childSnapshot.val().type == 'salesperson')
        salesNo++
    })
  }).then(() => {
    document.getElementById('salesperson-total').innerHTML = salesNo
    document.getElementById('customer-total').innerHTML = customerNo
  })
  
  gpsRef.child('locations').orderByChild("dateString").once("value").then(function(snapshot){
    snapshot.forEach(function(childSnapshot){
      if(recentLocCounter < 5){
        document.getElementById("recent-locations").insertAdjacentHTML(
          'beforeend',
          "<div>"+
            "<b class='text-primary'>"+childSnapshot.val().id+"</b><br/>"+
            "<b>Customer : </b>"+childSnapshot.val().customer+"<br/>"+
            "<b>Shop : </b>"+childSnapshot.val().shopname+"<br/>"+
            "<b>Address : </b>"+childSnapshot.val().address+"<hr/>"+
          "</div>"
        )
      }
      recentLocCounter++
    })
  })
}

// Reports page functions
function reportsLoad(){
  inventoryRef.once("value").then(function(snapshot){
    snapshot.forEach(function(childSnapshot){
      document.getElementById("reports-product-body").insertAdjacentHTML(
        'beforeend',
        "<tr>"+
          "<td>"+childSnapshot.val().ID+"</td>"+
          "<td>"+childSnapshot.val().Name+"</td>"+
          "<td>"+childSnapshot.val().Price+"</td>"+
          "<td>"+childSnapshot.val().Quantity+"</td>"+
        "</tr>"
      )
    })
  }).then(() => {
    $(document).ready( function () {
      $('#reports-product-table').DataTable();
    });
  })
}


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

// stock management page functions
let itemNo = 0

function loadProducts(){
  let typesArr = []
  inventoryRef.once("value").then(function(snapshot){
    snapshot.forEach(function(childSnapshot){
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
      document.getElementById("product-items").insertAdjacentHTML(
        'beforeend',
        "<div class='shop-item'>"+
          "<b class='d-none'>Unique ID: </b>"+
          "<span class='shop-item-title d-none'>"+childSnapshot.key+"</span>"+
          "<b class='ml-5'>Product ID: </b><a class='shop-item-id'>"+childSnapshot.val().ID+"</a>"+
          "<div class='shop-item-details'>"+
            "<div class='form-row'>"+
              "<a class='col-lg-4'><b>Name : </b>"+childSnapshot.val().Name+"</a><a class='col-lg-2'><b>Price : </b>"+childSnapshot.val().Price+"</a><a class='col-lg-2'><b>Quantity : </b>"+childSnapshot.val().Quantity+"</a><br/>"+
            "</div>"+
            "<button class='btn btn-primary view-item-button float-right' type='button'>Edit Item</button><hr class='mt-5'/>"+
            "</div>"+
        "</div>"
      )
    })
    if (document.readyState == 'loading'){
      document.addEventListener('DOMContentLoaded', ready)
    } 
    else{
      ready()
    }
  }).then(()=>{
    let x = 0
    while(x<typesArr.length){
      document.getElementById("product-type").insertAdjacentHTML(
        'beforeend',
        "<a class='dropdown-item' type='button' onclick='filterbyType(\""+typesArr[x]+"\")'>"+typesArr[x]+"</a>"
      )
      x++
    }
  })
}

function filterbyType(type){
  document.getElementById("product-items").innerHTML = ''
  if(type == 'all'){
    inventoryRef.once("value").then(function(snapshot){
      snapshot.forEach(function(childSnapshot){
        document.getElementById("product-items").insertAdjacentHTML(
          'beforeend',
          "<div class='shop-item'>"+
            "<b class='d-none'>Unique ID: </b>"+
            "<span class='shop-item-title d-none'>"+childSnapshot.key+"</span>"+
            "<b class='ml-5'>Product ID: </b><a class='shop-item-id'>"+childSnapshot.val().ID+"</a>"+
            "<div class='shop-item-details'>"+
              "<div class='form-row'>"+
                "<a class='col-lg-4'><b>Name : </b>"+childSnapshot.val().Name+"</a><a class='col-lg-2'><b>Price : </b>"+childSnapshot.val().Price+"</a><a class='col-lg-2'><b>Quantity : </b>"+childSnapshot.val().Quantity+"</a><br/>"+
              "</div>"+
              "<button class='btn btn-primary view-item-button float-right' type='button'>Edit Item</button><hr class='mt-5'/>"+
            "</div>"+
          "</div>"
        )
      })
      if (document.readyState == 'loading'){
        document.addEventListener('DOMContentLoaded', ready)
      } 
      else{
        ready()
      }
    })
  }
  else{
    inventoryRef.once("value").then(function(snapshot){
      snapshot.forEach(function(childSnapshot){
        if(childSnapshot.val().Type == type){
          document.getElementById("product-items").insertAdjacentHTML(
            'beforeend',
            "<div class='shop-item'>"+
              "<b class='d-none'>Unique ID: </b>"+
              "<span class='shop-item-title d-none'>"+childSnapshot.key+"</span>"+
              "<b class='ml-5'>Product ID: </b><a class='shop-item-id'>"+childSnapshot.val().ID+"</a>"+
              "<div class='shop-item-details'>"+
                "<div class='form-row'>"+
                  "<a class='col-lg-4'><b>Name : </b>"+childSnapshot.val().Name+"</a><a class='col-lg-2'><b>Price : </b>"+childSnapshot.val().Price+"</a><a class='col-lg-2'><b>Quantity : </b>"+childSnapshot.val().Quantity+"</a><br/>"+
                "</div>"+
                "<button class='btn btn-primary view-item-button float-right' type='button'>Edit Item</button><hr class='mt-5'/>"+
              "</div>"+
            "</div>"
          )
        }
      })
      if (document.readyState == 'loading'){
        document.addEventListener('DOMContentLoaded', ready)
      } 
      else{
        ready()
      }
    })
  }
}

function ready() {
  let viewItemButtons = document.getElementsByClassName('view-item-button')
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
      if(childSnapshot.key == 'Price'){
        document.getElementById("item-body").insertAdjacentHTML(
          'beforeend',
          "<div class='form-row my-3 mx-5'>"+
            "<div class=''>"+
              "<input class='form-control' id='key"+itemNo+"' value='"+childSnapshot.key+"' readonly>"+
            "</div>"+
            "<div class='col-lg-7'>"+
              "<input class='form-control' id='value"+itemNo+"' value='"+childSnapshot.val()+"'required type='number' step='0.01' min='0'>"+
            "</div>"+
          "</div>"
        )
      }
      else if(childSnapshot.key == 'Quantity'){
        document.getElementById("item-body").insertAdjacentHTML(
          'beforeend',
          "<div class='form-row my-3 mx-5'>"+
            "<div class=''>"+
              "<input class='form-control' id='key"+itemNo+"' value='"+childSnapshot.key+"' readonly>"+
            "</div>"+
            "<div class='col-lg-7'>"+
              "<input class='form-control' id='value"+itemNo+"' value='"+childSnapshot.val()+"'required type='number' min='0'>"+
            "</div>"+
          "</div>"
        )
      }
      else if(childSnapshot.key == 'ID'){
        itemNo--
      }
      else{
        document.getElementById("item-body").insertAdjacentHTML(
          'beforeend',
          "<div class='form-row my-3 mx-5'>"+
            "<div class=''>"+
              "<input class='form-control' id='key"+itemNo+"' value='"+childSnapshot.key+"' readonly>"+
            "</div>"+
            "<div class='col-lg-7'>"+
              "<input class='form-control' id='value"+itemNo+"' value='"+childSnapshot.val()+"'required>"+
            "</div>"+
          "</div>"
        )
      }
      itemNo++
    })
  })
  document.getElementById("item-id").innerHTML = title
  document.getElementById("item-title").innerHTML = shopItem.getElementsByClassName('shop-item-id')[0].innerText
  $('#viewModal').modal({backdrop: 'static', keyboard: false})
  $('#viewModal').modal('show')
}

function clearViewModal(){
  document.getElementById("item-body").innerHTML = ''
}

function update(){
  $('#editItemForm').submit(function(e){     
    e.preventDefault() 
    let title = document.getElementById('item-id').innerText
    while(itemNo>0){
      itemNo--
      inventoryRef.child(title).update({
        [$("#key"+itemNo).val()]: $("#value"+itemNo).val(),
      })
    }
    clearViewModal()
    $('#viewModal').modal('hide')
    Swal.fire({
      position: 'top',
      icon: 'success',
      title: 'Product updated successfully',
      showConfirmButton: false,
      timer: 3000
    })
  })
}

// add new item page functions
let counter = 0

function typesnapshotToArray() {
  let typeArr = []
  inventoryRef.once("value").then(function(snapshot){
  // <!-- snapshot of childs of root of database-->
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
}

function validateNewItem(){
  $('#addItemForm').submit(function(e){     
    e.preventDefault() 
    $('#promptModal').modal('show')
  })
}

function addInput(divName){
  counter++
  let newdiv = document.createElement('div')
  newdiv.setAttribute('id', 'div_' + counter)
  newdiv.innerHTML = "<div class='form-row my-3'><div class='col-lg-4'><input class='form-control' id='addedkey"+counter+"' placeholder='Enter key field'> </div><div class='col-lg-8'><input class='form-control' id='addedval"+counter+"' placeholder='Value of key'></div></div>"           
  document.getElementById(divName).appendChild(newdiv)     
}


function deleteInput(divName){
  if(0 < counter) {
    document.getElementById(divName).removeChild(document.getElementById('div_' + counter))
    counter--
  } else {
    alert("Nothing to remove")
  }
}

function additem(){
  let i = temp = 1
  inventoryRef.once("value").then(function(snapshot){ 
    snapshot.forEach(function(childSnapshot) {
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
      }).then((snap) => {
        const key = snap.key
        while (i<=counter) {
          inventoryRef.child(key).update({
            [$("#addedkey"+i).val()]: $("#addedval"+i).val(),
          })
          i++
        }
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

// location history page functions
function spsnapshotToArray() {
  let spArr = []
  usersRef.once("value").then(function(snapshot){
  // <!-- snapshot of childs of root of database-->
    snapshot.forEach(function(childSnapshot) {
      if(childSnapshot.val().type == 'salesperson'){
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
  autocomplete(document.getElementById("spLocations"), spArr)
}

let history_map

function loadLocations(){
  let search = document.getElementById("spLocations").value
  document.getElementById("locations").innerHTML = ''
  if(!search){
    gpsRef.child("locations").once("value").then(function(snaphot){
      snaphot.forEach(function(childSnapshot){
        document.getElementById("locations").insertAdjacentHTML(
          'beforeend',
          "<div class='row'>"+
            "<div class='location-item col-xl-6 col-lg-7'>"+
              "<b>Location ID: </b>"+
              "<span class='location-item-title'>"+childSnapshot.key+"</span><br/><br/>"+
              "<b class='col-lg-3'>Salesperson ID: </b>"+childSnapshot.val().salesperson+"<br/>"+
              "<div style='display: none' class='location-lat'>"+childSnapshot.val().lat+"</div>"+
              "<div style='display: none' class='location-lng'>"+childSnapshot.val().lng+"</div>"+
              "<b class='col-lg-3'>Time Stamp: </b>"+childSnapshot.val().timestamp+"<br/>"+
              "<b class='col-lg-3'>Customer Name: </b>"+childSnapshot.val().customer+"<br/>"+
              "<b class='col-lg-3'>Shop: </b>"+childSnapshot.val().shopname+"<br/>"+
              "<b class='col-lg-3'>Address : </b>"+childSnapshot.val().address+"<br/>"+
            "</div>"+
            "<div class='location-item-map col-xl-6 col-lg-7'>"+
              "<div class='h-100' id='map"+childSnapshot.key+"'></div>"+
            "</div>"+
          "</div>"+
          "<hr class='mt-3'/>"
        )
        history_map = new google.maps.Map(document.getElementById('map'+childSnapshot.key), {
          streetViewControl: false,
          mapTypeControl: false,
          center: {lat: childSnapshot.val().lat, lng: childSnapshot.val().lng},
          zoom: 9,
          fullscreenControl: false,
        })
        let position = {
          lat: childSnapshot.val().lat,
          lng: childSnapshot.val().lng
        }
        marker = new google.maps.Marker({
          icon: {
            url: './img/marker.png',
          },
          position: position,
          map: history_map
        })
      })
    })
  }
  else{
    let name = ''
    usersRef.once("value").then(function(snapshot){
      snapshot.forEach(function(childSnapshot){
        if(childSnapshot.val().firstName+" "+childSnapshot.val().lastName == search){
          name = childSnapshot.key
        }
      })
    })
    gpsRef.child("locations").once("value").then(function(snaphot){
      snaphot.forEach(function(childSnapshot){
        if(childSnapshot.val().salesperson == name){
          document.getElementById("locations").insertAdjacentHTML(
            'beforeend',
            "<div class='row'>"+
              "<div class='location-item col-xl-6 col-lg-7'>"+
                "<b>Location ID: </b>"+
                "<span class='location-item-title'>"+childSnapshot.key+"</span><br/><br/>"+
                "<b class='col-lg-3'>Salesperson ID: </b>"+childSnapshot.val().salesperson+"<br/>"+
                "<div style='display: none' class='location-lat'>"+childSnapshot.val().lat+"</div>"+
                "<div style='display: none' class='location-lng'>"+childSnapshot.val().lng+"</div>"+
                "<b class='col-lg-3'>Time Stamp: </b>"+childSnapshot.val().timestamp+"<br/>"+
                "<b class='col-lg-3'>Customer Name: </b>"+childSnapshot.val().customer+"<br/>"+
                "<b class='col-lg-3'>Shop: </b>"+childSnapshot.val().shopname+"<br/>"+
                "<b class='col-lg-3'>Address : </b>"+childSnapshot.val().address+"<br/>"+
              "</div>"+
              "<div class='location-item-map col-xl-6 col-lg-7'>"+
                "<div class='h-100' id='map"+childSnapshot.key+"'></div>"+
              "</div>"+
            "</div>"+
            "<hr class='mt-3'/>"
          )
          history_map = new google.maps.Map(document.getElementById('map'+childSnapshot.key), {
            streetViewControl: false,
            mapTypeControl: false,
            center: {lat: childSnapshot.val().lat, lng: childSnapshot.val().lng},
            zoom: 9,
            fullscreenControl: false,
          })
          let position = {
            lat: childSnapshot.val().lat,
            lng: childSnapshot.val().lng
          }
          marker = new google.maps.Marker({
            icon: {
              url: './img/marker.png',
            },
            position: position,
            map: history_map
          })
        }
      })
    }) 
  }
}

let pastMarkers = []

function viewAllLocations(){
  map = new google.maps.Map(document.getElementById('map'), {
    streetViewControl: false,
    mapTypeControl: false,
    center: {lat: -34.397, lng: 150.644},
    zoom: 15
  })

  if (navigator.geolocation){
    navigator.geolocation.getCurrentPosition(function(position) {
      let pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      }
      lat = position.coords.latitude
      lng = position.coords.longitude
      map.setCenter(pos)
    })
  } 
  else{
    Swal.fire(
      'Something went wrong with location Access',
      '',
      'error'
    )
  }
  locationButton(map)

  gpsRef.child('locations').on('child_added', function (snapshot) {
    addPastLocationMarker(snapshot)
  })
  $('#locationModal').modal({backdrop: 'static', keyboard: false})
  $('#locationModal').modal('show')
}

function addPastLocationMarker(snapshot){
  usersRef.child(snapshot.val().salesperson).once("value").then(function(snap){
    let uluru = { lat: snapshot.val().lat, lng: snapshot.val().lng }
    let marker = new google.maps.Marker({
      position: uluru,
      icon: {
        url: './img/marker.png',
      },
      map: map,
      title: snapshot.key,
    })
    var contentString = '<div id="content">'+
                          '<div id="siteNotice">'+
                          '</div>'+
                          '<p id="name" class="h4">'+snap.val().firstName+" "+snap.val().lastName+"</p>"+
                          '<div id="bodyContent"><b>'+snapshot.val().shopname+'</b><br/>'+snapshot.val().customer+"<br/>"+snapshot.val().address+
                          '</div>'+
                        '</div>'
    var infowindow = new google.maps.InfoWindow({
      content: contentString
    })
    google.maps.event.addListener(marker, 'click', function() {
      infowindow.open(map, marker)
    })
    pastMarkers[snapshot.key] = marker
  })
}

function refresh(){
  loadLocations()
  $('#locations').fadeOut('slow').load('locations').fadeIn('slow')
}

// salesperson page functions
function spkeysnapshotToArray() {
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
}

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

// customer profiles page functions
function customerkeysnapshotToArray() {
  let customerArr = []
  usersRef.once("value").then(function(snapshot){
  // <!-- snapshot of childs of root of database-->
    snapshot.forEach(function(childSnapshot) {
      if(childSnapshot.val().type == 'customer' && childSnapshot.val().status == 'active'){
        let item = childSnapshot.val().name
        customerArr.push(item) 
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
  autocomplete(document.getElementById("customer-search"), customerArr)
}

function customerDetails(){
  let userName = document.getElementById("customer-search").value
  usersRef.once("value").then(function(snapshot){
    snapshot.forEach(function(childSnapshot){
      if(childSnapshot.val().name == userName){
        document.getElementById("name").value = childSnapshot.val().name
        document.getElementById("company").value = childSnapshot.val().company
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

function deleteCustomer(){
  let sp = document.getElementById("customer-search").value
  if(sp == ''){
    Swal.fire(
      'No customer selected',
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
                  title: 'Customer successfully deleted',
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
  document.getElementById("order-title").innerHTML = uid
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
          if(childSnapshot.key==document.getElementById("key"+x).innerHTML){
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

// signup page functions
let map, marker, lat, lng

function togglePassword() {
  var x = document.getElementById("password")
  if (x.type === "password") {
    x.type = "text"
  } else {
    x.type = "password"
  }
} 

function addYourLocationButton(map){
  let controlDiv = document.createElement('div')

  let firstChild = document.createElement('button')
  firstChild.style.backgroundColor = '#fff'
  firstChild.style.border = 'none'
  firstChild.style.outline = 'none'
  firstChild.style.width = '28px'
  firstChild.style.height = '28px'
  firstChild.style.borderRadius = '2px'
  firstChild.style.boxShadow = '0 1px 4px rgba(0,0,0,0.3)'
  firstChild.style.cursor = 'pointer'
  firstChild.style.marginRight = '10px'
  firstChild.style.padding = '0px'
  firstChild.title = 'Your Location'
  controlDiv.appendChild(firstChild)

  let secondChild = document.createElement('div')
  secondChild.style.margin = '5px'
  secondChild.style.width = '18px'
  secondChild.style.height = '18px'
  secondChild.style.backgroundImage = 'url(https://maps.gstatic.com/tactile/mylocation/mylocation-sprite-1x.png)'
  secondChild.style.backgroundSize = '180px 18px'
  secondChild.style.backgroundPosition = '0px 0px'
  secondChild.style.backgroundRepeat = 'no-repeat'
  secondChild.id = 'you_location_img'
  firstChild.appendChild(secondChild)

  google.maps.event.addListener(map, 'dragend', function() {
      $('#you_location_img').css('background-position', '0px 0px')
  })

  firstChild.addEventListener('click', function() {
      let imgX = '0'
      let animationInterval = setInterval(function(){
          if(imgX == '-18') imgX = '0'
          else imgX = '-18'
          $('#you_location_img').css('background-position', imgX+'px 0px')
      }, 500)
      if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
          let pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          }
          placeMarker(pos, map)  
          map.setCenter(pos)
          clearInterval(animationInterval)
          $('#you_location_img').css('background-position', '0px 0px')
        })
      }
      else{
        clearInterval(animationInterval)
        $('#you_location_img').css('background-position', '0px 0px')
      }
  })

  controlDiv.index = 1
  map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(controlDiv)
}

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    streetViewControl: false,
    mapTypeControl: false,
    center: {lat: -34.397, lng: 150.644},
    zoom: 11
  })
  map.addListener('click', function(e) {
    lat = e.latLng.lat()
    lng = e.latLng.lng()
    placeMarker(e.latLng, map)
  })

  if (navigator.geolocation){
    navigator.geolocation.getCurrentPosition(function(position) {
      let pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      }
      lat = position.coords.latitude
      lng = position.coords.longitude
      placeMarker(pos, map)
      map.setCenter(pos)
    })
  } 
  else{
    Swal.fire(
      'Something went wrong with location Access',
      '',
      'error'
    )
  }
  addYourLocationButton(map)
}

function placeMarker(position, map) {
  if (marker == null){
    marker = new google.maps.Marker({
      icon: {
        url: './img/marker.png',
      },
      position: position,
      map: map
    })
  }
  else{   
    marker.setPosition(position) 
  }
  map.panTo(position)
}

function signup(){
  $('#signupForm').submit(function(e){     
    e.preventDefault() 
    modalLoading.init(true)    
    // Get input values from each of the form elements
    let company = $("#company").val()
    let telephone = $("#tel").val()
    let email = $("#email").val()
    let name = $("#name").val()
    let pwd = $("#password").val()
    let address = $("#address").val()

    if(pwd == $("#cpassword").val()){
      firebase.auth().createUserWithEmailAndPassword(email, pwd).then(()=>{
        let user = firebase.auth().currentUser
        user.sendEmailVerification().then(function() {
          // Email sent.
          // Push the new customer to the database using those values
          usersRef.child(firebase.auth().currentUser.uid).set({
            company: company,
            telephone: telephone,
            email: email,
            name: name,
            address: address,
            type: 'customer',
            longitude: lng,
            latitude: lat,
            status: 'active'
          }).then(()=>{
            let element = document.getElementById("openModalLoading")
            element.parentNode.removeChild(element)
            Swal.fire({
              position: 'top',
              icon: 'success',
              title: 'You have successfully signed into Altum. Check e-mail for verfication',
              showConfirmButton: false,
              timer: 3000
            }).then(()=>{
              location.href='index.html'
            })    
          })
        }).catch(function(error) {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: error.message,
          })
        })
      }).catch(function(error){
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: error.message,
        })
        let element = document.getElementById("openModalLoading")
        element.parentNode.removeChild(element)
      })
    }
    else{
      Swal.fire(
        'Password Mismatch',
        '',
        'error'
      )
      let element = document.getElementById("openModalLoading")
      element.parentNode.removeChild(element)
    }
  })
}

// track now page functions
function spkeysToArray() {
  let spKeyArr = []
  gpsRef.child("live").once("value").then(function(snapshot){
  // <!-- snapshot of childs of root of database-->
    snapshot.forEach(function(childSnapshot) {
      let item = childSnapshot.key
      spKeyArr.push(item) 
    })
  }).catch(function(error){
    // Handle Errors here.
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: error.message,
    })
  })
  autocomplete(document.getElementById("track_id"), spKeyArr)
}

let markers = []

function locationButton(map){
  let controlDiv = document.createElement('div')

  let firstChild = document.createElement('button')
  firstChild.style.backgroundColor = '#fff'
  firstChild.style.border = 'none'
  firstChild.style.outline = 'none'
  firstChild.style.width = '28px'
  firstChild.style.height = '28px'
  firstChild.style.borderRadius = '2px'
  firstChild.style.boxShadow = '0 1px 4px rgba(0,0,0,0.3)'
  firstChild.style.cursor = 'pointer'
  firstChild.style.marginRight = '10px'
  firstChild.style.padding = '0px'
  firstChild.title = 'Your Location'
  controlDiv.appendChild(firstChild)

  let secondChild = document.createElement('div')
  secondChild.style.margin = '5px'
  secondChild.style.width = '18px'
  secondChild.style.height = '18px'
  secondChild.style.backgroundImage = 'url(https://maps.gstatic.com/tactile/mylocation/mylocation-sprite-1x.png)'
  secondChild.style.backgroundSize = '180px 18px'
  secondChild.style.backgroundPosition = '0px 0px'
  secondChild.style.backgroundRepeat = 'no-repeat'
  secondChild.id = 'you_location_img'
  firstChild.appendChild(secondChild)

  google.maps.event.addListener(map, 'dragend', function() {
      $('#you_location_img').css('background-position', '0px 0px')
  })

  firstChild.addEventListener('click', function() {
      let imgX = '0'
      let animationInterval = setInterval(function(){
          if(imgX == '-18') imgX = '0'
          else imgX = '-18'
          $('#you_location_img').css('background-position', imgX+'px 0px')
      }, 500)
      if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
          let pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          }  
          map.setCenter(pos)
          clearInterval(animationInterval)
          $('#you_location_img').css('background-position', '0px 0px')
        })
      }
      else{
        clearInterval(animationInterval)
        $('#you_location_img').css('background-position', '0px 0px')
      }
  })

  controlDiv.index = 1
  map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(controlDiv)
}

function initTrackMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    streetViewControl: false,
    mapTypeControl: false,
    center: {lat: -34.397, lng: 150.644},
    zoom: 15
  })

  if (navigator.geolocation){
    navigator.geolocation.getCurrentPosition(function(position) {
      let pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      }
      lat = position.coords.latitude
      lng = position.coords.longitude
      map.setCenter(pos)
    })
  } 
  else{
    Swal.fire(
      'Something went wrong with location Access',
      '',
      'error'
    )
  }
  locationButton(map)

  gpsRef.child('live').on('child_added', function (snapshot) {
    AddMarker(snapshot)
    if(snapshot.val().status == 'inactive'){
      markers[snapshot.key].setMap(null)
    }
  })
  
  gpsRef.child('live').on('child_changed', function (snapshot) {
      markers[snapshot.key].setMap(null)
      AddMarker(snapshot)
      if(snapshot.val().status == 'inactive'){
        markers[snapshot.key].setMap(null)
      }
  })
}

function AddMarker(snapshot) {
  usersRef.child(snapshot.key).once("value").then(function(snap){
    let uluru = { lat: snapshot.val().lat, lng: snapshot.val().lng }
    let marker = new google.maps.Marker({
      position: uluru,
      icon: {
        url: '../marker.svg',
      },
      map: map,
      title: snapshot.key,
    })
    var contentString = '<div id="content">'+
                          '<div id="siteNotice">'+
                          '</div>'+
                          '<h1 id="name" class="h6">'+snap.val().firstName+" "+snap.val().lastName+'</h1>'+
                          '<div id="bodyContent"><b>'+snap.val().telephone+'</b><br/>'+snap.val().address+
                          '</div>'+
                        '</div>'
    var infowindow = new google.maps.InfoWindow({
      content: contentString
    })
    infowindow.open(map, marker)
    markers[snapshot.key] = marker
  })
}

function searchClicked(){
  child = document.getElementById("track_id").value
  gpsRef.child('live/'+child).once('value').then(function(snapshot){
    if(snapshot.val().status == 'inactive'){
      Swal.fire(
        'Sales person location is inactive',
        '',
        'info'
      )
    }
    else if(snapshot.val().status == 'active'){
      let pos = {
        lat: snapshot.val().lat,
        lng: snapshot.val().lng
      } 
      map.panTo(pos)
    }
  })
}

