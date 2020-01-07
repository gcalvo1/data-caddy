function highChartsScoreBySlopeRatingScatter(id,title,xAxisName,yAxisName,scoreBySlopeRating){
    Highcharts.chart(id, {
        chart: {
            type: 'scatter',
            zoomType: 'xy'
        },
        title: {
            text: title
        },
        xAxis: {
            title: {
                enabled: true,
                text: xAxisName
            },
            startOnTick: true,
            endOnTick: true,
            showLastLabel: true
        },
        yAxis: {
            title: {
                text: yAxisName
            },
            labels: {
                overflow: 'justify',
                formatter: function() {
                   if(this.value > 0) { 
                    return "+"+this.value;
                   } else if(this.value == 0) {
                    return "E";
                   }                   
                   else {
                    return this.value;
                   }
                }
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
                    pointFormatter: function() {
                        if(this.y > 0) { 
                         return this.x + " Rating, +" + this.y + " Score to Par";
                        } else if(this.y == 0) {
                            return this.x + " Rating, E Score to Par";
                        } 
                        else {
                         return this.x + " Rating, " + this.y + " Score to Par";
                        }
                     },                     
                    pointFormat: '{point.x} '  + xAxisName + ', {point.y} ' + yAxisName
                }
            }
        },
        series: [{
            name: 'Data',
            color: 'rgba(33, 252, 9, .5)',
            data: scoreBySlopeRating
        }],
        credits: {
			enabled: false
		}
    });
}