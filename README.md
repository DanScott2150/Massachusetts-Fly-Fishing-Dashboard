# Massachusetts Fly Fishing Dashboard

Displays information on fly-fishing conditions, as well as user-added notes & research for Massachusetts rivers. Home page features a dashboard showing high-level at-a-glance information regarding current weather and river conditions. Each river also has its own individual page, featuring more in-depth information:

    - Weather conditions & 7-day forecast
    - USGS river flow data
    - Trout stocking data & schedules
    - User-added Notes, research, and journal of past outings
    - Map of river, customizable for user-added points of interest

Information regarding weather, river flow rates, and trout stocking data are dynamically generated via third party API's and external data sources.

Rivers can be added, edited, or deleted by the user. The 'Add River' page displays an interactive map, where the user can simply click on a river and the river metadata will be automatically generated.


## Link to Live Demo: [Massachusetts Fly Fishing Dashboard on Heroku](https://#)

## Tech Used

    - Node.js & Express
    - MongoDB & MongooseJS
    - EJS templating
    - Bootstrap CSS
    - Third-Party API's:
        - DarkSky.net
        - USGS.gov
        - Google Maps
        - Google Sheets
    - AWS Cloud9 IDE
    - Heroku


## Future Projects/Ideas:

    - Implement code testing
    - User accounts/authentication
    - 'loading' spinner for 

    - USGS River Conditions: 
        - Headline number: show how it compares to average flow for current day. Note if high/low.
            - Flow this through to Dashboard too: Current flow cf/s, along with "Warning: High/Low" alert
        - Many rivers have multiple USGS Data Stations, add ability for user to toggle between them. Maybe integrate into map view too?
        - Look into pulling actual historical data and creating own chart/visualization. Currently pulling an <img> file from USGS.gov, which is ugly
    
    - Stocking Data:
        - Look at setting up a "mirror" sheet, which copies the official DFW sheet once per day, then have all subsequent API calls (for both Dashboard & single river) query the mirror sheet. Or maybe this is overkill?
        - Try to integrate stocking data for other states. Maine seems to only publish stocking data via PDF, so that's probably out. NH looks like it has it hard-coded to its site, so maybe a way to scrape it? VT's data looks like it pulls from a database, via some sort of ASP/.NET code that I'm unfamiliar with.
        
    - Map:
        - Add edit functionality for markers
        - Dynamic icons based on marker type (fishing spot/parking/camping)
        - Better UX in general
        - Read thru Google Maps docs, see what's possible