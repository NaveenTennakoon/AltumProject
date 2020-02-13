let orderArr = []
let keyArr = []
// populate orders to the search box
document.getElementById("order_id").innerHTML = ''
ordersRef.once("value").then(function(snapshot){
    snapshot.forEach(function(childSnapshot){
        if(childSnapshot.val().Customer == firebase.auth().currentUser.uid){
            if(childSnapshot.val().Status == 'Completed' && !childSnapshot.val().Feedback){
                let item = childSnapshot.val().orderId
                let key = childSnapshot.key
                orderArr.push(item)
                keyArr.push(key)
            }
        }
    })
    for(let i = 0; i < orderArr.length; i++){
        document.getElementById("order_id").insertAdjacentHTML(
            'beforeend',
            "<option value="+keyArr[i]+">"+orderArr[i]+"</option>"
        )
    }
}).catch(function(error){
    // Handle Errors here.
    Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: error.message,
    })
})

  // viewing the selected order in modal
  function view(){
      let productArr = []
      let quantityArr = []
      let salesperson
      let dropdown = document.getElementById("order_id")
      let selected = dropdown.options[dropdown.selectedIndex].value
      ordersRef.child(selected).once("value").then(function(snapshot){
        salesperson = snapshot.val().salesperson
      })
      // products in order loading to the arrays
      ordersRef.child(selected+"/Products").once("value").then(function(snapshot){
          snapshot.forEach(function(childSnapshot){
              productArr.push(childSnapshot.key)
              quantityArr.push(childSnapshot.val())
          })
      }).then(() => {
          for(let i = 0; i < productArr.length; i++){
            inventoryRef.once("value").then(function(snapshot){
              snapshot.forEach(function(childSnapshot){
                // populating the modal
                if(childSnapshot.val().ID == productArr[i]){
                  document.getElementById("order_content").insertAdjacentHTML(
                    'beforeend',
                    "<p>Name : "+childSnapshot.val().Name+"</p>"+
                    "<p>Product ID : "+childSnapshot.val().ID+"</p>"+
                    "<b>Quantity : "+quantityArr[i]+"</b><hr/>"
                )
                }
              })
            })
          }
          // get delivery person's name
          usersRef.child(salesperson).once("value").then(function(snapshot){
            document.getElementById("order_content").insertAdjacentHTML(
              'beforeend',
              "<p><b>Delivery Person : </b>"+snapshot.val().firstName+" "+snapshot.val().lastName+"</p>"
            )
          })
          $('#viewfbModal').modal({backdrop: 'static', keyboard: false})
          $('#viewfbModal').modal('show')
      })
  }
  
  function clearViewOrderModal(){
    document.getElementById("order_content").innerHTML = ''
  }
  
  // function starRating() {
  // 	var starRating1 = raterJs( {
  // 		starSize:32, 
  // 		element:document.querySelector("#rater"), 
  // 		rateCallback:function rateCallback(rating, done) {
  // 			this.setRating(rating) 
  // 			done() 
  // 		}
  // 	}) 
  // } 
  
  // feedback submit
  function submitFeedback() {
      let dropdown = document.getElementById("order_id")
      let selected = dropdown.options[dropdown.selectedIndex].value
      let Feedback = document.getElementById("cus_feedback").value
      if(Feedback == ''){
        Swal.fire(
          'Feedback is empty',
          '',
          'warning'
          )
        return
      }
      ordersRef.child(selected).update({
          Feedback: Feedback
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
      }).catch(function(error){
          // Handle Errors here.
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: error.message,
          })
      })
  }
  
  
  
  
    
  
  
  
  
  
  
  
   