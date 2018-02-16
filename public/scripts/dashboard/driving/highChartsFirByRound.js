function highChartsFirByRound(firbyDate){
    var series = firbyDate;
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
    series.forEach(function(pair){
        pair[0] = Math.round((new Date(pair[0])).getTime());
    });
    
    //Create the chart
    Highcharts.chart('fir-per-round-line', {
        chart: {
            height: 418,
            type: 'line'
        },
        title: {
            text: 'FIR by Round'
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
                text: 'FIRs'
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
            name: 'FIRs',
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
    });
}