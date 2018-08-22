//Google Charts API
//GCharts Loader script in partials/header.ejs

//Pulls from public Google Spreadsheet maintained by Mass Fish & Wildlife of trout stocking data

//A lot of this code is copy/pasted from the Mass DFW site
//Works for now, but at some point I want to go through and understand it more
//and see what's available in terms of customization

// var theRiver pulled in from show.ejs

     google.charts.load('current', {'packages':['controls', 'table']});
     google.charts.setOnLoadCallback(drawTable);
	  
	function drawTable() {
		var queryString = encodeURIComponent(`SELECT A, B, C, E, G WHERE B="${theRiver}"`);
		var fishquery = new google.visualization.Query('https://docs.google.com/spreadsheets/d/1yedDqFS59PIHnOYWYy8tNnLEbHBWVQ_GZxtGOuRkDzQ/gviz/tq?gid=0&headers=1&tq=' + queryString);
		
		fishquery.send(handleQueryResponse);
	} 
 
    function handleQueryResponse(response) {
        if (response.isError()) {
            alert('Error in query: ' + response.getMessage());response.getDetailedMessage();
            return;
        }

		var data = response.getDataTable();
		
		// Modify table data so it is correctly sorted by pond name AND clickable
        	var numRows = data.getNumberOfRows();
        	for (var i=0; i<numRows; i++) {
            		var textDate = data.getFormattedValue(i, 4);
            		var rawDate=data.getValue(i, 0);
            		data.setValue(i, 0, rawDate); // cell value is what is sorted on, this should be formatted as date
            		data.setFormattedValue(i, 0, textDate); // this is what our visualization will display whihc includes text when waterbody is unstocked
        	}
		
		var dashboard = new google.visualization.Dashboard(document.getElementById('dashboard_div'));
		
		var myTable = new google.visualization.ChartWrapper({
			chartType: 'Table',
			containerId: 'trout_table',
			dataTable: data,
			options: {
				width: '100%',
				page: 'enable',
				pageSize: 10
			},
			view: {'columns': [0,1,2,3]} // Hide the raw name column from view
		});
// 		console.log(myTable);
		
		var filterWater= new google.visualization.ControlWrapper({
			controlType: 'StringFilter',
			containerId: 'filter_div',
// 			state: {
// 			    value: 'Swift'
// 			},
			options: {
             filterColumnIndex: 1,
            //  value: 'Swift',
			 matchType: 'any'
        }
		});
		
		var filterTown = new google.visualization.ControlWrapper({
			controlType: 'StringFilter',
			containerId: 'filterTown_div',
			options: {
             filterColumnIndex: 2
        }
		});
		
		var filterDistrict = new google.visualization.ControlWrapper({
			controlType: 'StringFilter',
			containerId: 'filterDist_div',
			options: {
             filterColumnIndex: 4
        }
		});
		
		dashboard.bind([filterTown], [filterWater]);
		dashboard.bind([filterWater], [myTable]);
		dashboard.draw(data);
		}
	