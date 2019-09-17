// Initialize Firebase
var config = {
    apiKey: "AIzaSyB0ezZy5YT-6pSdmrZEXbK70AIE5SJl_BI",
    authDomain: "altum-46a17.firebaseapp.com",
    databaseURL: "https://altum-46a17.firebaseio.com",
    projectId: "altum-46a17",
    storageBucket: "altum-46a17.appspot.com",
    messagingSenderId: "170107476902",
    appId: "1:170107476902:web:4667ac60268bdf0c"
  };
firebase.initializeApp(config); 

var inventoryRef = firebase.database().ref("inventory");
var employeeRef = firebase.database().ref("employees");
var customerRef = firebase.database().ref("customers");
var gpsRef = firebase.database().ref("tracking");
var feedbackRef = firebase.database().ref("feedback");