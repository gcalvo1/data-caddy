function highChartsScoreByAR(traps){
    var colors = Highcharts.getOptions().colors,
        categories = [], //["fescue", "fringe", "gir", "rough"],
        data = [],
        counter = 0;
        traps.forEach(function(trap){
            var dataObjCategories = [],
                dataObjData = [];
            if(trap.found){
                categories.push(trap.name);
            }
            trap.score.forEach(function(score){
                if(score.total > 0){
                    dataObjCategories.push(score.name);
                    dataObjData.push(score.total);
                }
            });
            if(trap.found){
                var dataObj = {
                    y: trap.timesInTrap,
                    color: colors[counter],
                    drilldown: {
                        name: trap.name,
                        categories: dataObjCategories,
                        data: dataObjData,
                        color: colors[counter]
                    }
                }
                data.push(dataObj);
            }
            counter++;
        });
        var browserData = [],
            versionsData = [],
            i,
            j,
            dataLen = data.length,
            drillDataLen,
            brightness;
    
    
    // Build the data arrays
    for (i = 0; i < dataLen; i += 1) {
    
        // add browser data
        browserData.push({
            name: categories[i],
            y: data[i].y,
            color: data[i].color
        });
        
    
        // add version data
        drillDataLen = data[i].drilldown.data.length;
        for (j = 0; j < drillDataLen; j += 1) {
            brightness = 0.2 - (j / drillDataLen) / 5;
            versionsData.push({
                name: data[i].drilldown.categories[j],
                y: data[i].drilldown.data[j],
                color: Highcharts.Color(data[i].color).brighten(brightness).get()
            });
        }
    }

    // Create the chart
    Highcharts.chart('ar-score-pie', {
        chart: {
            type: 'pie'
        },
        title: {
            text: 'Score by Approach Result'
        },
        yAxis: {
        },
        plotOptions: {
            pie: {
                shadow: false,
                center: ['50%', '50%']
            }
        },
        tooltip: {
            valueSuffix: null
        },
        series: [{
            name: 'Times in',
            data: browserData,
            size: '60%',
            dataLabels: {
                formatter: function () {
                    return this.y > 0 ? this.point.name.initCap() : null;
                },
                color: '#ffffff',
                distance: -30
            }
        }, {
            name: 'Times Scored',
            data: versionsData,
            size: '80%',
            innerSize: '60%',
            dataLabels: {
                formatter: function () {
                    // display only if larger than 1
                    return this.y > 0 ? '<b>' + this.point.name.initCap() + ':</b> ' +
                        this.y : null;
                }
            },
            id: 'versions'
        }],
        responsive: {
            rules: [{
                condition: {
                    maxWidth: 400
                },
                chartOptions: {
                    series: [{
                        id: 'versions',
                        dataLabels: {
                            enabled: false
                        }
                    }]
                }
            }]
        },
        credits: {
				enabled: false
		}
    });
}