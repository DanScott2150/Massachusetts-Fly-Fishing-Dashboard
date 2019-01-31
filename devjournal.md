*** 1.30 ***
Big update

Map functionality:
        - MAJOR SUCCESS! Finally figured out how to pull the trout stocking geojson data into the map view. Now, on the "Add River"
        page, the rivers that are actively stocked with trout by the Mass DFW are highlighted. Spent the past week or so trying
        to figure this out and was just spinning my wheels. The problem has to do with map projections >> the geojson data I found
        from the Mass DFW had the coordinates listed as EPSG 26986 format, which didn't translate into lat/lng coordinates that were
        readable by google? Found an npm program 'mapshaper' that converts geojson coordinates... took a lot of trial and error (and 
        cursewords) but finally figured it out. Relevant links in case I need to re-visit this:
                - https://www.mass.gov/service-details/massgis-data-layers
                - https://github.com/mbloch/mapshaper/wiki/Command-Reference#-o-output
                - https://github.com/mbloch/mapshaper/issues/194
                - http://spatialreference.org/ref/epsg/nad83-massachusetts-mainland/proj4/
        
        - Also succesful at adding in USGS stations as a data layer. On the "Add River" page, the map also shows triangle icons
        representing USGS data points. User can click on a triangle to auto-populate the USGS Station ID in the form.
        
Data validation & graceful degradation:
        - Added 'connect-flash' package, to show error messages to user when needed.
        - "Add New River" form checks data when submitted:
                - River name, lat & long are required. Throws error if not provided
                - USGS ID & location are optional, okay if not provided
        - On Dashboard: No longer crashes if a River doesn't have a USGS ID or stocking data associated with it. Displays 'n/a' instead
        - On River Show Route: Same as above. Displays "USGS River Data not available for this location" if USGS ID is null

*** 1.24 ***
Maps functionality:
        - Switched maps back to Google Maps API. The look & feel is a lot cleaner, and the coding seems a lot more hassle-free
        in terms of what I'm trying to accomplish right now. If I ever plan on publishing this app for the general public, I'll
        look into switching over to MapBox due to Google's new API usage limits.
        - "Delete" route now works for mapMarkers.

*** 1.23 ***
Goal right now is to get this to "minimum viable product" status, where I'll feel comfortable deploying it online
as a portfolio project. Things I need to accomplish:
        - River Show Route:
                - Fix Map view. Kind of a mess. At the very least, make mapMarkers delete-able.
        - River Edit Route: Make functional
        - River Add Route: Make functional
                - Ideally I'd like to have a map displayed, where user can click a river and it auto-populates the
                river name, lat, long, USGS ID#, and whether or not Mass DFW stocks it with trout.
                - Tried building this out earlier and ran into some hurdles. Going to take one more crack at it. At the
                very least, we can have a map-click auto fill the lat/lng, and user has to manually fill out the rest.
        - Graceful degradation: Build out more extensive error-handling, so that if one of the API calls results in an error,
        everything else still works. For example, if a River doesn't have a valid USGS ID# associated with it


*** 12.29 thru 1.09.19 ***
Made lots of progress during this stretch, but did a poor job of chronicling my updates & thought processes.
    - Built out the actual "Dashboard View" on the main landing page. Dashboard is a table showing each River,
        it's 7-day forecast, USGS flow rates, stocking dates, and a "view more info" link.
    - Made design updates to the River Show route. Nothing ground-breaking but I think it at least looks presentable now.
    - Fiddled around with the MapBox API a bit more. River Show route now has a functional map where users can add
        a map marker with a title & description; map markers have saved in Mongo for the River for data persistence.

*** 8.30 ***
Taking a bit of a break from this project. Picking up extra shifts at work, and focusing more on the online
courses I'm currently taking.

