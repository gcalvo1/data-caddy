function highChartsFirByRound(id,height,firbyDate){
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
    //Convert to epoch time & get avg
    var totalFIR = 0;
    series.forEach(function(pair){
        pair[0] = Math.round((new Date(pair[0])).getTime());
        totalFIR = totalFIR + pair[1];
    });
    var avgFIR = totalFIR / series.length;
    
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
            },
            plotLines: [{
                color: 'red',
                value: avgFIR, // Insert your average here
                width: '1',
                zIndex: 2, // To not get stuck below the regular plot lines
                dashStyle: 'dash',
                label: {
                    text: 'Average',
                    style: {
                        color: 'red'
                    }
                }
            }]
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