function highChartsByRound(id,height,byDate,title,suffix){
    var series = byDate;
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
    var total = 0;
    series.forEach(function(pair){
        pair[0] = Math.round((new Date(pair[0])).getTime());
        total = total + pair[1];
    });
    var avg = total / series.length;
    
    //Create the chart
    Highcharts.chart(id, {
        chart: {
            height: height,
            type: 'line'
        },
        title: {
            text: title + ' by Round'
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
                text: title
            },
            labels: {
            formatter: function() {
                    return this.value + suffix;
                }
            },
            plotLines: [{
                color: 'red',
                value: avg, // Insert your average here
                width: '1',
                zIndex: 2, // To not get stuck below the regular plot lines
                dashStyle: 'dash',
                label: {
                    text: 'Average',
                    style: {
                        color: 'red'
                    }
                }
            }],
            allowDecimals: false
        },
        plotOptions: {
            series: {
                label: {
                    connectorAllowed: false
                }
            }
        },
        series: [{
            name: title,
            data: series
        }],
        tooltip: {
            valueSuffix: suffix
        },
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