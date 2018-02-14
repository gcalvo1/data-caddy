function highChartsScoreByName(numScoreNames){    
    Highcharts.chart('score-name-pie', {
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            height: 300,
            type: 'pie'
        },
        title: {
            text: null
        },
        tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
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
            data: [{
                name: 'Par',
                y: numScoreNames.par
                //sliced: true,
                //selected: true
            }, {
                name: 'Birdie',
                y: numScoreNames.birdie
            }, {
                name: 'Bogey',
                y: numScoreNames.bogey
            }, {
                name: 'Eagle',
                y: numScoreNames.eagle
            }, {
                name: 'Double Bogey',
                y: numScoreNames.doubleBogey
            }, {
                name: 'Better Than Eagle',
                y: numScoreNames.eagleBetter
            }, {
                name: 'Worse Than Bogey',
                y: numScoreNames.bogeyWorse
            }]
        }]
    });
}