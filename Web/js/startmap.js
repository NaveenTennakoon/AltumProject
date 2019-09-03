mapboxgl.accessToken = 'pk.eyJ1IjoiZGFoYWthIiwiYSI6ImNqdWM3eGoyZTAwcWIzenF0cWpvM2pwOXgifQ.gt2wV1v4z1CxtKlU_FFKRg';
var map = new mapboxgl.Map({
    container: 'map',
    center: [79.8612, 6.9271],
    zoom: 8,
    style: 'mapbox://styles/mapbox/streets-v11'
});

var geolocate = new mapboxgl.GeolocateControl();
map.addControl(geolocate);

let lon=lat=null;
geolocate.on('geolocate', function(e) {
    lon = e.coords.longitude;
    lat = e.coords.latitude;
});

function confirm(){
    console.log(lon, lat);
}
function cancel(){
    lon = null;
    lat = null;
    console.log(lon, lat);
}

function signup(){  
    // Get input values from each of the form elements
    let parentkey = $("#company").val();
    let telephone = $("#tel").val();
    let email = $("#email").val();
    let uname = $("#uname").val();
    let pwd = $("#password").val();
  
    // Push the new customer to the database using those values
    if(lon!=null && lat!=null){
        if($("#password").val() == $("#cpassword").val()){
            customerRef.child(parentkey).set({
              "Customer Name": parentkey,
              "Telephone Number": telephone,
              "Email": email,
              "Username": uname,
              "Password": pwd,
              "Longitude": lon,
              "Latitude": lat
            });
        location.href='cus_dashboard.html'
        }
    }
    else{
        $("#locationModal").modal()
    }
    
}