function highChartsYoyByRound(prevYearScoreByRound,currentYearScoreByRound,prevYear,currentYear,id,title,yTitle){
  
    //Create the chart
    Highcharts.chart(id, {
        chart: {
            height: 300,
            type: 'line'
        },
        title: {
            text: title
        },
        xAxis: {
            tickInterval: 1
        },
        yAxis: {
            title: {
                text: yTitle
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
            name: prevYear,
            data: prevYearScoreByRound
        },{
            name: currentYear,
            data: currentYearScoreByRound
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
                    legend: {
                        layout: 'horizontal',
                        align: 'center',
                        verticalAlign: 'bottom'
                    }
                }
            }]
        }
    });
}