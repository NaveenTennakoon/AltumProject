// Payment page functions 
ordersRef.once("value").then(function(snapshot){
    snapshot.forEach(function(childSnapshot){
    let paymentDate;
    if(childSnapshot.val().paymentDate == null){
        paymentDate = "Not paid";
    }
    else{
        paymentDate = childSnapshot.val().paymentDate;
    }
    if(childSnapshot.val().Status == 'Completed'){     
    document.getElementById("payment-details").insertAdjacentHTML(
        'beforeend',
        "<div class='row'>"+
        "<div class='col-lg-3  ml-2'><b>Order ID: </b>"+childSnapshot.val().orderId+"</div>"+
        "<div class='col-lg-2  ml-2'><b>Payment: </b>"+childSnapshot.val().payment+"</div>"+
        "<div class='col-lg-3  ml-2'><b>Total Price: </b>"+childSnapshot.val().Total+"</div>"+
        "<div class='col-lg-3  ml-2'><b>Payment Date: </b>"+paymentDate+"</div>"+         
        "</div>" +
        "<hr class='mt-5'/>"
    );
    }
    });    
});
  