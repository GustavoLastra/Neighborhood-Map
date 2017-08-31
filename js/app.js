/*            Model          */
var Model = {
   locations : [
    {title: 'Hamburg-Mitte', location: {lat:53.5127, lng: 9.9875399}},
    {title: 'Eimsbüttel', location: {lat:53.574768, lng: 9.959453}},
    {title: 'Altona', location: {lat:53.5792, lng:9.8746}},
    {title: 'Hamburg-Nord', location: {lat:53.6118, lng:10.0073}},
    {title: 'Wandsbek', location: {lat: 53.6536, lng: 10.1070}},
    {title: 'Bergedorf', location: {lat:53.485984, lng:10.216255}},
    {title: 'Hamburg', location: {lat: 53.45, lng: 9.966667}}
  ],
  places : [
    {title: 'Cafe'},
    {title: 'Restaurant'},
    {title: 'Store'},
    {title: 'Pharmacy'},
    {title: 'Hospital'},
    {title: 'Atm'},
    {title: 'Museum'},
    {title: 'Bank'},
    {title: 'Gym'},
  ]
}
/*           Map View        */
var MapView = {
    init: function(){
      self = this;
      self.map;
      self.largeInfowindow = new google.maps.InfoWindow();
      self.bounds = new google.maps.LatLngBounds();
      self.defaultIcon = Octopus.control.makeMarkerIcon('0091ff');
      self.highlightedIcon = Octopus.control.makeMarkerIcon('FFFF24');
      self.currentFeature_or_Features = null;
      /*    Test        */
      self.map = new google.maps.Map(document.getElementById('map'), {
        center: {lat:  52.520008, lng: 13.404954},
        zoom: 8
      });
      /* Test */
      self.drawArea = function(geoJSON){
        currentFeature_or_Features = new GeoJSON(geoJSON);
        if (currentFeature_or_Features.type && currentFeature_or_Features.type == "Error"){
          document.getElementById("put_geojson_string_here").value = currentFeature_or_Features.message;
          return;
        }
        if (currentFeature_or_Features.length){
          for (var i = 0; i < currentFeature_or_Features.length; i++){
            if(currentFeature_or_Features[i].length){
              for(var j = 0; j < currentFeature_or_Features[i].length; j++){
                currentFeature_or_Features[i][j].setMap(self.map);
              }
            }
            else{
              currentFeature_or_Features[i].setMap(self.map);
            }
          }
        }
      }
      self.drawArea(HamburgMitte);
      self.drawArea(Eimsbüttel);
      self.drawArea(Altona);
      self.drawArea(HamburgNord);
      self.drawArea(Wandsbek);
      self.drawArea(Bergedorf);
      self.drawArea(Hamburg);
      /* End of test  */

      Octopus.control.createMarkers();
      Octopus.control.createPlaceTypes(Model.places);
      this.map.fitBounds(this.bounds);
    }
}

var Octopus = {
  init: function(){
    this.control = new AppViewModel();
    ko.applyBindings(this.control);
  }
}

/*          Map init callback         */
function init(){
  Octopus.init();
  MapView.init();
}
