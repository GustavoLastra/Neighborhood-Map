function initMap(){
  var gus = {lat: 53.59542605156735, lng: 9.977950828203378};
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat:  52.520008, lng: 13.404954},
    zoom: 8
  })
  var marker = new google.maps.Marker({
    position: gus,
    map: map
  });
  var infoWindow = new google.maps.InfoWindow({
    content: 'Wo wir sind :D'
  });
  marker.addListener("click", function(){
    infoWindow.open(map, marker);
  })

}
