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
    - Struggling to get variables in middleware function (specifically River's latitude and longitude)
        to update dynamically based on the current River. Feels like I'm almost there, it's just an issue
        of variable scope. It's probably an easy fix that'll be a no-brainer when I look at it with fresh eyes.
    
===== 7.30 =====
Still ongoing issues with Weather API:
    - Still haven't resolved issue from yesterday, after trying a couple new ways
    - Narrowed down problem. When executing the mongoose query to find the current River's latitude,
        console.log's within the function return the expected value, however console.log's outside
        of the function return undefined. In actual console, 'undefined' value shows first, which makes
        me think the problem is due to time it takes to actually execute the mongoose query.
    - It sounds like this can be solved by incorporating Promises. Need to learn about Promises.

===== 7.31 =====
Took a break from Weather API today. Instead focused on starting to implement journal entries:
        - Idea is that for each river, user can add journal entries/notes/etc
        - As a starting point, copied over the "comments" functionality from YelpCamp. Can tweak going forward
        - Currently manually adding comments in seeds.js via the forEach, need to break out into own 
           array/river data

===== 8.01 =====
No actual app work done today. Spent day working through Udemy course that covers Promises in NodeJS, with
one module specifically using DarkSky API call as a example! Should be good to get the weather API fully
functional over the next day or two.

===== 8.02 =====
Weather API:
    - Success! Using promieses and axios, middleware function now successfully queries the current River for
        latitude and longitude, and then makes an API call to DarkSky to return the weather data, and then
        passes that data into the actual show.ejs view.
    - Still to-do:
        - Better formatting. Bring in more data than just current temp & summary. Sunrise/sunset, and high/low
            would be good.
        - Implement 5-day forecast. The API call response includes a week's worth of data, marked by
            UNIX timecodes. Need to look into how to convert that into Javascript/day of the week.


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

    
    