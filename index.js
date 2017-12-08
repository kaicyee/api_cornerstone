function initAutocomplete() {

  var map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 38.994373, lng: -77.029778},
    zoom: 8,
    mapTypeId: 'roadmap'
  });

  var trafficLayer = new google.maps.TrafficLayer();
  var transitLayer = new google.maps.TransitLayer();
  var myMapType = new google.maps.ImageMapType({
        getTileUrl: function(coord, zoom) {
          return "http://maps.owm.io:8099/5a26dc311c32650001d73e33/" + 
                 zoom + "/" + coord.x + "/" + coord.y + "?hash=5";
        },
        tileSize: new google.maps.Size(256, 256),
        maxZoom: 8,
        minZoom: 0,
        name: 'mymaptype'
      });

      // map.overlayMapTypes.insertAt(0, myMapType);
    // }

    $('#traffic').click(function(){
    if(document.getElementById('traffic').checked)
      {trafficLayer.setMap(map);}
    else
      {trafficLayer.setMap(null);}
    });

    $('#transit').click(function(){
    if(document.getElementById('transit').checked)
      {transitLayer.setMap(map);}
    else
      {transitLayer.setMap(null);}
    });

    $('#weather').click(function(){
    if(document.getElementById('weather').checked)
      {map.overlayMapTypes.insertAt(0, myMapType);}
    else
      // .clear() works like a champ!
      {map.overlayMapTypes.clear();}
    });

  // Create the search box and link it to the UI element.
  var input = document.getElementById('pac-input');
  var searchBox = new google.maps.places.SearchBox(input);
  //  Line below not necessary, fixing searchbox to position
  // map.controls[google.maps.ControlPosition.TOP_CENTER].push(input);

  // Bias the SearchBox results towards current map's viewport.
  map.addListener('bounds_changed', function() {
    searchBox.setBounds(map.getBounds());
  });

  var markers = [];
  // Listen for the event fired when the user selects a prediction and retrieve
  // more details for that place.
  searchBox.addListener('places_changed', function() {
    var places = searchBox.getPlaces();

    if (places.length == 0) {
      return;
    }

    // Clear out the old markers.
    markers.forEach(function(marker) {
      marker.setMap(null);
    });
    markers = [];

    // For each place, get the icon, name and location.
    var bounds = new google.maps.LatLngBounds();
    places.forEach(function(place) {
      if (!place.geometry) {
        console.log("Returned place contains no geometry");
        return;
      }
      var icon = {
        url: place.icon,
        size: new google.maps.Size(71, 71),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(25, 25)
      };

      // Create a marker for each place.
      markers.push(new google.maps.Marker({
        map: map,
        icon: icon,
        title: place.name,
        position: place.geometry.location
      }));

      if (place.geometry.viewport) {
        // Only geocodes have viewport.
        bounds.union(place.geometry.viewport);
      } else {
        bounds.extend(place.geometry.location);
      }
    });
    map.fitBounds(bounds);
  });

}
