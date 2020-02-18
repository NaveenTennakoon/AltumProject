// Initialize Firebase
let config = {
  apiKey: " AIzaSyB7_RjkIVHXwvzgI7Y6BQ3aCY2jAbMw7x0",
  authDomain: "altum-46a17.firebaseapp.com",
  databaseURL: "https://altum-46a17.firebaseio.com",
  projectId: "altum-46a17",
  storageBucket: "altum-46a17.appspot.com",
  messagingSenderId: "170107476902",
  appId: "1:170107476902:web:4667ac60268bdf0c"
};
firebase.initializeApp(config)

let inventoryRef = firebase.database().ref("inventory")
let gpsRef = firebase.database().ref("tracking")
let usersRef = firebase.database().ref("users")
let ordersRef = firebase.database().ref("orders")