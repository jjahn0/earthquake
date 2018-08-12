var queryUrl = "http://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2014-01-01&endtime=" +
  "2014-01-02&maxlongitude=-69.52148437&minlongitude=-123.83789062&maxlatitude=48.74894534&minlatitude=25.16517337";

  d3.json(queryUrl, function(data) {
    // console.log(data.features);
    createmap(data.features);
  });


  
function createmap(earthquakeData){
    var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/outdoors-v10/tiles/256/{z}/{x}/{y}?" +
      "access_token=pk.eyJ1IjoiamphaG4wIiwiYSI6ImNqaWR4MHVycTAzZHAza213dzh0aGoxZmMifQ.b_qp4GxECuFlH3xUCZFb-Q." +
      "T6YbdDixkOBWH_k9GbS8JQ");

    var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/dark-v9/tiles/256/{z}/{x}/{y}?" +
      "access_token=pk.eyJ1IjoiamphaG4wIiwiYSI6ImNqaWR4MHVycTAzZHAza213dzh0aGoxZmMifQ.b_qp4GxECuFlH3xUCZFb-Q." +
      "T6YbdDixkOBWH_k9GbS8JQ");

    var baseMaps = {
      "Dark Map": darkmap,
      "Street Map": streetmap
    };

    var map = L.map('map', {
      zoom: 5,
      center: [ 38.09, -95.71 ],
      layers: [darkmap]
    });

    var timeDimension = new L.TimeDimension({
      period: "PT5M",
    });

    map.timeDimension = timeDimension;

    var player = new L.TimeDimension.Player({
        transitionTime: 100, 
        loop: false,
        startOver:true
    }, timeDimension);

    var timeDimensionControlOptions = {
        player:        player,
        timeDimension: timeDimension,
        position:      'bottomleft',
        autoPlay:      true,
        minSpeed:      1,
        speedStep:     0.5,
        maxSpeed:      15,
        timeSliderDragUpdate: true
    };

    var timeDimensionControl = new L.Control.TimeDimension(timeDimensionControlOptions);
    map.addControl(timeDimensionControl);

    var customLayer = L.geoJson(null, {
        pointToLayer: function (feature, latLng) {
            if (feature.properties.hasOwnProperty('last')) {
                return new L.Marker(latLng, {
                    icon: icon
                });
            }
            return L.circleMarker(latLng);
        }
    });
}

createmap();
