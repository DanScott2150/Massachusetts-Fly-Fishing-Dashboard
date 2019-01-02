//Google Charts API - Used to populate Massachusetts trout stocking data

//Pulls from public Google Spreadsheet maintained by Mass Fish & Wildlife of trout stocking data
//The Mass DFW website has a script that pulls data from the Sheet and parses it into a data table.
//The below code is essentially copy/pasted from https://www.mass.gov/service-details/trout-stocking-report

/* 
***TODO: Go through this code and understand it more, see what I can do in terms of customization
*/

//GCharts Loader script in partials/header.ejs, creates var google
/* global google */
/* global theRiver */
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
	
	var filterWater= new google.visualization.ControlWrapper({
		controlType: 'StringFilter',
		containerId: 'filter_div',
		options: {
        	filterColumnIndex: 1,
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