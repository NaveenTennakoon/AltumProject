let i = 0;

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
                  "<input class='form-control' id='key"+i+"' value='"+childSnapshot.key+"' readonly>"+
                "</div>"+
                "<div class='col-lg-8'>"+
                  "<input class='form-control' id='value"+i+"' value='"+childSnapshot.val()+"'>"+
                "</div>"+
              "</div>"
          );
          i++;
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
  while(i>0){
    i--;
    inventoryRef.child(title).update({
      [$("#key"+i).val()]: $("#value"+i).val(),
    }).then(()=>{
      clearViewModal();
      window.alert("Product updated successfully");
    }).catch(function(error){
        // Handle Errors here.
        let errorMessage = error.message;
        window.alert(errorMessage);
    });
  }
}

// <!-- function to retrieve the product data in database according to the selection in the search box-->
function retrieveProduct(){
    var iteration = 0;
    var inputvalue = document.getElementById("invSearch").value;
    inventoryRef.once("value").then(function(snapshot){
      // <!-- snapshot of childs of root of database-->
      snapshot.forEach(function(childSnapshot) {
  
        if(childSnapshot.key===inputvalue){
          childSnapshot.forEach(function(ccSnapshot){
            iteration++;
            var key = ccSnapshot.key;
            var value = ccSnapshot.val();
            document.getElementById("maincon").insertAdjacentHTML(
              'beforeend',
              "<div class='form-row'>"+ 
                "<div class='col-lg-3'>"+
                  "<input type='text' id='key" + iteration + "' class='form-control' value='" + key + "'>"+
                "</div>"+
                "<div class='col-lg-7'>"+
                  "<input type='text' id='value" + iteration + "' class='form-control' value='" + value + "'>"+
                "</div>"+
              "</div><br/>");
          });
          document.getElementById("maincon").insertAdjacentHTML(
            'beforeend', 
                "<br/><button type='button' class='btn btn-primary col-lg-3' data-toggle='modal' data-target='#upCon'>Update Details <i class='fa fa-edit' aria-hidden='true'></i></button><tabspace>"+
                "<button type='button' class='btn btn-danger col-lg-3 ml-3' data-toggle='modal' data-target='#delCon'>Delete Product <i class='far fa-trash-alt'></i></button>"+
                //<!-- Update Modal -->
              "<div class='modal fade' id='upCon' role='dialog'>"+
              "<div class='modal-dialog'>"+
                //<!-- Update Modal content-->
                "<div class='modal-content'>"+
                  "<div class='modal-header'>"+
                    "<h4 class='modal-title'>Confirmation</h4>"+
                    "<button type='button' class='close' data-dismiss='modal'>&times;</button>"+   
                  "</div>"+
                  "<div class='modal-body'>"+
                    "<p>Do you want to update the set changes to the database?</p>"+
                  "</div>"+
                  "<div class='modal-footer'>"+
                    "<button type='button' id='update' class='btn btn-primary btn-ok' onclick='updateInventory()'>Yes</button>"+
                    "<button type='button' class='btn btn-default' data-dismiss='modal'>Cancel</button>"+
                  "</div>"+
                "</div>"+
                // <!-- End Update Modal Content-->
              "</div>"+
            "</div>"+
            // <!-- End Update Modal-->
  
                //<!-- Delete Modal -->
              "<div class='modal fade' id='delCon' role='dialog'>"+
                "<div class='modal-dialog'>"+
                  //<!-- Delete Modal content-->
                  "<div class='modal-content'>"+
                    "<div class='modal-header'>"+
                      "<h4 class='modal-title'>Confirmation</h4>"+
                      "<button type='button' class='close' data-dismiss='modal'>&times;</button>"+   
                    "</div>"+
                    "<div class='modal-body'>"+
                      "<p>Do you want to remove this product from the database?</p>"+
                    "</div>"+
                    "<div class='modal-footer'>"+
                      "<button type='button' id='remove' class='btn btn-primary btn-ok' onclick='remInventory()'>Yes</button>"+
                      "<button type='button' class='btn btn-default' data-dismiss='modal'>Cancel</button>"+
                    "</div>"+
                  "</div>"+
                  // <!-- End Delete Modal Content-->
                "</div>"+
              "</div>");
              // <!-- End Delete Modal-->
        }

      });
    });
  }
  // <!-- end of the retrieve function-->

  // <!-- function to update the data in database of the chosen product-->
function updateEmployee(){
    var inputvalue = document.getElementById("invSearch").value;
    var invRef = firebase.database().ref("inventory/"+inputvalue);
    var key1 = $("#key1").val();
    var value1 = $("#value1").val();
    var key2 = $("#key2").val();
    var value2 = $("#value2").val();
    var key3 = $("#key3").val();
    var value3 = $("#value3").val();
    var key4 = $("#key4").val();
    var value4 = $("#value4").val();
  
    // Update employee to the database using above values
    invRef.update({
      [key1]: value1,
      [key2]: value2,
      [key3]: value3,
      [key4]: value4,
    });
    location.href = "stock.html";
    
  }
  // <!-- end of the update function-->
  
  // Save a new Employee to the database, using the input in the form
  var addProduct = function () {
  
    // Get input values from each of the form elements
    var parentkey = $("#parentkey").val();
    var value1 = $("#value1").val();
    var value2 = $("#value2").val();
    var value3 = $("#value3").val();
    var value4 = $("#value4").val();
  
    // Push the new employee to the database using those values
    inventoryRef.child(parentkey).set({
        "First Name": value1,
        "Last Name": value2,
        "Employee ID": value3,
        "Telephone": value4 
    });
  };
  // Find the HTML element with the id addnew, and when the submit
  // event is triggered on that element, call addProduct.
  $("#addnew").click(addProduct);
  // End of saving new Employee

  // <!-- function to delete the employee details of the chosen employee-->
function remProduct(){
    var inputvalue = document.getElementById("invSearch").value;
    var invRef = firebase.database().ref("inventory/"+inputvalue);
    invRef.remove().then(function(){
      location.href = "stock.html"; 
    });
  }
  // <!-- end of delete function-->