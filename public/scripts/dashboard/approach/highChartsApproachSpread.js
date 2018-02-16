function highChartsApproachSpread(approachSpreadByDate){
    var series = approachSpreadByDate;
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
    
    var girArray = [],
        missRightArray = [],
        missLeftArray = [],
        missShortArray = [],
        missLongArray = [];
       
    series.forEach(function(round){
        girArray.push([round[0],round[1].gir]);
        missRightArray.push([round[0],round[1].right]);
        missLeftArray.push([round[0],round[1].left]);
        missShortArray.push([round[0],round[1].short]);
        missLongArray.push([round[0],round[1].long]);
    });
    
    Highcharts.chart('approach-spray-area', {
        chart: {
            type: 'area',
            height: 408
        },
        title: {
            text: 'Approach Spread'
        },
        xAxis: {
            type: 'datetime',
            tickmarkPlacement: 'on',
            title: {
                enabled: false
            },
            dateTimeLabelFormats: 
            {
                hour: '%l %p'
            }
        },
        yAxis: {
            title: {
                text: 'Percent'
            }
        },
        tooltip: {
            pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.percentage:.1f}%</b><br/>',
            split: true
        },
        plotOptions: {
            area: {
                stacking: 'percent',
                lineColor: '#ffffff',
                lineWidth: 1,
                marker: {
                    lineWidth: 1,
                    lineColor: '#ffffff'
                }
            }
        },
        series: [{
            name: 'GIR',
            data: girArray
        }, {
            name: 'Long',
            data: missLongArray
        }, {
            name: 'Left',
            data: missLeftArray
        }, {
            name: 'Right',
            data: missRightArray
        }, {
            name: 'Short',
            data: missShortArray
        }],
        credits: {
				enabled: false
		}
    });
}