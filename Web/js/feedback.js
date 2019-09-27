let orderArr = [];

function ordersnapshotToArray() {
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
ordersnapshotToArray();

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
            inventoryRef.child(productArr[i]).once("value").then(function(snapshot){
                document.getElementById("order_content").insertAdjacentHTML(
                    'beforeend',
                    "<p>Name : "+snapshot.val().Name+"</p>"+
                    "<p>Product ID : "+snapshot.val().ID+"</p>"+
                    "<b>Quantity : "+quantityArr[i]+"</b><hr/>"
                );
            });
        }
        $('#viewModal').modal('show')
    })
}

// Save a feedback to the database, using the input in the form
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
  

  