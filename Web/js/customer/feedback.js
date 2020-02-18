// populate orders to the search box
function ordersnapshotToArray() {
  let orderArr = []
  let keyArr = []
  document.getElementById("order_id").innerHTML = ''
  ordersRef.once("value").then(function (snapshot) {
    snapshot.forEach(function (childSnapshot) {
      if (childSnapshot.val().Customer == firebase.auth().currentUser.uid) {
        if (childSnapshot.val().Status == 'Completed' && !childSnapshot.val().Feedback) {
          let item = childSnapshot.val().orderId
          let key = childSnapshot.key
          orderArr.push(item)
          keyArr.push(key)
        }
      }
    })
    for (let i = 0; i < orderArr.length; i++) {
      document.getElementById("order_id").insertAdjacentHTML(
        'beforeend',
        "<option value=" + keyArr[i] + ">" + orderArr[i] + "</option>"
      )
    }
  }).catch(function (error) {
    // Handle Errors here.
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: error.message,
    })
  })
}

// listeners for the stars
document.addEventListener('DOMContentLoaded', function () {
  let d_rating = p_rating = 0
  let delivery_stars = document.querySelectorAll('.delivery-star')
  let product_stars = document.querySelectorAll('.product-star')
  delivery_stars.forEach(function (star) {
    star.addEventListener('click', setDeliveryRating)
  })
  product_stars.forEach(function (star) {
    star.addEventListener('click', setProductRating)
  })
})

// viewing the selected order in modal
function view() {
  let productArr = []
  let quantityArr = []
  let salesperson
  let dropdown = document.getElementById("order_id")
  let selected = dropdown.options[dropdown.selectedIndex].value
  ordersRef.child(selected).once("value").then(function (snapshot) {
    salesperson = snapshot.val().salesperson
  })
  // products in order loading to the arrays
  ordersRef.child(selected + "/Products").once("value").then(function (snapshot) {
    snapshot.forEach(function (childSnapshot) {
      productArr.push(childSnapshot.key)
      quantityArr.push(childSnapshot.val())
    })
  }).then(() => {
    for (let i = 0; i < productArr.length; i++) {
      inventoryRef.once("value").then(function (snapshot) {
        snapshot.forEach(function (childSnapshot) {
          // populating the modal
          if (childSnapshot.val().ID == productArr[i]) {
            document.getElementById("order_content").insertAdjacentHTML(
              'beforeend',
              "<p>Name : " + childSnapshot.val().Name + "</p>" +
              "<p>Product ID : " + childSnapshot.val().ID + "</p>" +
              "<b>Quantity : " + quantityArr[i] + "</b><hr/>"
            )
          }
        })
      })
    }
    // get delivery person's name
    usersRef.child(salesperson).once("value").then(function (snapshot) {
      document.getElementById("order_content").insertAdjacentHTML(
        'beforeend',
        "<p><b>Delivery Person : </b>" + snapshot.val().firstName + " " + snapshot.val().lastName + "</p>"
      )
    })
    $('#viewfbModal').modal({ backdrop: 'static', keyboard: false })
    $('#viewfbModal').modal('show')
  })
}

function clearViewOrderModal() {
  document.getElementById("order_content").innerHTML = ''
}

// feedback submit
function submitFeedback() {
  let dropdown = document.getElementById("order_id")
  let selected = dropdown.options[dropdown.selectedIndex].value
  let Feedback = document.getElementById("cus_feedback").value
  if (Feedback == '') {
    Swal.fire(
      'Feedback is empty',
      '',
      'warning'
    )
    return
  }
  ordersRef.child(selected).update({
    Feedback: Feedback,
    deliveryRating: d_rating,
    productRating: p_rating
  }).then(() => {
    Swal.fire({
      position: 'top',
      icon: 'success',
      title: 'Feedback has been successfully submitted',
      showConfirmButton: false,
      timer: 3000
    })
    document.getElementById("cus_feedback").value = ''
    ordersnapshotToArray()
  }).catch(function (error) {
    // Handle Errors here.
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: error.message,
    })
  })
}

// set rating
function setDeliveryRating(event) {
  let span = event.currentTarget
  let stars = document.querySelectorAll('.delivery-star')
  let match = false
  stars.forEach(function (star, index) {
    if (match)
      star.classList.remove('rated')
    else
      star.classList.add('rated')
    // are we currently looking at the span that was clicked
    if (star === span) {
      match = true
      d_rating = index + 1
    }
  })
}

function setProductRating(event) {
  let span = event.currentTarget
  let stars = document.querySelectorAll('.product-star')
  let match = false
  stars.forEach(function (star, index) {
    if (match)
      star.classList.remove('rated')
    else
      star.classList.add('rated')
    // are we currently looking at the span that was clicked
    if (star === span) {
      match = true
      p_rating = index + 1
    }
  })
}












