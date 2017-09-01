# Meet Hamburg!!

## How to try this project

1. Go to [My Project](https://github.com/GustavoLastra/Website-Optimization/blob/master/README.md).
2. Download the project as a zip.
3. Decompress the folder and double click on the "index.html" file.

## Synopsis
Single-page application featuring a map of your Hamburg, Germany. It Includes:

1. Map markers to identify popular locations or places you’d like to visit
2. A search function to easily discover these locations
3. A Listview to support simple browsing of all locations.
4. Third-party APIs that provide additional information about each of these locations (such as StreetView images, Wikipedia articles, Yelp reviews, etc).

## Libraries/Frameworks used

1. jQuery
2. Bootstrap
3. Knockout.js (MVVM Structure)
4. Googlemaps API

##Code Structure

The code's core is located on the "app.js" file:
```
/*            Model          */
var Model = {         //The locations refere to the districts, that Hamburg consists of.
   locations : [
    {title: 'Hamburg-Mitte', location: {lat:53.5127, lng: 9.9875399}},
    {title: 'Eimsbüttel', location: {lat:53.604768, lng: 9.929453}},
    {title: 'Altona', location: {lat:53.5692, lng:9.8746}},
    {title: 'Hamburg-Nord', location: {lat:53.6118, lng:10.0073}},
    {title: 'Wandsbek', location: {lat: 53.6536, lng: 10.1070}},
    {title: 'Bergedorf', location: {lat:53.460984, lng:10.150044}},
    {title: 'Hamburg', location: {lat: 53.45, lng: 9.966667}}
  ],
  places : [        //Here the options, that the user can look for.
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
var MapView = {                     //MapView is in charge of creating the map, the markers and drawing the boundaries of each District.
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
      self.drawArea = function(geoJSON){...};    // I draw the boundaries of each district with the coordinates provided by openstreetmap.org in form of Geojson objects.
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
var Octopus = {                    //My idea was to create the AppViewModel "object" inside the Octopus in order to "combine" the structure of Vanilla.js with the MVVM structure and to achieve modularity through separation of concerns.
  init: function(){
    this.control = new AppViewModel(); // the AppViewModel object is defined on the "AppViewMode.js" file and includes all Observable objects, arrays and computed functions of Knockout.js framework.
    ko.applyBindings(this.control);
  }
};

/*          Map init callback         */
function init(){
  Octopus.init();
  MapView.init();
}

```
## Tests
1. Select a district
2. Select the kind of place, you would like to go.
### Expected result
1. A zoom to the selected district.
2. Showing markers of the places with its proper icon.
3. The possibility to search through the filter input on the listview.
4. By selecting the name on the list, should its marker show information about the place.

## Author
Gustavo Antonio Lastra Colorado
