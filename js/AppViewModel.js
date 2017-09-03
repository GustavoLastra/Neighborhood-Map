/* ViewModel */
var AppViewModel = function() {
  var self=this;
  self.placeTypes = ko.observableArray();
  self.markersForPlaces = ko.observableArray();
  self.markers = ko.observableArray();
  self.touristicMarkers = ko.observableArray();
  self.searchInput = ko.observable('');
  self.touriticSearchInput = ko.observable('');
  self.place = ko.observable('');
  self.searchResult = ko.observableArray();
  self.nameDistrict = ko.observable('Select a district');
  self.nameService = ko.observable('Where do you want to go?');
  self.actualizeTouristic = function(data){
      console.log("touristic data: " + data)
      self.displayInfoWindow(self.touristicMarkers(), data.title );
  };
  self.actualizeDistrict = ko.pureComputed({
    read : function (){
      return self.nameDistrict();
    } ,
    write: function (value) {
      self.nameDistrict(isNaN(value.title) ? value.title : "No entiendo esto");
      self.displayInfoWindow(self.markers(), self.nameDistrict());
    },
    owner: this
  });
  self.actualizeService = ko.pureComputed({
    read : function (){
      return self.nameService();
    } ,
    write: function (value) {
      self.nameService(isNaN(value.title) ? value.title : "No entiendo esto");
      self.searchPlaces();
    },
    owner: this
  });
  self.touristicFilterResult = ko.computed(function() {
    var someInput = self.touriticSearchInput().toLowerCase();
    if (!someInput) {
        //if there is no filter, then return the whole list
        for (i=0; i< self.touristicMarkers().length; i++) {
          self.touristicMarkers()[i].setVisible(true);
        }
        return Model.touristicLocations;
      }
      else {
        //if there is a filter then use arrayFilter to shorten the list
        return ko.utils.arrayFilter(Model.touristicLocations, function(item) {
          var string = item.title.toLowerCase();
          for (i=0; i < self.touristicMarkers().length; i++) {
            //console.log(self.markersForPlaces()[i]);
            var str2 = self.touristicMarkers()[i].title.toLowerCase();
            if(str2.search(someInput) >=0)
              {self.touristicMarkers()[i].setVisible(true);}
            else
              {self.touristicMarkers()[i].setVisible(false);}
            }
          if( string.search(someInput) >= 0 )
            {return true;}
          else
            {return false;}
        });
      }
  }, this);

  //Filter results("searchResult") based on "searchInput"
  self.filterResult = ko.computed(function() {
    var someInput = self.searchInput().toLowerCase();
    if (!someInput) {
        //if there is no filter, then return the whole list
        for (i=0; i< self.markersForPlaces().length; i++) {
          self.markersForPlaces()[i].setVisible(true);
        }
        return self.searchResult();
      }
      else {
        //if there is a filter then use arrayFilter to shorten the list
        return ko.utils.arrayFilter(self.searchResult(), function(item) {
          var string = item.name.toLowerCase();
          for (i=0; i < self.markersForPlaces().length; i++) {
            //console.log(self.markersForPlaces()[i]);
            var str2 = self.markersForPlaces()[i].title.toLowerCase();
            if(str2.search(someInput) >=0)
              {self.markersForPlaces()[i].setVisible(true);}
            else
              {self.markersForPlaces()[i].setVisible(false);}
            }
          if( string.search(someInput) >= 0 )
            {return true;}
          else
            {return false;}
        });
      }
  }, this);
  self.displayInfoWindowForPlaces = function(data) {
    for(i=0;i<self.markersForPlaces().length;i++){
      if(self.markersForPlaces()[i].title===data.name){
        self.populateInfoWindow(self.markersForPlaces()[i],MapView.largeInfowindow);
      }
    }
  }
  self.displayInfoWindow= function(markers, name) {
    for(i=0;i<markers.length;i++){
      if(markers[i].title===name){
        self.populateInfoWindow(markers[i],MapView.largeInfowindow);
      }
    }
  }
  self.populateInfoWindow = function(marker, infowindow){
    // Check to make sure the infowindow is not already opened on this marker.
    if (infowindow.marker != marker) {
      // Clear the infowindow content to give the streetview time to load.
      infowindow.setContent('');
      infowindow.marker = marker;
      // Make sure the marker property is cleared if the infowindow is closed.
      infowindow.addListener('closeclick', function() {
        infowindow.marker = null;
      });
      var streetViewService = new google.maps.StreetViewService();
      var radius = 300;
      // In case the status is OK, which means the pano was found, compute the
      // position of the streetview image, then calculate the heading, then get a
      // panorama from that and set the options
      function getStreetView(data, status) {
        if (status == google.maps.StreetViewStatus.OK) {
          var nearStreetViewLocation = data.location.latLng;
          var heading = google.maps.geometry.spherical.computeHeading(
            nearStreetViewLocation, marker.position);
            infowindow.setContent('<div class="">' + marker.title + '</div><div class"" id="pano"></div>');
            var panoramaOptions = {
              position: nearStreetViewLocation,
              pov: {
                heading: heading,
                pitch: 30
              }
            };
          var panorama = new google.maps.StreetViewPanorama(
            document.getElementById('pano'), panoramaOptions);
        } else {
          infowindow.setContent('<div>' + marker.title + '</div>' +
            '<div>No Street View Found</div>');
        }
      }
      // Use streetview service to get the closest streetview image within
      // 50 meters of the markers position
      streetViewService.getPanoramaByLocation(marker.position, radius, getStreetView);
      // Open the infowindow on the correct marker.
      infowindow.open(MapView.map, marker);
    }
  }
  // look for cafe "places"
  self.searchPlaces = function() {
    self.searchResult([]);
    for (var i = 0; i < self.markersForPlaces().length; i++) {
          self.markersForPlaces()[i].setMap(null);
    }
    self.markersForPlaces([]);
    infowindow = new google.maps.InfoWindow();
    var service = new google.maps.places.PlacesService(MapView.map);
    var location="";
    var radius = 4000;
    for(var i=0; i<Model.locations.length;i++){
      if(self.nameDistrict()===Model.locations[i].title){
        location = Model.locations[i].location;
        //console.log("Location: " + Model.locations[i].location.lng);
        //console.log( "Search Places: "+ Model.locations[i].location.lng);
        MapView.map.setCenter(location);
        MapView.map.setZoom(12);
      }
      if(location==""){
        location = {lat:53.5127, lng: 9.9875399};
      }
    }
    service.nearbySearch({
      location: location,
      radius: radius,
      type: [self.nameService().toLowerCase()]
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
    var icon;
    for(var j=0;j<Model.places.length;j++){
      if(self.nameService() == Model.places[j].title){
        //console.log("Result create icon for places: " + Model.places[j].icon)
        icon = Model.places[j].icon;
      }
    }
      self.markersForPlaces.push(new google.maps.Marker({
      map: MapView.map,
      //animation: google.maps.Animation.DROP,
      icon: icon,
      position: place.geometry.location,
      title: place.name
    }));
    self.markersForPlaces()[i].addListener("click", function(){
    self.populateInfoWindow(this, MapView.largeInfowindow);
    });
  }
};
AppViewModel.prototype.createPlaceTypes = function(list) {
  for(var i=0; i<list.length;i++){
    this.placeTypes.push(list[i]);
  }
};
AppViewModel.prototype.createMarkers = function(loc, markerType) {
  var self = this;
  for(var i=0; i<loc.length;i++){
    var position = loc[i].location;
    var title = loc[i].title;
    var marker = new google.maps.Marker({
      position: position,
      title: title,
      map: MapView.map,
      animation: google.maps.Animation.DROP,
      icon: MapView.defaultIcon,
      id: i
    });
    marker.addListener("click", function(){
      //populateInfoWindow(this, MapView.largeInfowindow);
      self.populateInfoWindow(this, MapView.largeInfowindow);
    });
    marker.addListener('mouseover', function() {
      this.setIcon(MapView.highlightedIcon);
    });
    marker.addListener('mouseout', function() {
      this.setIcon(MapView.defaultIcon);
    });
    MapView.bounds.extend(marker.position);
    if(markerType=="district"){
      this.markers.push(marker);
    }else{
      this.touristicMarkers.push(marker);
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
