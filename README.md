Fishing Journal for keeping track of outings, research, other info, etc.


To Do:
B


# USGS river flow data (via USGS API)
# Weather forecast for area (via some API)
# Map View (Google Maps API)
# Trout stocking data (Some states might have API? idk)
# User Journal ->
### Dated entries, fish caught, flies used, etc.
# Other Research/notes
# River access points
# Nearby camping and/or other rivers


===== 7.28.18 =====
Current goals:
    - Add weather forecast for each River via API. Will probably need to add zipcode to River schema
    - Add USGS river flow data via API. Most rivers have multiple flow markers, so will 
        need to figure out how to get just one. Can hopefully fine-tune it once the River's 'Section'
        functionality is built out.
    - Add map of River via Google Maps API. Will probably also need zipcode added to River schema for this too.
    - Add very basic journal functionality. On River page, user can CRUD entries. For now, just similar
        to basic comment functionality
    
Thoughts for the Future:
    - Way to update URL id's?
    - Way to 'slugify' River name attributes? Need version with no spaces/etc

===== 7.29 =====
Currently working on Weather API:
    - Via DarkSky API. API call is made as a middleware function when the River Show route is accessed.
    - Able to get API call to work by passing in manual data.
    - Struggling to get variables in middleware function (specifically River's latitude adn longitude)
        to update dynamically based on the current River. Feels like I'm almost there, it's just an issue
        of variable scope. It's probably an easy fix that'll be a no-brainer when I look at it with fresh eyes.
    
    
 )
    
    
    
### DarkSky API ###
Docs: https://darksky.net/dev/docs
Pricing: Free for up to 1,000 API calls per day. No billing info entered, so should cap at this amount
DarkSky API does not allow CORS requests, have to use node-fetch
--ref video: https://www.youtube.com/watch?v=6f7EJ6GcD8Q
--ref code: https://gist.github.com/prof3ssorSt3v3/0cdc5b0f118e06b8c1c0e255c3db704a
Does not include geocoding capabilities, need to find separate solution

DarkSky API called as Middleware for River show route
Stores JSON weather data in req.-variable, which gets passed into show.ejs

    
    