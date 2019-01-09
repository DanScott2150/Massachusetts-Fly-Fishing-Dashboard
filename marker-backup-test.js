                
                    map.on('load', function(){
                        console.log("Map onload");
                        map.addLayer({
                            "id": "points",
                            "type": "symbol",
                            "source": {
                                "type": "geojson",
                                "data": {
                                    "type": "FeatureCollection",
                                    "features": [
                                        
                        //Populate saved markers from database
                        <% river.mapMarkers.forEach(function(marker){ console.log("Markers: " + marker); %>
                                        {
                                            "type": "Feature",
                                            "properties": {
                                                "type": "<%= marker.type %>",
                                                "title": "<%= marker.title %>",
                                                "description": "<%= marker.description %>",
                                                "icon": "<%= marker.icon %>",
                                            },
                                            "geometry": {
                                                "type": "Point",
                                                "coordinates": [<%=marker.lng%>,<%=marker.lat%>]
                                            }
                                        },
                        <% }); %>
                                    ]
                                }
                            },
                             "layout": {
                                 "icon-image": "{icon}-15",
                                "icon-allow-overlap": true
                            }
                    }); //map.addLayer()
                    }); //mapp.onLoad()
                    
                    
                    
                    
                    ----------------------------------
                    <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.6.3/css/all.css" integrity="sha384-UHRtZLI+pbxtHCWp1t77Bi1L4ZtiqrqD80Kn4Z8NTSRyMA2Fd33n5dQ8lWUE00s/" crossorigin="anonymous">
                <style>
                    .marker {
    font-size: 16px;
    color: red;
    border: 1px solid #000;
    padding: 5px;
    border-radius: 10px;
    opacity: 0.9;
    background: lightblue;
}

    .marker:hover{
        cursor:pointer;
    }


                </style>
                <script>
                    //Populate saved markers from database
                    <% river.mapMarkers.forEach(function(marker){ console.log("Markers: " + marker); %>
                    
                        (function createMarker(){
                            let title = "<%= marker.title %>";
                            let description = "<%= marker.description %>";
                            let type = "<%= marker.type %>";
                            let icon = undefined;
                            
                            switch(type){
                                case 'Camping':
                                    icon = 'campground';
                                    break;
                                case 'Parking':
                                    icon = 'parking';
                                    break;
                                case 'Fishing Spot':
                                    icon = 'fish';
                                    break;
                                default:
                                    icon = 'info-circle';
                            }
                     
                              // create a HTML element for each feature
                              var el = document.createElement('div');
                              el.className = 'marker';
                              el.innerHTML = `<i class="fas fa-${icon}"></i>`;

                    
                            let popup = new mapboxgl.Popup().setHTML(`
                                <strong>Title: ${title}</strong>
                                <p>${description}</p>`);
                            let newMarker = new mapboxgl.Marker(el)
                                .setLngLat([<%=marker.lng%>,<%=marker.lat%>])
                                .setPopup(popup)
                                .addTo(map);
                        })();
                    <% }); %>
                </script>
                