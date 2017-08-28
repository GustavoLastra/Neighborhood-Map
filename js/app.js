/*            View          */


/*            Model          */

var model = {
   locations : [
    {title: 'zuHause', location: {lat:53.59542605156735, lng:9.977950828203378}},
    {title: 'Die Pizzeria', location: {lat:53.59623, lng: 9.9875399}},
    {title: 'Kaufland', location: {lat:53.6010428, lng:9.9745951}},
    {title: 'Café Borchers', location: {lat:53.5942846, lng:9.9869582}},
    {title: 'Apotheke', location: {lat: 53.5871711, lng: 9.9849477}}
  ]
}


/*           Markers        */
function markersInit() {
  //var home = {lat: 53.59542605156735, lng: 9.977950828203378};
  var largeInfowindow = new google.maps.InfoWindow();
  var bounds = new google.maps.LatLngBounds();
  // Style the markers a bit. This will be our listing marker icon.
  var defaultIcon = makeMarkerIcon('0091ff');

  // Create a "highlighted location" marker color for when the user
  // mouses over the marker.
  var highlightedIcon = makeMarkerIcon('FFFF24');

  for(var i=0; i<model.locations.length;i++){
    var position = model.locations[i].location;
    var title = model.locations[i].title;
    var marker = new google.maps.Marker({
      position: position,
      title: title,
      map: map,
      animation: google.maps.Animation.DROP,
      icon: defaultIcon,
      id: i
    });
    markers.push(marker);
    marker.addListener("click", function(){
      populateInfoWindow(this, largeInfowindow);
    });
    marker.addListener('mouseover', function() {
      this.setIcon(highlightedIcon);
    });
    marker.addListener('mouseout', function() {
      this.setIcon(defaultIcon);
    });

    bounds.extend(marker.position);
  }
  map.fitBounds(bounds);

  function populateInfoWindow(marker, infowindow){
    if(infowindow.marker != marker){
      infowindow.marker = marker;
      infowindow.setContent('<div>'+ marker.title +'</div>');
      infowindow.open(map,marker);
      infowindow.addListener("closeclick", function(){
        infowindow.setMarker(null);
      });
    }
  }



  // This function takes in a COLOR, and then creates a new marker
  // icon of that color. The icon will be 21 px wide by 34 high, have an origin
  // of 0, 0 and be anchored at 10, 34).
  function makeMarkerIcon(markerColor) {
    var markerImage = new google.maps.MarkerImage(
      'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|'+ markerColor +
      '|40|_|%E2%80%A2',
      new google.maps.Size(21, 34),
      new google.maps.Point(0, 0),
      new google.maps.Point(10, 34),
      new google.maps.Size(21,34));
    return markerImage;
  }

  /*         PlacesServices       */


} /*         Endof markersInit       */

/* ViewModel */
function AppViewModel() {
  var self=this;
  self.searchInput = ko.observable('');
  self.searchResult = ko.observableArray();


  var c = self.searchInput();
  var ul = $("#myUL");
  var li = $("li");
  self.filterResult = ko.computed(function() {
    var someInput = self.searchInput().toLowerCase();
    if (!someInput) {
        //if there is no filter, then return the whole list
        for (i=0; i< markers.length; i++) {
          console.log(markers.length);
          markers[i].marker.setVisible(true);
        }
        return self.searchResult();
        console.log(self.searchResult());
      }

      else {
        //if there is a filter then use arrayFilter to shorten the list
        return ko.utils.arrayFilter(self.searchResult(), function(item) {
          var string = item.name.toLowerCase();
          for (i=0; i < markers.length; i++) {
            var str2 = markers[i].marker.title.toLowerCase();
            if(str2.search(lcFilter) >=0)
              {markers[i].marker.setVisible(true);}
            else
              {markers[i].marker.setVisible(false);}
            }
        if( string.search(someInput) >= 0 )
            {return true;}
          else
            {return false;}
            });
        }
  }, this);
  self.searchCafe = function(){
    infowindow = new google.maps.InfoWindow();
    var service = new google.maps.places.PlacesService(map);
    service.nearbySearch({
      location: model.locations[1].location,
      radius: 500,
      type: ['cafe']
    }, callback);
    }


    function callback(results, status) {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        for (var i = 0; i < results.length; i++) {
          self.searchResult.push(results[i]);
          createMarker(results[i]);
        }
      }
    }

    function createMarker(place) {
    var placeLoc = place.geometry.location;
    var marker = new google.maps.Marker({
      map: map,
      position: place.geometry.location
    });

    google.maps.event.addListener(marker, 'click', function() {
      infowindow.setContent(place.name);
      infowindow.open(map, this);
    });

  }

};


// Activates knockout.js
ko.applyBindings(new AppViewModel());
