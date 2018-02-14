function highChartsScoreByDate(scoreByDate){
    //Get Data
    var series = scoreByDate;
    //Sort Data
    function compare(a,b) {
      if (a < b)
        return -1;
      if (a > b)
        return 1;
      return 0;
    }
    series.sort(compare);
    //Convert to epoch time
    scoreByDate.forEach(function(pair){
        pair[0] = Math.round((new Date(pair[0])).getTime());
    });
    
    //Create the chart
    Highcharts.chart('rbd-line', {
        chart: {
            height: 300,
            type: 'line'
        },
        title: {
            text: 'Score by Date'
        },
        xAxis: {
                type: 'datetime',
                dateTimeLabelFormats: 
                {
                    hour: '%l %p'
                }
        },
        yAxis: {
            title: {
                text: 'Score'
            }
        },
        plotOptions: {
            series: {
                label: {
                    connectorAllowed: false
                }
            }
        },
        series: [{
            name: 'Score',
            data: series
        }],
        credits: {
				enabled: false
		},
        responsive: {
            rules: [{
                condition: {
                    maxWidth: 500
                },
                chartOptions: {
                    // legend: {
                    //     layout: 'horizontal',
                    //     align: 'center',
                    //     verticalAlign: 'bottom'
                    // }
                }
            }]
        }
    
    })
}