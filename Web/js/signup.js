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

function addYourLocationButton(map) {
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
        placeMarker(pos, map)
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

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    streetViewControl: false,
    mapTypeControl: false,
    center: { lat: -34.397, lng: 150.644 },
    zoom: 11
  })
  map.addListener('click', function (e) {
    lat = e.latLng.lat()
    lng = e.latLng.lng()
    placeMarker(e.latLng, map)
  })

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (position) {
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
  else {
    Swal.fire(
      'Something went wrong with location Access',
      '',
      'error'
    )
  }
  addYourLocationButton(map)
}

function placeMarker(position, map) {
  if (marker == null) {
    marker = new google.maps.Marker({
      icon: {
        url: './img/marker.png',
      },
      position: position,
      map: map
    })
  }
  else {
    marker.setPosition(position)
  }
  map.panTo(position)
}

function signup() {
  $('#signupForm').submit(function (e) {
    e.preventDefault()
    modalLoading.init(true)
    // Get input values from each of the form elements
    let company = $("#company").val()
    let telephone = $("#tel").val()
    let email = $("#email").val()
    let name = $("#name").val()
    let pwd = $("#password").val()
    let address = $("#address").val()

    if (pwd == $("#cpassword").val()) {
      firebase.auth().createUserWithEmailAndPassword(email, pwd).then(() => {
        let user = firebase.auth().currentUser
        user.sendEmailVerification().then(function () {
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
          }).then(() => {
            let element = document.getElementById("openModalLoading")
            element.parentNode.removeChild(element)
            Swal.fire({
              position: 'top',
              icon: 'success',
              title: 'You have successfully signed into Altum. Check e-mail for verfication',
              showConfirmButton: false,
              timer: 3000
            }).then(() => {
              location.href = 'index.html'
            })
          })
        }).catch(function (error) {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: error.message,
          })
        })
      }).catch(function (error) {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: error.message,
        })
        let element = document.getElementById("openModalLoading")
        element.parentNode.removeChild(element)
      })
    }
    else {
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
