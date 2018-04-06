function highChartsApproachScatter(id,title,yAxisName,scoreByApproachDistance){
    Highcharts.chart(id, {
        chart: {
            type: 'scatter',
            zoomType: 'xy',
            height: 435
        },
        title: {
            text: title
        },
        xAxis: {
            title: {
                enabled: true,
                text: 'Distance (yds)'
            },
            startOnTick: true,
            endOnTick: true,
            showLastLabel: true
        },
        yAxis: {
            title: {
                text: yAxisName
            }
        },
        legend: {
            enabled: false
        },
        plotOptions: {
            scatter: {
                marker: {
                    radius: 5,
                    states: {
                        hover: {
                            enabled: true,
                            lineColor: 'rgb(100,100,100)'
                        }
                    }
                },
                states: {
                    hover: {
                        marker: {
                            enabled: false
                        }
                    }
                },
                tooltip: {
                    headerFormat: '<b>{series.name}</b><br>',
                    pointFormat: '{point.x} yds, {point.y} ' + yAxisName
                }
            }
        },
        series: [{
            name: 'Data',
            color: 'rgba(33, 252, 9, .5)',
            data: scoreByApproachDistance
        }],
        credits: {
			enabled: false
		}
    });
}