// Search box functions

var empArr = [];
//employee table snapshot
function empsnapshotToArray() {

  employeeRef.once("value").then(function(snapshot){
  // <!-- snapshot of childs of root of database-->
      snapshot.forEach(function(childSnapshot) {
          var item = childSnapshot.key;
          empArr.push(item);
      });
  });
  return empArr;
};
//end of snapshot
empsnapshotToArray();
//   initiate the auto complete function on the inpt field
autocomplete(document.getElementById("empSearch"), empArr);
// end of Search box functions

// <!-- function to delete the employee details of the chosen employee-->
function remEmployee(){
  var inputvalue = document.getElementById("empSearch").value;
  var empRef = firebase.database().ref("employees/"+inputvalue);
  empRef.remove().then(function(){
    location.href = "employees.html"; 
  });
}
// <!-- end of delete function-->


// <!-- function to retrieve the employee data in database according to the selection in the search box-->
function retrieveEmployee(){
  var iteration = 0;
  var inputvalue = document.getElementById("empSearch").value;
  employeeRef.once("value").then(function(snapshot){
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
              "<button type='button' class='btn btn-danger col-lg-3 ml-3' data-toggle='modal' data-target='#delCon'>Delete Employee <i class='far fa-trash-alt'></i></button>"+
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
                  "<button type='button' id='update' class='btn btn-primary btn-ok' onclick='updateEmployee()'>Yes</button>"+
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
                    "<button type='button' id='remove' class='btn btn-primary btn-ok' onclick='remEmployee()'>Yes</button>"+
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


// <!-- function to update the data in database of the chosen employee-->
function updateEmployee(){
  var inputvalue = document.getElementById("empSearch").value;
  var empRef = firebase.database().ref("employees/"+inputvalue);
  var key1 = $("#key1").val();
  var value1 = $("#value1").val();
  var key2 = $("#key2").val();
  var value2 = $("#value2").val();
  var key3 = $("#key3").val();
  var value3 = $("#value3").val();
  var key4 = $("#key4").val();
  var value4 = $("#value4").val();

  // Update employee to the database using above values
  empRef.update({
    [key1]: value1,
    [key2]: value2,
    [key3]: value3,
    [key4]: value4,
  });
  location.href = "employees.html";
  
}
// <!-- end of the update function-->

// Save a new Employee to the database, using the input in the form
var addEmployee = function () {

  // Get input values from each of the form elements
  var parentkey = $("#parentkey").val();
  var value1 = $("#value1").val();
  var value2 = $("#value2").val();
  var value3 = $("#value3").val();
  var value4 = $("#value4").val();

  // Push the new employee to the database using those values
  employeeRef.child(parentkey).set({
      "First Name": value1,
      "Last Name": value2,
      "Employee ID": value3,
      "Telephone": value4 
  });
};
// Find the HTML element with the id addnew, and when the submit
// event is triggered on that element, call addProduct.
$("#addnew").click(addEmployee);
// End of saving new Employee

// Load the Profile of tracking customer when clicked on view profile
function loadFromTracking(){
  if(localStorage.getItem("clickflag")){
    document.getElementById("empSearch").value = localStorage.getItem("employeename");
    retrieveEmployee();
    var clickFlag = false;
    localStorage.setItem("clickflag", clickFlag);
  } 
}

