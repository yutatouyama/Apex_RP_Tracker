function myFunction() {
	var max_row = 90 * 24;
	var api_key = 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx';
	var base_url = 'https://public-api.tracker.gg/v2/apex/standard/';
	var endpoint = "/profile/{platform}/{platformUserIdentifier}";
	var options = {
		'method' : 'get',
		'contentType' : 'application/json',
		'muteHttpExceptions' : true,
		'headers' : {
			'TRN-Api-Key' : api_key
			}
		};

	var response = UrlFetchApp.fetch(base_url+endpoint, options);
	Logger.log('------------------------------------------------------------------------');
	Logger.log(response.getContentText());
	Logger.log('------------------------------------------------------------------------');
  
	var json = JSON.parse(response.getContentText());
	Logger.log('------------------------------------------------------------------------');
	Logger.log(json['data']['segments'][0]['stats']['rankScore']);
	Logger.log('------------------------------------------------------------------------');
  
	var rank_score = json['data']['segments'][0]['stats']['rankScore'];
	var date = new Date();
	var data = [
		[
			String(Utilities.formatDate( date, 'Asia/Tokyo', 'yyyy-MM-dd: hh:mm:ss')),
			String(rank_score['value']),
			String(rank_score['metadata']['rankName'])
		]
	];
  
	Logger.log('------------------------------------------------------------------------');
	Logger.log(data);
	Logger.log('------------------------------------------------------------------------');
  
	const sheet = SpreadsheetApp.getActiveSheet();
	const numRows = 1;
	const numColumns = data[0].length;
	var row = sheet.getLastRow();

	sheet.getRange(row+1, 1, numRows, numColumns).setValues(data);
  
	if (!sheet.getCharts()[0]) {
		var range = sheet.getRange("A:C");
		var chart = sheet.newChart()
			.addRange(range)
			.setNumHeaders(1)
			.setChartType(Charts.ChartType.LINE)
			.setPosition(2, 5, 0, 0)
			.setOption('title', 'my apex RP tracking line chart');

		sheet.insertChart(chart.build());
	}
  
	if (row > max_row) {
		diff = row - max_row;
		sheet.getRange(1, 1, diff, 3).clear();
		sheet.getRange(diff+1, 1, row+1, 3).moveTo(sheet.getRange(1, 1, max_row, 3))
	}
}
