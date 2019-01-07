//MAPBOX-ADD
//API for adding map functionality for "Add River" feature.
//Ties into views/rivers/new.ejs

//MAPBOX API
//Docs:https://www.mapbox.com/mapbox-gl-js/api/
//Other(?) docs: 
// https://blog.mapbox.com/quickstart-guide-to-mapbox-javascript-api-4b376c68dd46
//API Account Dashboard: https://www.mapbox.com/account/ [50,000 free map views per month]

mapboxgl.accessToken = 'pk.eyJ1IjoiZGFuc2NvdHQyMTUwIiwiYSI6ImNqa3d1dGRtMjAweTQzcW1tb2R1cmNsY3QifQ.J7IvUUi46-D3JkY6klKNDg';

var map = new mapboxgl.Map({
    container: 'map',   //Corresponding div #id on ejs file
    style: 'mapbox://styles/danscott2150/cjqldgl1yo5ig2srqrfsryrdj', //other style: outdoors-v10; maybe look into tweaking in MapBox studio?
    
    //Set default view to state of MA
    center: [-72.0000, 42.4072],
    zoom: 7,
});

//Add zoom options
var nav = new mapboxgl.NavigationControl();
    map.addControl(nav, 'top-left');

//When user clicks on a river, find the lat/lng and the Name
map.on('click', function(e){
    

    //Search within a 100 x/y radius to see if there's a River with a 'waterway-label'
    var width = 100;
    var height = 100;

    //Search within given radius for any 'waterway-label' features
    //Mapbox is able to tell if a River is clicked, but it doesn't return the actual River Name
    //unless the label is clicked. Might be a way to find the ID of the river, and then search
    //the entire map for a waterway-label that shares the ID? For now, the below works just by 
    //searching the immediate vicinity for any labels. Probably problematic if there are multiple in the area
    var features = map.queryRenderedFeatures([
        [e.point.x - width / 2, e.point.y - height / 2],
        [e.point.x + width / 2, e.point.y + height / 2]
    ], {layers: ['waterway-label'] });

    //Create clickedRiver object, used to auto-update the 'add river' form based on user click
    var clickedRiver = {
        name: features[0].properties.name,
        lat: e.lngLat.lat,
        lng: e.lngLat.lng
    };

    //Popup window showing info
    var popup = new mapboxgl.Popup()
        .setHTML(`<p><strong>River Name:</strong>: ${clickedRiver.name}</p>`+
                 `<p><strong>Latitude:</strong>: ${clickedRiver.lat}</p>`+
                 `<p><strong>Longitude:</strong>: ${clickedRiver.lng}</p>`
                 );

    //Place marker where user clicks
    var marker = new mapboxgl.Marker()
        .setLngLat(e.lngLat)
        .setPopup(popup)
        .addTo(map);
        
    //Show popup attached to marker
    marker.togglePopup();

    //Auto-complete 'add river' form based on info from user's click.
    //Ideally, auto-fills 'River Name' and 'Lat/Long' data
    updateForm(clickedRiver);

}); //map.on(click)

//Auto-complete add river form
function updateForm(clickedRiver){
    document.querySelector("#river-name").value = clickedRiver.name;
    document.querySelector("#river-lat").value = clickedRiver.lat;
    document.querySelector("#river-lng").value = clickedRiver.lng;
}