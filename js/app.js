/*            View          */

/*           Markers        */
function markersInit() {
  var locations = [
    {title: 'zuHause', location: {lat:53.59542605156735, lng:9.977950828203378}},
    {title: 'Die Pizzeria', location: {lat:53.59623, lng: 9.9875399}},
    {title: 'Kaufland', location: {lat:53.6010428, lng:9.9745951}},
    {title: 'Café Borchers', location: {lat:53.5942846, lng:9.9869582}},
    {title: 'Apotheke', location: {lat: 53.5871711, lng: 9.9849477}}
  ];

  //var home = {lat: 53.59542605156735, lng: 9.977950828203378};
  var largeInfowindow = new google.maps.InfoWindow();
  var bounds = new google.maps.LatLngBounds();


  for(var i=0; i<locations.length;i++){
    var position = locations[i].location;
    var title = locations[i].title;
    var marker = new google.maps.Marker({
      position: position,
      title: title,
      map: map,
      animation: google.maps.Animation.DROP,
      id: i
    });
    markers.push(marker);
    marker.addListener("click", function(){
      populateInfoWindow(this, largeInfowindow);
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
}

//  sideNav
function myFunction() {
    var input = $('#myInput');
    var filter = input.val().toUpperCase();
    var ul = $("#myUL");
    var li = $("li");

    for (i = 0; i < li.length; i++) {
        a = li[i].getElementsByTagName("a")[0];
        if (a.innerHTML.toUpperCase().indexOf(filter) > -1) {
            li[i].style.display = "";
        } else {
            li[i].style.display = "none";

        }
    }
}
