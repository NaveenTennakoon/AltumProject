/*$(function(){
    //make a variable to keep track of data coming from firebase
    var data= [];
    
  
    //listen to data updates from firebase
      feedbackRef.on("value", function (snapshot){
      console.log(snapshot.val());
     //when the data updates at firebase, put it in the data variable
      data= snapshot.val();
    })
  //Entire Form (handler)
  $('#feedbackForm').submit(function(event) {
    
    var $form = $(this);
    console.log("Submit to Firebase"); 
    
    //disable submit button
    $form.find("#feedback").prop('disabled', true);
    
    //get values to send to Firebase
    var nameToSend = $('#name').val();
    console.log(nameToSend);
    
    var feedbackToSend = $('#feedback').val();
    console.log(feedbackToSend);
    

    
    //take the values from the form, and put them in an object
    var newActivity= {
      "name1": nameToSend,
      "feedback1": feedbackToSend,

    }
    //put new object in data array
    data.push(newActivity);
    console.log(data);
    
      //send the new data to Firebase
        feedbackRef.set(data, function(err){
        if(err){
          alert("Data no go");
        }
      });
  
      return false;
    })
}


*/



// Save a feedback to the database, using the input in the form
var submitFeedback = function () {
    // Get input values from each of the form elements
    var value1 = $("#name").val();
    var value2 = $("#feedback").val();

    // Push the new feedback to the database using those values
    feedbackRef.push({
        "name": value1,
        "description": value2
    });
  };
  // Find the HTML element with the id feedbackForm, and when the submit
  // event is triggered on that element, call submitFeedback.
  $("#fb").click(submitFeedback);
  // End of saving new feedback

  

  