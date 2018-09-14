function highChartsGirByRound(id,height,girByDate){
    var series = girByDate;
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
    var totalGIR = 0;
    series.forEach(function(pair){
        pair[0] = Math.round((new Date(pair[0])).getTime());
        totalGIR = totalGIR + pair[1];
    });
    var avgGIR = totalGIR / series.length;
    
    //Create the chart
    Highcharts.chart(id, {
        chart: {
            height: height,
            type: 'line'
        },
        title: {
            text: 'GIR by Round'
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
                text: 'GIRs'
            },
            plotLines: [{
                color: 'red',
                value: avgGIR, // Insert your average here
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
            name: 'GIRs',
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