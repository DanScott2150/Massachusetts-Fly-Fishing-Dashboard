//Google Maps API
//Not currently used

/*  

    Starting building out map features with GMaps, but Google handles rivers weird. Switched to MapBox
    because of ability to extract River Name based on where a user clicks. Also, Google's new API
    pricing sounds like it's driving a lot of developers away... might be more worthwhile in the long-run
    to learn MapBox (or some alternative) from the get-go.

    Either way, leaving this code here in case I need to come back to Google Maps for some reason.
    
*/

console.log("GMAPS TEST");


function initMap(){

// Create map {ideally outline MA, but sounds like that's more trouble than it's worth
// User click to add marker
// => From marker, extract Lat/Lng
// ==> Reverse Geocode to return River Name, Town


//   Setup map options & default view to state of Massachusetts
  var options = {
    zoom: 8,
    center: {lat: 42.4072, lng: -72.0000},
    mapTypeId: 'terrain',
    streetViewControl: false
  };

    //Create new Google Map object, occupies div#map
    var map = new google.maps.Map(document.getElementById('map'), options);
    var geocoder = new google.maps.Geocoder;
    var infoWindow = new google.maps.InfoWindow;


    map.addListener('click', function(e){
        // userClick(e.latLng, map);
        var currentLatLng = e.latLng;
        geocodeLatLng(geocoder, map, infoWindow, currentLatLng);
    });
    
    function userClick(currentLatLng, map){

        var marker = new google.maps.Marker({
            position: latLng,
            map: map,
            animation: google.maps.Animation.DROP
        });

        
            
        // var currentLat = latLng.lat();
        // var currentLng = latLng.lng();
        // console.log(toUrlValue(currentLat));
        // var innerContent = "<h4>Current Selection:</h4>" +
        //                     "<p><strong>Latitude:</strong>" + currentLat + "</p>" +
        //                     "<p><strong>Longitude:</strong>" + currentLng + "</p>";
                            
            
        
        
        // infoWindow.open(map, marker);
        
        // marker.addListener('click', function(){
        //     console.log("Marker click");
        // });

        // var riverLatLng = new google.maps.LatLng(latLng);
        // console.log(riverLatLng);
    }


}

        function geocodeLatLng(geocoder, map, infoWindow, currentLatLng){
            geocoder.geocode({'location': currentLatLng}, function(results, status){
                if(status === 'OK'){
                    if(results[0]){
                        map.setZoom(11);
                        var newMarker = new google.maps.Marker({
                            position: currentLatLng,
                            map: map
                        });
                        infoWindow.setContent(results[0].formatted_address);
                        console.log(results);
                        infoWindow.open(map, newMarker);
                    } else {
                        console.log('No results found');
                    }
                } else {
                    console.log("Geocoder failed with status: " + status);
                }
            });
        }