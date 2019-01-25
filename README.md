===== Massachusetts Fly Fishing Dashboard =====

Displays information on fishing conditions for various rivers:

    - Weather conditions & 7-day forecast
    - USGS river flow data
    - Trout stocking schedules (currently Massachusetts-only)
    - User-added Notes, research, and trip journal
    - Map of river, customizable for user-added points of interest

Tech Used:

    - Mongo & Mongoose
    - Node.js & Express
    - Third Party API's:
        - DarkSky.net
        - USGS.gov
        - Google Maps
        - Google Sheets
    - Bootstrap


===== Future Projects =====
River Show Route:

    - USGS River Conditions: 
        - Headline number: show how it compares to average flow for current day. Note if high/low.
            - Flow this through to Dashboard too: Current flow cf/s, along with "Warning: High/Low" alert
        - Many rivers have multiple USGS Data Stations, add ability for user to toggle between them. Maybe integrate into map view too?
        - Look into pulling actual historical data and creating own chart/visualization. Currently pulling an <img> file from USGS.gov, which is ugly
    
    - Stocking:
        - Look at setting up a "mirror" sheet, which copies the official DFW sheet once per day, then have all subsequent API calls (for both Dashboard & single river) query the mirror sheet. Or maybe this is overkill?
        - Try to get actual map data of stocking points, like the Mass DFW has on their stocking website. I've been able to find
        the geoJSON file which (I think) maps out the lines, so I think it's just a matter of figuring out how to import it to my maps.
        - Try to integrate stocking data for other states. Maine seems to only publish stocking data via PDF, so that's probably out. NH looks like it has it hard-coded to its site, so maybe a way to scrape it? VT's data looks like it pulls from a database, via some sort of ASP/.NET code that I'm completely unfamiliar with.
        
    - Map:
        - Add edit functionality for markers
        - Dynamic icons based on marker type (fishing spot/parking/camping)
        - Better UX in general
        - Read thru docs, see what's possible

River Add Route:
    