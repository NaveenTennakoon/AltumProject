// Save a new product to the database, using the input in the form
var addProduct = function () {

  // Get input values from each of the form elements
  var parentkey = $("#parentkey").val();
  var key1 = $("#key1").val();
  var value1 = $("#value1").val();
  var key2 = $("#key2").val();
  var value2 = $("#value2").val();
  var key3 = $("#key3").val();
  var value3 = $("#value3").val();
  var key4 = $("#key4").val();
  var value4 = $("#value4").val();
  var key5 = $("#key5").val();
  var value5 = $("#value5").val();
  var key6 = $("#key6").val();
  var value6 = $("#value6").val();

  // Push a new product to the database using those values
  inventoryRef.child(parentkey).set({
      [key1]: value1,
      [key2]: value2,
      [key3]: value3,
      [key4]: value4,
      [key5]: value5,
      [key6]: value6 
  });
};
// Find the HTML element with the id addnew, and when the submit
// event is triggered on that element, call addProduct.
$("#addnew").click(addProduct);