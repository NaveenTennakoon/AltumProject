// Search box functions
var livelocArr = [];
//live locations snapshot
function livelocsnapshotToArray() {
    gpsRef.child("live").once("value").then(function(snapshot){
    // <!-- snapshot of childs of root of database-->
        snapshot.forEach(function(childSnapshot) {
            var item = childSnapshot.key;
            livelocArr.push(item);
        });
    });
    return livelocArr;
};
//end of snapshot
livelocsnapshotToArray();
//   initiate the auto complete function on the input field
autocomplete(document.getElementById("locSearch"), livelocArr);
// end of Search box functions

map = new OpenLayers.Map("map");
var mapnik         = new OpenLayers.Layer.OSM();
var fromProjection = new OpenLayers.Projection("EPSG:4326");   // Transform from WGS 1984
var toProjection   = new OpenLayers.Projection("EPSG:900913"); // to Spherical Mercator Projection
var position       = new OpenLayers.LonLat(79.8940765,6.8612173).transform(fromProjection, toProjection);
var zoom           = 13; 
map.addLayer(mapnik);
map.setCenter(position, zoom);

var flag = true;
var markers = new OpenLayers.Layer.Markers("Markers");
// include marker for the location retrieved from the database
function putMarker(latMarker, lonMarker){
    var lonLat = new OpenLayers.LonLat(lonMarker, latMarker).transform(new OpenLayers.Projection("EPSG:4326"), map.getProjectionObject());        
    var size = new OpenLayers.Size(30,35);
    var offset = new OpenLayers.Pixel(-(size.w/2), -size.h);
    var icon = new OpenLayers.Icon('img/marker.png', size, offset);
    map.addLayer(markers);
    zoom = 18;
    if(flag){
        markers.addMarker(new OpenLayers.Marker(lonLat, icon));
        flag = false;
    } 
    else{
        markers.clearMarkers();
        markers.addMarker(new OpenLayers.Marker(lonLat, icon));
    }
    map.setCenter(lonLat, zoom);
}

// search the database for the user you are looking for and
// load the last updated location into the map
function liveLocation(){
    document.getElementById("map_profile").style.display = "block";
    var user = document.getElementById("locSearch").value;
    document.getElementById("map_profile").innerHTML = user;
    var liveRef = firebase.database().ref("tracking/live/"+user);         
    liveRef.on("value", function (snapshot){ 
        putMarker(snapshot.val().lat, snapshot.val().lng);                      
    });
}

// Store the customer name to a variable on button click
function getEmpName(){
    var empname = document.getElementById("map_profile").innerHTML;
    var clickFlag = true;
    localStorage.setItem("employeename", empname);
    localStorage.setItem("clickflag", clickFlag);
    location.href = "employees.html";
}