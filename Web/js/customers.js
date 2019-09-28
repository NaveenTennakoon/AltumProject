// customer table snapshot
function cussnapshotToArray() {
  var cusArr = [];
  customerRef.once("value").then(function(snapshot){
  // <!-- snapshot of childs of root of database-->
      snapshot.forEach(function(childSnapshot) {
          var item = childSnapshot.key;
          cusArr.push(item);
      });
  });
  return cusArr;
};
// end of snapshot

function loadCustomers(){
  cussnapshotToArray();
  autocomplete(document.getElementById("cusSearch"), cusArr);
}

// <!-- function to retrieve the salesperson data in database according to the selection in the search box-->
function retrieveCustomer(){
    var iteration = 0;
    var inputvalue = document.getElementById("cusSearch").value;
    customerRef.once("value").then(function(snapshot){
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

  function getProfile(){
    document.getElementById("view-profile-title").innerText = firebase.auth().currentUser.email;
    usersRef.child(firebase.auth().currentUser.uid).once("value").then(function(snapshot){
      document.getElementById("view-profile-body").insertAdjacentHTML(
        'beforeend',
        "<div class='form-row my-3 mx-3'>"+
          "<div class='col-lg-3'>"+
            "<input class='form-control' value='Name' readonly>"+
          "</div>"+
          "<div class='col-lg-9'>"+
            "<input class='form-control' id='name' value='"+snapshot.val().name+"' readonly>"+
          "</div>"+
        "</div>"+
        "<div class='form-row my-3 mx-3'>"+
          "<div class='col-lg-3'>"+
            "<input class='form-control' value='Company' readonly>"+
          "</div>"+
          "<div class='col-lg-9'>"+
            "<input class='form-control' id='name' value='"+snapshot.val().company+"' readonly>"+
          "</div>"+
        "</div>"+
        "<div class='form-row my-3 mx-3'>"+
          "<div class='col-lg-5'>"+
            "<input class='form-control' value='Contact Number' readonly>"+
          "</div>"+
          "<div class='col-lg-7'>"+
            "<input class='form-control' id='name' value='"+snapshot.val().telephone+"' readonly>"+
          "</div>"+
        "</div>"+
        "<div class='form-row my-3 mx-3'>"+
          "<div class='col-lg-3'>"+
            "<input class='form-control' value='Address' readonly>"+
          "</div>"+
          "<div class='col-lg-9'>"+
            "<textarea class='form-control' id='name' readonly>"+snapshot.val().address+"</textarea>"+
          "</div>"+
        "</div>"
      );
    });
    $('#viewProfileModal').modal('show')
  }

  function populateEditModal(){
    document.getElementById("view-profile-body").innerHTML = '';
    document.getElementById("edit-profile-title").innerText = firebase.auth().currentUser.email;
    usersRef.child(firebase.auth().currentUser.uid).once("value").then(function(snapshot){
      document.getElementById("edit-profile-body").insertAdjacentHTML(
        'beforeend',
        "<div class='form-row my-3 mx-3'>"+
          "<div class='col-lg-3'>"+
            "<input class='form-control' value='Name' readonly>"+
          "</div>"+
          "<div class='col-lg-9'>"+
            "<input class='form-control' id='name' value='"+snapshot.val().name+"'>"+
          "</div>"+
        "</div>"+
        "<div class='form-row my-3 mx-3'>"+
          "<div class='col-lg-3'>"+
            "<input class='form-control' value='Company' readonly>"+
          "</div>"+
          "<div class='col-lg-9'>"+
            "<input class='form-control' id='company' value='"+snapshot.val().company+"'>"+
          "</div>"+
        "</div>"+
        "<div class='form-row my-3 mx-3'>"+
          "<div class='col-lg-5'>"+
            "<input class='form-control' value='Contact Number' readonly>"+
          "</div>"+
          "<div class='col-lg-7'>"+
            "<input class='form-control' id='tel' value='"+snapshot.val().telephone+"'>"+
          "</div>"+
        "</div>"+
        "<div class='form-row my-3 mx-3'>"+
          "<div class='col-lg-3'>"+
            "<input class='form-control' value='Address' readonly>"+
          "</div>"+
          "<div class='col-lg-9'>"+
            "<textarea class='form-control' id='address'>"+snapshot.val().address+"</textarea>"+
          "</div>"+
        "</div>"
      );
    });
    $('#editProfileModal').modal('show')
  }

  function updateProfile(){
    usersRef.child(firebase.auth().currentUser.uid).update({
      name: $("#name").val(),
      company: $("#company").val(),
      telephone: $("#tel").val(),
      address: $("#address").val(),
    }).then(()=>{
      window.alert("Profile updated successfully");
    }).catch(function(error){
        // Handle Errors here.
        let errorMessage = error.message;
        window.alert(errorMessage);
    });
  }

  function signout(){
    usersRef.child(firebase.auth().currentUser.uid).remove().then(() => {
      firebase.auth().currentUser.delete().then(() => {
        location.href = 'index.html';
      }).catch(function(error){
        window.alert(error.message);
      })
    })
  }

