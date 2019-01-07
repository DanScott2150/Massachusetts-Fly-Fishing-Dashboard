mapboxgl.accessToken = 'pk.eyJ1IjoiZGFuc2NvdHQyMTUwIiwiYSI6ImNqa3d1dGRtMjAweTQzcW1tb2R1cmNsY3QifQ.J7IvUUi46-D3JkY6klKNDg';
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/terrain-v9'
});

var map = new mapboxgl.Map({
  container: 'map', // HTML container id
  style: 'mapbox://styles/mapbox/outdoors-v10', // style URL
  center: mapCenter, // starting position as [lng, lat]
  zoom: 13,
  //-72.3422424, 42.271486
//   attributionControl: false
});
var nav = new mapboxgl.NavigationControl();
map.addControl(nav, 'top-left');

map.on('click', function(e){
    
// For accessing data on features >> River name is in here somewhere
// Seems like name only pops up when 'name' label is clicked, but entire
// river still shares an 'id'.
// var features = map.queryRenderedFeatures(e.point);
// console.log(JSON.stringify(features[0], null, 2));

// console.log(features);
//   new mapboxgl.Marker()
//   .setLngLat(e.lngLat)
//   .addTo(map);
});

//  var popup = new mapboxgl.Popup()
//     .setHTML('');
    

// var marker = new mapboxgl.Marker()
// .setLngLat(mapCenter)
// .setPopup(popup)
// .addTo(map);
