/* ViewModel */
var AppViewModel = function() {
  var self=this;
  //var markers = [];
  //var markersForPlaces = [];
  self.placeTypes = ko.observableArray();
  self.markersForPlaces = ko.observableArray();
  self.markers = ko.observableArray();
  self.searchInput = ko.observable('');
  self.place = ko.observable('');
  self.searchResult = ko.observableArray();
  self.nameDistrict = ko.observable('Select a district');
  self.nameService = ko.observable('Where do you want to go');


  self.actualizeDistrict = ko.pureComputed({
    read : function (){
      return self.nameDistrict();
    } ,
    write: function (value) {
      //console.log( value.title);
      self.nameDistrict(isNaN(value.title) ? value.title : "No entiendo esto");

      console.log("actualized district: " + self.nameDistrict());
    },
    owner: this
  });
  self.actualizeService = ko.pureComputed({
    read : function (){
      //console.log(self.nameService());
      console.log("read service: " + self.nameService());
      return self.nameService();
    } ,
    write: function (value) {
      //console.log( value.title.toLowerCase());
      self.nameService(isNaN(value.title) ? value.title : "No entiendo esto");
      console.log("actualized service: " + self.nameService());
      self.searchPlaces();
    },
    owner: this
  });
  /*self.checkPlace = ko.computed(function() {
    console.log("1: " + self.markers()[0]);
    console.log("2: " + self.markers().length);
    console.log("3: " + self.nameDistrict());
    for(var i=0; i<self.markers().length;i++){
      console.log("4: " + self.makers());
      if(self.nameDistrict()===self.makers[i].title){
        location = self.markers().position;
        console.log(MapView.map);
        MapView.map.center = location;
        MapView.map.zoom = 10;
      } else {
        radius = 1000;
        location = {lat: 53.5511, lng: 9.9937};
      }
    }
  });*/

  // look for cafe "places"
  self.searchPlaces = function() {
    infowindow = new google.maps.InfoWindow();
    var service = new google.maps.places.PlacesService(MapView.map);
    var location;
    var radius = 1000;

    for(var i=0; i<Model.locations.length;i++){
      if(self.nameDistrict()===Model.locations[i].title){
        location = Model.locations[i].location;
        //console.log(self.nameDistrict());
        console.log( "Search Places: "+ location);
        MapView.map.setCenter(location);
        MapView.map.setZoom(15);
      } else {
        //radius = 1000;
        //location = {lat: 53.5511, lng: 9.9937};
      }
    }
    console.log("searchPlace: " + self.nameService().toLowerCase());
    service.nearbySearch({
      location: location,
      radius: radius,
      //type: ['cafe']
      type: [self.nameService().toLowerCase()]
    }, callback);
}



  //Filter results("searchResult") based on "searchInput"
  self.filterResult = ko.computed(function() {
    var someInput = self.searchInput().toLowerCase();
    if (!someInput) {
        //if there is no filter, then return the whole list
        for (i=0; i< self.markersForPlaces().length; i++) {
          self.markersForPlaces()[i].setVisible(true);
        }
        return self.searchResult();
        console.log(self.searchResult());
      }

      else {
        //if there is a filter then use arrayFilter to shorten the list
        return ko.utils.arrayFilter(self.searchResult(), function(item) {
          var string = item.name.toLowerCase();
          for (i=0; i < self.markersForPlaces().length; i++) {
            console.log(self.markersForPlaces()[i]);
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


  function callback(results, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      for (var i = 0; i < results.length; i++) {
        self.searchResult.push(results[i]);
        createMarkersForPlaces(results[i],i);
      }
      console.log(self.markersForPlaces());
    }
  }
  function createMarkersForPlaces(place,i) {
    var placeLoc = place.geometry.location;
      self.markersForPlaces.push(new google.maps.Marker({
      map: MapView.map,
      animation: google.maps.Animation.DROP,
      position: place.geometry.location,
      title: place.name
    }));

    self.markersForPlaces()[i].addListener("click", function(){
    populateInfoWindowForPlaces(this, MapView.largeInfowindow);
    //MapView.bounds.extend(self.markersForPlaces()[i].position);
    });
  }
  function populateInfoWindowForPlaces(marker, infowindow){
    if(infowindow.marker != marker){
      infowindow.marker = marker;
      console.log(marker);
      infowindow.setContent('<div>'+ marker.title +'</div>');
      infowindow.open(MapView.map,marker);
      infowindow.addListener("closeclick", function(){
        infowindow.setMarker(null);
      });
    }
  }

};
AppViewModel.prototype.createPlaceTypes = function(list) {
  for(var i=0; i<list.length;i++){
    this.placeTypes.push(list[i]);
  }
};
AppViewModel.prototype.createMarkers = function() {
  for(var i=0; i<Model.locations.length;i++){

    var position = Model.locations[i].location;
    var title = Model.locations[i].title;
    var marker = new google.maps.Marker({
      position: position,
      title: title,
      map: MapView.map,
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
    this.markers.push(marker);
    //console.log(this.markers()[i].position);
    function populateInfoWindow(marker, infowindow){
      if(infowindow.marker != marker){
        infowindow.marker = marker;
        infowindow.setContent('<div>'+ marker.title +'</div>');
        infowindow.open(MapView.map,marker);
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

/*$(function(){

   $(".dropdown-menu .b li a").click(function(){
     $(".btn:nth-child(4)").text($(this).text());

  });

});*/
