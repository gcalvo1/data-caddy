function highChartsScoreByTeeClub(teeClubData){
        var barCategories = [];
        var scores = [];
        var series = [];
        teeClubData.forEach(function(club){
            barCategories.push(club.name);
            if(scores.length == 0){
                for(var score in club) {
                    if(score != "name"){
                        scores.push(score);
                    }
                }
            } else {
                for(var score in club) {
                    scoreFound = false;
                    scores.forEach(function(arrayScore){
                        if(score != "name"){
                            if(arrayScore == score){
                                scoreFound = true;
                            }
                        }
                    });
                    if(!scoreFound && score != "name"){
                        scores.push(score);
                    }
                }
            }
            
            
        });
        
        teeClubData.forEach(function(club){
            var found = false;
            if(series.length == 0){
                for(let i=0; i<scores.length; i++){
                    var found = false;
                    for(var score in club) {
                        if(score != "name"){
                            if(score == scores[i]){
                                series.push({
                                    name: scores[i],
                                    data: [club[score]]
                                });
                                found = true;
                            } 
                        }
                    }
                    if(!found){
                        series.push({
                            name: scores[i],
                            data: [0]
                        });
                    }
                }
            } else {
                for(let i=0; i<scores.length; i++){
                    var found = false;
                    for(var score in club) {
                        if(score != "name"){
                            if(score == scores[i]){
                                series[i].data.push(club[score]);
                                found = true;
                            } 
                        }
                    }
                    if(!found){
                        series[i].data.push(0);
                    }
                }
            }
        });
        Highcharts.chart('score-by-tee-club', {
            chart: {
                type: 'column',
                height: 435
            },
            title: {
                text: 'Score by Tee Club'
            },
            xAxis: {
                categories: barCategories
            },
            yAxis: {
                min: 0,
                title: {
                    text: 'Total'
                },
                stackLabels: {
                    enabled: true,
                    style: {
                        fontWeight: 'bold',
                        color: (Highcharts.theme && Highcharts.theme.textColor) || 'gray'
                    }
                }
            },
            legend: {
                align: 'right',
                x: -30,
                verticalAlign: 'top',
                y: 25,
                floating: true,
                backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || 'white',
                borderColor: '#CCC',
                borderWidth: 1,
                shadow: false
            },
            tooltip: {
                headerFormat: '<b>{point.x}</b><br/>',
                pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}'
            },
            plotOptions: {
                column: {
                    stacking: 'normal',
                    dataLabels: {
                        enabled: true,
                        color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white'
                    }
                }
            },
            series: series,
            credits: {
    				enabled: false
    		}
        });
    }