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
  $("#feedback").click(submitFeedback);
  // End of saving new feedback

  

  