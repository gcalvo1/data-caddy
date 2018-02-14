function highChartsScramblingByTrap(traps){
    var barCategories = [],
        trapScramblePerc = [];
    traps.forEach(function(trap){
        var timesInTrap = trap.timesInTrap;
        if(trap.found && trap.name != "gir"){
            barCategories.push(trap.name.initCap());
            trap.score.forEach(function(score){
                if(score.name === "par"){
                    trapScramblePerc.push( Math.round((score.total / timesInTrap) * 100 ));
                }
            });
        }
    });
    Highcharts.chart('scrambling-by-trap', {
        chart: {
            type: 'bar'
        },
        title: {
            text: 'Scrambling by Trap'
        },
        xAxis: {
            categories: barCategories,
            title: {
                text: null
            }
        },
        yAxis: {
            min: 0,
            max: 100,
            title: {
                text: 'Scramble %',
                align: 'high'
            },
            labels: {
                overflow: 'justify',
                formatter: function() {
                   return this.value+"%";
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
        series: [{
            name: 'Scramble %',
            data: trapScramblePerc
        }]
    });
}