*** 8.21.18 ***
Map for Add River feature:
    - For 'Add River' route, successfully added a Map. User can click on a river on the map, and it will auto-fill 
        the user's form with the River Name, Lat/Lng based on where the User clicked.
    - Using MapBox API for this functionality. Originally started by using Google Maps. Ran into problem with Google 
        in that it doesn't have great support for rivers, or waterbodies in general. Don't think it's possible to extract 
        a river name based on where a user clicks? On top of that, it sounds like Google's new API pricing is driving a 
        lot of developers away... maybe learning a different map API from the get-go will be better for me long-term 
        anyways. Either way, kept the code I had written for GMaps API and saved it to public/js/gmaps.js, just in case.
    - Downside of MapBox is that the doc's are confusing... laid out in a way that's not intuitive at all. Also I'm not 
        thrilled with the look & feel, but I guess I can edit that in the MapBox studio? Something to look into more at 
        a later date...
    - To-do:
        - Extract town name from user click, for River 'location'
        - Find a way to search for nearest USGS data station based on lat/lng
        - Maybe add some sort of filter for trout stocking reports? I.e. user clicks on Miller Rivers to add, and is given options 'Erving, Orange, Royalston, etc' for stocking reports to show on the show.ejs?
        - Data validation & error testing
    - Also, add Maps for show.ejs

*** 8.19 ***
Weather Feature:
    - Minor refactor: Cleaned up weather icon printing, now just a single <svg> tag with the reference set 
        via EJS template strings. Previously, was doing a switch/case function that had every possible svg icon 
        typed out, and then only displayed the one that matched the current icon data. Trimmed the 'weather.ejs' 
        file by about 100 lines!
UI update:
    - Updated River show view, changed sidebar to sticky, and now links to the sections within the page 
        (weather/stocking/etc).
    - To-do:
        - Add a smooth-scroll for link clicks, make it so relevant sidebar link li highlights when user 
            scrolls to that section. A lot of landingpage websites have this feature, shouldn't be too hard to figure out.

*** 8.15 ***
Trout Stocking Functionality:
    - Struggled with getting the trout stocking functionality to be dynamic. Figured out that the problem is 
        that the River info is server-side, while the Google Charts function is client-side. Having trouble passing 
        variables between the two. Found a npm package that integrates Google Charts onto server-side, think I'll need 
        to dig into that, or at least look through the code and extract out the parts that I need? 
        (https://www.npmjs.com/package/google-charts)
    - Actually disregard above bullet point. Found a really easy fix. Within the script tag on the show view, 
        pass in var theRiver = "<%=river.name%>". Basically pass a server-variable via EJS template strings into 
        client-side JavaScript. This feels like a bad practice (bookmark: research this more), but it gets the job 
        done for now.
    -- TO DO:
        - Look into if there are any limits on querying Google Spreadsheets, or better ways to go about this. 
            Currently this works, but I have a couple reservations: 1) it takes a significant amount of time to 
            load, sometimes as much as 5-10 seconds; and 2) what if the Mass DFW doesn't like me auto-scraping the 
            data, or doesn't like me pinging it numerous times, and turns the sheet private? Might be better to set 
            up a process where my app pulls the data once per day and stores it locally on the server, and then all 
            River views pull from that dataset instead?

