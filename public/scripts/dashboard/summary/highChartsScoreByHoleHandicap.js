function highChartsScoreByHoleHandicap(scoreByHandicap){

    var avgScoreToPar = [],
        columnCategories = [],
        count = 1;    
    scoreByHandicap.forEach(function(handicap){
        if(handicap.timesPlayed > 0){
            columnCategories.push(count);
            avgScoreToPar.push(Math.round((handicap.totalScoreToPar / handicap.timesPlayed) * 100 ) / 100)
        }        
        count++;
    });

    Highcharts.chart('score-by-handicap', {
        chart: {
            type: 'column'
        },
        title: {
            text: 'Avg Score to Par by Hole Handicap'
        },
        xAxis: {
            categories: columnCategories,
            title: {
                text: null
            }
        },
        yAxis: {
            title: {
                text: 'Avg Score to Par'
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
        plotOptions: {
            bar: {
                dataLabels: {
                    enabled: false
                }
            }
        },
        credits: {
            enabled: false
        },
        tooltip: {
            formatter: function() {
                if(this.y > 0) { 
                 return "+"+this.y;
                } else {
                 return this.y;
                }
             }
        },
        series: [{
            name: 'Avg Score to Par',
            data: avgScoreToPar
        }]
    });
}