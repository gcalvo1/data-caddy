function highChartsScoreByName(scoreNames){   
    Highcharts.chart('score-name-pie', {
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            height: 300,
            type: 'pie'
        },
        title: {
            text: "Scoring Breakdown"
        },
        tooltip: {
            pointFormat: '{series.name}: <b>{point.y}</b>'
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                    style: {
                        color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                    }
                }
            }
        },
        credits: {
    			enabled: false
    	},
        series: [{
            name: 'Scores',
            colorByPoint: true,
            data: scoreNames
        }]
    });
}