var map;
var markers = [];
function initMap(){
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat:  52.520008, lng: 13.404954},
    zoom: 8
  })  
}
$(window).resize(function () {
    var h = $(window).height(),
        offsetTop = 0; // Calculate the top offset

    $('#map').css('height', (h - offsetTop));
}).resize();
