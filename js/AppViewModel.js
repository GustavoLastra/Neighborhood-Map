/* ViewModel */
var AppViewModel = function() {
  var markersForPlaces = [];
  var self=this;
  self.markers = [];
  self.searchInput = ko.observable('');
  self.searchResult = ko.observableArray();
  self.districts = ko.observableArray();

  //Filter results("searchResult") based on "searchInput"
  self.filterResult = ko.computed(function() {
    var someInput = self.searchInput().toLowerCase();
    if (!someInput) {
        //if there is no filter, then return the whole list
        for (i=0; i< markersForPlaces.length; i++) {
          console.log(markersForPlaces.length);
          markersForPlaces[i].setVisible(true);
        }
        return self.searchResult();
        console.log(self.searchResult());
      }

      else {
        //if there is a filter then use arrayFilter to shorten the list
        return ko.utils.arrayFilter(self.searchResult(), function(item) {
          var string = item.name.toLowerCase();
          for (i=0; i < markersForPlaces.length; i++) {
            console.log(markersForPlaces[i]);
            var str2 = markersForPlaces[i].title.toLowerCase();
            if(str2.search(someInput) >=0)
              {markersForPlaces[i].setVisible(true);}
            else
              {markersForPlaces[i].setVisible(false);}
            }
          if( string.search(someInput) >= 0 )
            {return true;}
          else
            {return false;}
        });
      }
  }, this);
  // look for cafe "places"
  self.searchCafe = function(){
    infowindow = new google.maps.InfoWindow();
    var service = new google.maps.places.PlacesService(map);
    service.nearbySearch({
      location: Model.locations[1].location,
      radius: 500,
      type: ['cafe']
    }, callback);
  }

  function callback(results, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      for (var i = 0; i < results.length; i++) {
        self.searchResult.push(results[i]);
        createMarkersForPlaces(results[i],i);
      }
    }
  }
  function createMarkersForPlaces(place,i) {
    var placeLoc = place.geometry.location;
      console.log(place.name);
      markersForPlaces.push(new google.maps.Marker({
      map: map,
      animation: google.maps.Animation.DROP,
      position: place.geometry.location,
      title: place.name
    }));

    markersForPlaces[i].addListener("click", function(){
    populateInfoWindowForPlaces(this, MapView.largeInfowindow);
    });
  }
  function populateInfoWindowForPlaces(marker, infowindow){
    if(infowindow.marker != marker){
      infowindow.marker = marker;
      console.log(marker);
      infowindow.setContent('<div>'+ marker.title +'</div>');
      infowindow.open(map,marker);
      infowindow.addListener("closeclick", function(){
        infowindow.setMarker(null);
      });
    }
  }

};
AppViewModel.prototype.createMarkers = function() {
  for(var i=0; i<Model.locations.length;i++){
    var position = Model.locations[i].location;
    var title = Model.locations[i].title;
    var marker = new google.maps.Marker({
      position: position,
      title: title,
      map: map,
      animation: google.maps.Animation.DROP,
      icon: MapView.defaultIcon,
      id: i
    });

    marker.addListener("click", function(){

      populateInfoWindow(this, MapView.largeInfowindow);
    });
    marker.addListener('mouseover', function() {
      this.setIcon(MapView.highlightedIcon);
    });
    marker.addListener('mouseout', function() {
      this.setIcon(MapView.defaultIcon);
    });
    MapView.bounds.extend(marker.position);
    console.log(this);
    this.markers.push(marker);
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
  }
};

AppViewModel.prototype.makeMarkerIcon = function(markerColor) {
  var markerImage = new google.maps.MarkerImage(
    'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|'+ markerColor +
    '|40|_|%E2%80%A2',
    new google.maps.Size(21, 34),
    new google.maps.Point(0, 0),
    new google.maps.Point(10, 34),
    new google.maps.Size(21,34));
  return markerImage;
}
$(window).resize(function () {
    var h = $(window).height(),
        offsetTop = 0; // Calculate the top offset

    $('#map').css('height', (h - offsetTop));
}).resize();

$(function(){

   $(".dropdown-menu li a").click(function(){

     $("#drop").text($(this).text());


  });

});
