let spArr = []
let history_map

// populate salesperson array
usersRef.once("value").then(function(snapshot){
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
                zoom: 16,
                gestureHandling: 'none',
                zoomControl: false,
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
                    zoom: 16,
                    gestureHandling: 'none',
                    zoomControl: false,
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
  