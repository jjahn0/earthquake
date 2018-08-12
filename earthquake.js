// Store our API endpoint inside queryUrl
// var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson";
var queryUrl = "http://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2014-01-01&endtime=" +
  "2014-01-02&maxlongitude=-69.52148437&minlongitude=-123.83789062&maxlatitude=48.74894534&minlatitude=25.16517337";

// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
  // Once we get a response, send the data.features object to the createFeatures function
  createFeatures(data.features);
});

function createFeatures(earthquakeData) {

  // Define a function we want to run once for each feature in the features array
  // Give each feature a popup describing the place and time of the earthquake
  function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.place +
      "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
  }

  function createCircleMarker(feature, latlng ){
      let options = {
          radius: 5*feature.properties.mag,
          fillColor: "rgba(255,100,0)",
          color: "#000",
          weight: 1,
          opacity: 0.8,
          fillOpacity: 0.6
      }
      return L.circleMarker( latlng, options );
  }
  var ll = L.latLng(40.795, -73.953)

    // create marker
  function createRings(feature, latlng){
    console.log(latlng);
    var iconWidth = feature.properties.mag*10;
    let icon = L.divIcon({
        iconSize: [iconWidth, iconWidth],
        iconAnchor: [iconWidth/3, iconWidth/3],
        popupAnchor: [iconWidth/3, 0],
        shadowSize: [0, 0],
        className: 'animated-icon my-icon-id' 
      })
    let marker = L.marker(latlng, {
        icon: icon,
        title: "magnitude:" +feature.properties.mag
    })
    return marker;
  }

//   marker.addTo(myMap);



  // Create a GeoJSON layer containing the features array on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the array
  var earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature,
    // pointToLayer: createCircleMarker
    pointToLayer: createRings
  });

  // Sending our earthquakes layer to the createMap function
  createMap(earthquakes);
}

function createMap(earthquakes) {

  // Define streetmap and darkmap layers
  var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/outdoors-v10/tiles/256/{z}/{x}/{y}?" +
    "access_token=pk.eyJ1IjoiamphaG4wIiwiYSI6ImNqaWR4MHVycTAzZHAza213dzh0aGoxZmMifQ.b_qp4GxECuFlH3xUCZFb-Q." +
    "T6YbdDixkOBWH_k9GbS8JQ");

  var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/dark-v9/tiles/256/{z}/{x}/{y}?" +
    "access_token=pk.eyJ1IjoiamphaG4wIiwiYSI6ImNqaWR4MHVycTAzZHAza213dzh0aGoxZmMifQ.b_qp4GxECuFlH3xUCZFb-Q." +
    "T6YbdDixkOBWH_k9GbS8JQ");

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Dark Map": darkmap,
    "Street Map": streetmap
  };

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [darkmap, earthquakes]
  });




  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);
}

