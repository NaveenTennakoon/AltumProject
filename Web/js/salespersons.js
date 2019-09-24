// Search box functions 
var spArr = [];
//salesperson table snapshot
function spsnapshotToArray() {

  salespersonRef.once("value").then(function(snapshot){
  // <!-- snapshot of childs of root of database-->
      snapshot.forEach(function(childSnapshot) {
          var item = childSnapshot.key;
          spArr.push(item);
      });
  });
  return spArr;
};
//end of snapshot
spsnapshotToArray();
//   initiate the auto complete function on the inpt field
autocomplete(document.getElementById("spSearch"), spArr);
// end of Search box functions

// <!-- function to delete the salesperson details of the chosen salesperson-->
function remSalesperson(){
  var inputvalue = document.getElementById("spSearch").value;
  var spRef = firebase.database().ref("salespersons/"+inputvalue);
  spRef.remove().then(function(){
    location.href = "salespersons.html"; 
  });
}
// <!-- end of delete function-->


// <!-- function to retrieve the salesperson data in database according to the selection in the search box-->
function retrieveSalesperson(){
  var iteration = 0;
  var inputvalue = document.getElementById("spSearch").value;
  salespersonRef.once("value").then(function(snapshot){
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
                "<input type='text' id='key" + iteration + "' class='form-control' value='" + key + "' readonly>"+
              "</div>"+
              "<div class='col-lg-7'>"+
                "<input type='text' id='value" + iteration + "' class='form-control' value='" + value + "'>"+
              "</div>"+
            "</div><br/>");
        });
        document.getElementById("maincon").insertAdjacentHTML(
          'beforeend', 
              "<br/><button type='button' class='btn btn-primary col-lg-3' data-toggle='modal' data-target='#upCon'>Update Details <i class='fa fa-edit' aria-hidden='true'></i></button><tabspace>"+
              "<button type='button' class='btn btn-danger col-lg-3 ml-3' data-toggle='modal' data-target='#delCon'>Delete Salesperson <i class='far fa-trash-alt'></i></button>"+
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
                  "<button type='button' id='update' class='btn btn-primary btn-ok' onclick='updateSalesperson()'>Yes</button>"+
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
                    "<button type='button' id='remove' class='btn btn-primary btn-ok' onclick='remSalesperson()'>Yes</button>"+
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


// <!-- function to update the data in database of the chosen salesperson-->
function updateSalesperson(){
  var inputvalue = document.getElementById("spSearch").value;
  var spRef = firebase.database().ref("salespersons/"+inputvalue);
  var key1 = $("#key1").val();
  var value1 = $("#value1").val();
  var key2 = $("#key2").val();
  var value2 = $("#value2").val();
  var key3 = $("#key3").val();
  var value3 = $("#value3").val();
  var key4 = $("#key4").val();
  var value4 = $("#value4").val();

  // Update salesperson to the database using above values
  spRef.update({
    [key1]: value1,
    [key2]: value2,
    [key3]: value3,
    [key4]: value4,
  });
  location.href = "salespersons.html";
  
}
// <!-- end of the update function-->


// Save a new Salesperson to the database, using the input in the form
var addSalesperson = function () {

  // Get input values from each of the form elements
  var value1 = $("#value1").val();
  var value2 = $("#value2").val();
  var value3 = $("#value3").val();
  var value4 = $("#value4").val();

  // Push the new salesperson to the database using those values
  salespersonRef.push({
      "Name": value1,
      "Email": value2,
      "Phone Number": value3,
      "Address": value4 
  });
};
// Find the HTML element with the id addnew, and when the submit
// event is triggered on that element, call addProduct.
$("#new_salesperson").click(addSalesperson);
// End of saving new Salesperson


// Load the Profile of tracking customer when clicked on view profile
function loadFromTracking(){
  if(localStorage.getItem("clickflag")){
    document.getElementById("spSearch").value = localStorage.getItem("salesperson_name");
    retrieveSalesperson();
    var clickFlag = false;
    localStorage.setItem("clickflag", clickFlag);
  } 
}



