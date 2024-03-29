// track now page functions
let spKeyArr = []
gpsRef.child("live").once("value").then(function (snapshot) {
  // <!-- snapshot of childs of root of database-->
  snapshot.forEach(function (childSnapshot) {
    let item = {
      key: childSnapshot.key,
      name: childSnapshot.val().name
    }
    spKeyArr.push(item)
  })
}).then(() => {
  autocomplete(document.getElementById("track_id"), spKeyArr.map(sp => sp.name))
}).catch(function (error) {
  // Handle Errors here.
  Swal.fire({
    icon: 'error',
    title: 'Oops...',
    text: error.message,
  })
})

let markers = []

function locationButton(map) {
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

  google.maps.event.addListener(map, 'dragend', function () {
    $('#you_location_img').css('background-position', '0px 0px')
  })

  firstChild.addEventListener('click', function () {
    let imgX = '0'
    let animationInterval = setInterval(function () {
      if (imgX == '-18') imgX = '0'
      else imgX = '-18'
      $('#you_location_img').css('background-position', imgX + 'px 0px')
    }, 500)
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function (position) {
        let pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        }
        map.setCenter(pos)
        clearInterval(animationInterval)
        $('#you_location_img').css('background-position', '0px 0px')
      })
    }
    else {
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
    center: { lat: 6.883239, lng: 79.8984583 },
    zoom: 14
  })
  locationButton(map)

  gpsRef.child('live').on('child_added', function (snapshot) {
    AddMarker(snapshot)
  })

  gpsRef.child('live').on('child_changed', function (snapshot) {
    markers[snapshot.key].setMap(null)
    AddMarker(snapshot)
  })
}

function AddMarker(snapshot) {
  usersRef.child(snapshot.key).once("value").then(function (snap) {
    let pos = { lat: snapshot.val().lat, lng: snapshot.val().lng }
    let marker
    if (snapshot.val().status == 'active') {
      console.log("active")
      marker = new google.maps.Marker({
        position: pos,
        icon: {
          url: '../marker.svg',
        },
        map: map,
        title: snapshot.key,
      })
    }
    else if (snapshot.val().status == 'inactive') {
      console.log("inactive")
      marker = new google.maps.Marker({
        position: pos,
        icon: {
          url: '../inactive_marker.svg',
        },
        map: map,
        title: snapshot.key,
      })
    }
    var contentString = '<div id="content">' +
      '<div id="siteNotice">' +
      '</div>' +
      '<h1 id="name" class="h6">' + snap.val().firstName + " " + snap.val().lastName + '</h1>' +
      '<div id="bodyContent"><b>' + snap.val().telephone + '</b><br/>' + snap.val().address +
      '</div>' +
      '</div>'
    var infowindow = new google.maps.InfoWindow({
      content: contentString
    })
    infowindow.open(map, marker)
    markers[snapshot.key] = marker
  })
}

function searchClicked() {
  let name = document.getElementById("track_id").value
  child = spKeyArr.filter(obj => { return obj.name === name })
  gpsRef.child('live/' + child[0].key).once('value').then(function (snapshot) {
    if (snapshot.val().status == 'inactive') {
      Swal.fire(
        'Sales person location is inactive',
        '',
        'info'
      )
    }
    else if (snapshot.val().status == 'active') {
      let pos = {
        lat: snapshot.val().lat,
        lng: snapshot.val().lng
      }
      map.panTo(pos)
    }
  })
}