*** 8.14 ***
Current Project: Trout Stocking data
    - Ideally, each River shows data for when it was last stocked with trout. Each state (in New England, at least) has
        this data published on their respective Department of Fish & Wildlife website, though each site presents this
        data differently. So this might be a challenge.
    - Starting with Massachusetts: After digging around on their DFW site where stocking data is displayed
        (https://www.mass.gov/service-details/trout-stocking-report), via DevTools "sources" tab, was able to find that 
        the data was being pulled from a public Google Docs Spreadsheet.
    - Tried making Axios request directly to spreadsheet. Almost worked, but it returns an object that contains both XML 
        and JSON, and a lot of other unnecessary stuff? Seems like it would be impossible to filter out just the results 
        that I need.
    - Tried Google Sheets API, but was having trouble finding the right way to filter rows based on specific criteria. 
        i.e. on the River page for the Swift River, I only want to pull data rows where the name is equal to 'Swift River'. 
        I'm sure it's possible? But I couldn't figure it out and was starting to go in circles reading the docs. 
        (https://developers.google.com/sheets/api/)
    - Going back to inspecting the Mass Trout website, it turns out they actually use the Google Charts API instead, 
        and use it to output the data table.
    - Copy/pasted most of their code, and tweaked it where needed. Was able to successfully filter results for the 
        "Swift River" for basic proof-of-concept.
    -- TO DO:
        - Query value is currently hardcoded to "Swift River", need to change it to the River.name so it updates to 
            whatever the current River is. In order to accomplish this I think I need to move the Charts API code into 
            a middleware function, and access River.name that way? The Charts API is currently being included via 
            a <script src></script>tag linking to an external file, so need to figure out how to convert that to a 
            node require?

*** 8.07 ***
Weather functionality:
    - Successfully split weather into it's own partials file. Cleaned up the River show.ejs considerably
    - Going to put weather on the backburner for now. Core functionality works, will revisit later to
        try and do more in terms of cleaning it up and making it look better

USGS API:
    - Shifting focus to USGS API. Goal is to have each River make an API call to the USGS data, and return
        the River's current flow rate.
    - Turned out to actually be pretty easy. Spent some time digging through the USGS API Docs. Data is
        a bit clunky and there's a lot that gets returned, but for the most part pretty straightforward.
    - Basically copied the Weather API Middleware function and changed the URL & variables to accomodate USGS.
    - Updated River schema to include 'USGS Site ID' field. Even though this value is a number, I had to format
        its datatype as a String because the values commonly begin with a '0', which apparently causes problems
        with Mongoose.
    - Also found a way to pull in a graph (as an <img>) of the relevant data. Graph looks kinda ugly though,
        might be worth looking into if it would be possible to pull the data points and then make a new
        graph via SVG. Did a brief google search and it should definitely be possible, just a matter of
        doing the legwork and figuring out how.
    - Future project: Find a way for the User, when adding a new River, to lookup USGS site ID based on....
        ...map coordinates? nearest town? will need to look into what's possible.
    - Also need to build out better error-handling. Not every fishing spot has an associated USGS gauge.

*** 8.06 ***
Weather functionality:
    - Successfully implemented icons. Using "climacons" svg icons. Was not familiar with SVGs so spent some
        time researching this morning. Currently have the library of SVG path's saved in the partials folder,
        which then gets imported into the header.ejs partial. Built a switch/case statement into the show.ejs view,
        to look at the 'icon' property returned in JSON API call, and match to the appropriate SVG path
    - Still need to play around with the SVG styling. Dimensions & alignment still kinda weird. Can also
        style for different colors, right now I just have them all as black.
    - Need to iron out the look & feel. Right now the core functionality is good, but it doesn't look good

*** 8.04 ***
Weather functionality:
    - Successfully converted UNIX timestamp to human-readable. Ran into some issues getting it to then convert
        from UTC time to local time. Right now I'm hard-coding '-14400000' into the Date function, to subtract
        4 hours (14,400 seconds times 1,000 to convert to milliseconds, since JavaScript's Date object uses
        time based on milliseconds). Definitely need to find a better way to do this, since not all Rivers will
        be in EST. Also, daylight savings time. Minor issue for now, will re-visit later.
    - Successfully rounded temperature degrees to nearest int and added degree-symbol (&#176) + F.
    - Successfully changed the 5-day forecast to a for() loop. Cycles through JSON 'daily' items 1-5 
        (since daily[0] is current day) and prints an <li> along with the Day's name, High/Low temps, and Summary
    - Still to do: Implement icons. DarkSky uses Skycons, which are open source. Not sure if I like the animations
        though. Looking at Climacons too, which are static. Not sure how to pull them in & implement though. DarkSky
        JSON data returns an 'icon' property for each day, with values like "sunny" "cloudy" "rain" etc. Maybe have
        an array define these values and link them to specific icons?
    - At this point, would it make sense to break the Weather functionality off into its own partials.ejs file?
    - Semi-related, think I can uninstall node-fetch as a dependency? Original attempt at Weather API used it,
        but now using axios instead.

*** 8.03 ***
Weather functionality:
    - Did some minor tinkering, mostly with the front-end of the weather app. Have it set up so that the
        main part of the weather div shows current conditions, and then a sidebar that shows a brief
        5-day forecast.
    - Still to-do:
        - Keep working on design. Right now it (kinda) works but looks like crap.
        - Convert UNIX times to normal times. Both for sunrise/sunset on current weather, but also to
            have it generate the names of the days of the week for the 5-day forecast.
        - On that note, re-code the 5-day forecast within the show view so it loops through? Shouldn't
            have to type the code out 5 times for each value in the 'daily' array.
        - Implement icons. DarkSky docs link to a good icon free icon library.
        - Round degrees to nearest number and add in degrees-symbol + F   

*** 8.02 ***
Weather API:
    - Success! Using promises and axios, middleware function now successfully queries the current River for
        latitude and longitude, and then makes an API call to DarkSky to return the weather data, and then
        passes that data into the actual show.ejs view.
    - Still to-do:
        - Better formatting. Bring in more data than just current temp & summary. Sunrise/sunset, and high/low
            would be good.
        - Implement 5-day forecast. The API call response includes a week's worth of data, marked by
            UNIX timecodes. Need to look into how to convert that into Javascript/day of the week.

*** 8.01 ***
No actual app work done today. Spent day working through Udemy course that covers Promises in NodeJS, with
one module specifically using DarkSky API call as a example! Should be good to get the weather API fully
functional over the next day or two.

*** 7.31 ***
Took a break from Weather API today. Instead focused on starting to implement journal entries:
    - Idea is that for each river, user can add journal entries/notes/etc
    - As a starting point, copied over the "comments" functionality from YelpCamp. Can tweak going forward
    - Currently manually adding comments in seeds.js via the forEach, need to break out into own 
       array/river data
        
*** 7.30 ***
Still ongoing issues with Weather API:
    - Still haven't resolved issue from yesterday, after trying a couple new ways
    - Narrowed down problem. When executing the mongoose query to find the current River's latitude,
        console.log's within the function return the expected value, however console.log's outside
        of the function return undefined. In actual console, 'undefined' value shows first, which makes
        me think the problem is due to time it takes to actually execute the mongoose query.
    - It sounds like this can be solved by incorporating Promises. Need to learn about Promises.

*** 7.29 ***
Currently working on Weather API:
    - Via DarkSky API. API call is made as a middleware function when the River Show route is accessed.
    - Able to get API call to work by passing in manual data.
    - Struggling to get variables in middleware function (specifically River's latitude and longitude)
        to update dynamically based on the current River. Feels like I'm almost there, it's just an issue
        of variable scope. It's probably an easy fix that'll be a no-brainer when I look at it with fresh eyes.

*** 7.28.18 ***
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
    
    
    
    
    USGS API options: https://waterservices.usgs.gov/rest/
- Daily Value API: Able to return statistical data (mean, max/min, stdev, etc) for date or time period
- IV service: https://waterservices.usgs.gov/rest/IV-Service.html

API URL:
http://waterservices.usgs.gov/nwis/iv/?<arguments>

Argument:
&sites=#####    -       ID of specific site; https://water.usgs.gov/wsc/a_api/api_01wbd.html to find
&format=json    -       Specifies data returned in JSON format    
*for latest data, no date-related arguments needed
&parameterCd=#,#,      - USGS parameter code of data to return. 00060 discharge c/fs, 00065 gage height, 00011 water temp F - https://help.waterdata.usgs.gov/code/parameter_cd_query?fmt=rdb&inline=true&group_cd=%

///// DarkSky API
Docs: https://darksky.net/dev/docs
Pricing: Free for up to 1,000 API calls per day. No billing info entered, so should cap at this amount
DarkSky API does not allow CORS requests, have to use node-fetch
--ref video: https://www.youtube.com/watch?v=6f7EJ6GcD8Q
--ref code: https://gist.github.com/prof3ssorSt3v3/0cdc5b0f118e06b8c1c0e255c3db704a
Does not include geocoding capabilities, need to find separate solution

DarkSky API called as Middleware for River show route
Stores JSON weather data in req.-variable, which gets passed into show.ejs
