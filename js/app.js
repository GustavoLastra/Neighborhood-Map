/*            Model          */
var Model = {
   locations : [
    {title: 'Hamburg-Mitte', location: {lat:53.5127, lng: 9.9875399}},
    {title: 'Eimsbüttel', location: {lat:53.604768, lng: 9.929453}},
    {title: 'Altona', location: {lat:53.5692, lng:9.8746}},
    {title: 'Hamburg-Nord', location: {lat:53.6118, lng:10.0073}},
    {title: 'Wandsbek', location: {lat: 53.6536, lng: 10.1070}},
    {title: 'Bergedorf', location: {lat:53.460984, lng:10.150044}},
    {title: 'Hamburg', location: {lat: 53.45, lng: 9.966667}}
  ],
  places : [
    {title: 'Cafe', icon: 'https://maps.google.com/mapfiles/kml/pal2/icon62.png' },
    {title: 'Restaurant', icon: 'https://maps.google.com/mapfiles/kml/pal2/icon32.png'},
    {title: 'Store', icon: 'https://maps.google.com/mapfiles/kml/pal3/icon18.png'},
    {title: 'Pharmacy', icon: 'https://maps.google.com/mapfiles/kml/pal3/icon46.png'},
    {title: 'Hospital', icon: 'https://maps.google.com/mapfiles/kml/pal3/icon38.png'},
    {title: 'Atm', icon: 'https://maps.google.com/mapfiles/kml/pal2/icon53.png'},
    {title: 'Museum', icon: 'https://maps.google.com/mapfiles/kml/pal5/icon36.png'},
    {title: 'Bank', icon: 'https://maps.google.com/mapfiles/kml/pal3/icon21.png'},
    {title: 'Gym', icon: 'https://maps.google.com/mapfiles/kml/pal5/icon54.png'},
  ]
};
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
      self.map = new google.maps.Map(document.getElementById('map'), {
        center: {lat:  52.520008, lng: 13.404954},
        zoom: 8
      });
      self.drawArea = function(geoJSON){
        currentFeature_or_Features = new GeoJSON(geoJSON);
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
      };
      self.drawArea(HamburgMitte);
      self.drawArea(Eimsbüttel);
      self.drawArea(Altona);
      self.drawArea(HamburgNord);
      self.drawArea(Wandsbek);
      self.drawArea(Bergedorf);
      self.drawArea(Hamburg);

      Octopus.control.createMarkers();
      Octopus.control.createPlaceTypes(Model.places);
      this.map.fitBounds(this.bounds);
    }
};
/*            Octopus          */
var Octopus = {
  init: function(){
    this.control = new AppViewModel();
    ko.applyBindings(this.control);
  }
};

/*          Map init callback         */
function init(){
  Octopus.init();
  MapView.init();
}
