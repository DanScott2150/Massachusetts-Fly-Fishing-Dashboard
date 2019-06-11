# Massachusetts Fly Fishing Dashboard

Displays information on fly-fishing conditions for Massachusetts rivers.
### Link to Live Demo: https://fishing-dashboard.herokuapp.com

## Tech Used:
    - Node.js & Express
    - MongoDB & Mongoose
    - Third-party APIs:
        - DarkSky.net
        - USGS.gov
        - Google Maps
        - Google Sheets
    - EJS views templating
    - Bootstrap CSS
    - Heroku

## Setup
Live version hosted on Heroku.
Local version - run via node app.js

Required environment variables:
    - API key for DarkSky.net


## Background
Over the past few years I've adopting fly-fishing as a hobby - this app is my (ongoing) attempt to create a project that I can actually find useful. Development was started after completing Colt Steele's Web Developer Bootcamp course (via Udemy.com), and that course's final project (YelpCamp) was used as somewhat of a starting point.

In its current form, the app displays up-to-date information regarding the weather forecasts and fishing conditions for popular fly-fishing rivers in Western Massachusetts. This is useful because I live in Boston, and all the (worthwhile) fly-fishing spots are at least an hour's drive away. The data provided by this app make it easy for me to decide which river to target during a fishing trip. The app also includes a very basic 'journal' feature, where I can keep a log of past trips, specific spots on rivers I fished, what flies worked for me, etc.


## Current Functionality

Main page is a dashboard that displays the following information for user-specified rivers:
    - Weather forecast for the upcoming week
    - USGS current river flow data (how deep the river currently is)
    - The date that the river was last stocked with trout by the Mass DFW

Clicking a river on the table brings you to a single-river page:
    - More in-depth weather forecast
    - Embedded chart from USGS.gov showing the river's flow rate over time
    - Data table showing the dates & locations of recent trout stockings on the river
    - Notes & Research: Very basic functionality for user to add notes/etc. about the river. Eventually want to build out more of a "trip journal" feature
    - User-customizable map of the river. User can double-click to add a point-of-interest (Specific fishing spot, Parking spot, nearby camping, etc) to the map.

From the main dashboard page, the user can also click "Add New River" to add a new river to the app:
    - This page displays an interactive map, which makes it easy for the user to input information that will be compatible with the APIs we use for data.
    - The map uses a geoJSON overlay to highlight all rivers in the state of Massachusetts that are stocked with trout by the Department of Fish & Wildlife
    - The map uses a second geoJSON overlay to display all USGS data stations in the state of Massachusetts.
    - Clicking a point on the map will auto-populate the latitude/longitude in the "Add River" form. Clicking on a specific river will auto-populate the river's Name & Location in the "Add River" form. Clicking on a specific USGS icon will auto-populate the USGS Station ID # in the form.
    - The Add River form has basic validation: River Name, Latitude and Longitude are required. Since not all rivers have USGS data stations or stocking data, the app won't crash if those fields are left blank.



## Link to Live Demo: [Massachusetts Fly Fishing Dashboard on Heroku](https://#)

## Known Issues:
    - Single River view: 
        - Sunrise/Sunset times are sometimes buggy. I know I should use Moment.js to deal with time but it seems like overkill to pull in a full extra library when this is the only place I'll use it.
        - Adding custom markers to the Map is sometimes buggy
    - Add New River:
        - Map overlays are really slow to load

## Future Projects/Ideas:
    - USGS River Conditions:
        - Many rivers have multiple USGS Data Stations at various points throughout the river. Would like to add the ability on the single-river page for the user to toggle between various stations. Currently have a semi-placeholder set up for this. Maybe have these stations show up on the map as well? 
        - The importance of including the flow rate is that sometimes certain rivers will be too high or too low to fish. Would like to add some kind of "ideal flow" data point, and then have the dashboard auto-generate a "Too High/Too Low" warning.
        - (Low priority) Look into pulling historical data and creating a custom visualization? Currently the flow chart is an <img> pulled directly from USGS.gov, which looks really ugly.

    - Stocking Data:
        - Try to integrate stocking data for other New England states. I was able to figure out how to access this data for Massachusetts, but other states format their websites differently. Maine seems to only publish this info via PDF, so I'm not sure if it'll be possible to do that. NH looks like it's hard-coded on their site, so maybe there's a way to scrape it? VT data seems to be stored in a database and the webpage is generated via ASP/.NET code? Will look into more.

    - Do more with maps? Maybe an overall map-view with toggleable layers: My Rivers, MA Rivers, NH Rivers, Campgrounds, Wish List, etc. 

    - More robust "trip journal" feature.

    - User Authentication: Let a new user create an account, and then all Rivers & custom map markers they add are private to just that account