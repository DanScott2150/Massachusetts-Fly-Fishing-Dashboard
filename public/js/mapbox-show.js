// MAPBOX API
// Docs: https://www.mapbox.com/mapbox-gl-js/api/

/* global mapboxgl */     //via script include in partials/header
/* global mapCenter */    //via rivers/show
/* global riverID */

mapboxgl.accessToken = 'pk.eyJ1IjoiZGFuc2NvdHQyMTUwIiwiYSI6ImNqa3d1dGRtMjAweTQzcW1tb2R1cmNsY3QifQ.J7IvUUi46-D3JkY6klKNDg';

var map = new mapboxgl.Map({
  container: 'map', // HTML container id
  style: 'mapbox://styles/mapbox/outdoors-v10', // style URL
  center: mapCenter, // starting position as [lng, lat]
  zoom: 13,
  pitchWithRotate: false,
  attributionControl: false
})
.addControl(new mapboxgl.AttributionControl({
  compact: true
}));


var nav = new mapboxgl.NavigationControl();
map.addControl(nav, 'top-left');



map.on('dblclick', function(e){
  console.log(e);
    map.flyTo({center: e.lngLat[0]});

var features = map.queryRenderedFeatures(e.point);
// console.log(JSON.stringify(features[0], null, 2));

console.log(features);



  var popup = new mapboxgl.Popup()
    .setHTML(`<h3>Add New Marker</h3>
<form action="/rivers/${riverID}/mapMarkers" method="POST">
  <div class="form-group">
    <select class="form-control" name="markerData[type]">
      <option>Fishing Spot</option>
      <option>Parking</option>
      <option>Camping</option>
      <option>Other Note</option>
    </select>
  </div>
  
<div class="form-group">
  <input class="form-control" id="marker-title" type="text" name="markerData[title]" placeholder="Title">
</div>

<div class="form-group">
  <textarea class="form-control" rows="5" id="marker-description" name="markerData[description]" placeholder="Description"></textarea>
</div>

<input id="lngLat" name="markerData[lat]" type="hidden" value="${e.lngLat.lat}">
<input id="lngLat" name="markerData[lng]" type="hidden" value="${e.lngLat.lng}">

<small>
  <strong>Lat/Lng: </strong> [${Math.floor(e.lngLat.lat*10000)/10000}, ${Math.floor(e.lngLat.lng*10000)/10000}]
</small>

                  
                    <div class="form-group">
                        <button class="btn btn-lg btn-default btn-block btn-primary">Submit</button>
                    </div>
                </form>`);

  new mapboxgl.Marker({
    draggable: true
  })
  .setLngLat(e.lngLat)
  .addTo(map)
  .setPopup(popup)
  .togglePopup();
});

// var marker = new mapboxgl.Marker()
// .setLngLat(mapCenter)
// .setPopup(popup)
// .addTo(map);
