function highChartsFirByRound(id,height,firbyDate){
    console.log("high");
    var series = firbyDate;
    console.log(series);
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
    
    console.log(series);
    
    //Create the chart
    Highcharts.chart(id, {
        chart: {
            height: height,
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