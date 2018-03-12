function setWeather(parameters) {
    $.get( '/dashboard/roundsdata', parameters, function(data) {
        $('.card').addClass('hidden');
        data.weatherIcons.forEach(function(icon){
            $('#'+icon.icon).removeClass('hidden');
            var sign = "+";
            if(icon.scoreToPar == 0){
                sign = "";
            } else if(icon.scoreToPar < 0) {
                sign = "-"
            }
            $('#'+icon.icon+ ' .card-temp').html(sign + String(Math.round((icon.scoreToPar / icon.rounds) * 10) / 10));
        });
        var windHtml = "",
            numWindCategories = data.windSpeed.length,
            colLen = Math.floor(12 / numWindCategories);
        function compare(a,b) {
          if (a.category < b.category)
            return -1;
          if (a.category > b.category)
            return 1;
          return 0;
        }
        data.windSpeed.sort(compare);
        data.windSpeed.forEach(function(category){
            var sign = "+";
            if(category.scoreToPar == 0){
                sign = "";
            } else if(category.scoreToPar < 0) {
                sign = "-"
            }
            var scoreToParAvg = sign + String(Math.round((category.scoreToPar / category.rounds) * 10) / 10);
            var firPercent = String(Math.round(((category.roundFirs / category.roundTeeShots) * 100 ) * 10) / 10) + "%";
            var girPercent = String(Math.round(((category.roundGirs / category.roundApproaches) * 100 ) * 10) / 10) + "%";
            windHtml += '<div class="col-md-'+colLen+'"><div class="counter"><div class="row"><div><div class="col-md-4 no-col-pad"><h2 class="timer count-title count-number" data-to="" data-speed="1500">'+scoreToParAvg+'</h2><p class="count-text ">Score to Par</p></div><div class="col-md-4 no-col-pad"><h2 class="timer count-title count-number" data-to="" data-speed="1500">'+firPercent+'</h2><p class="count-text">FIR %</p></div><div class="col-md-4 no-col-pad"><h2 class="timer count-title count-number" data-to="" data-speed="1500">'+girPercent+'</h2><p class="count-text ">GIR %</p></div></div></div><div class="row"><p class="count-text wind-category-label">'+category.category+' Wind</p></div></div></div></div>';
        });
        $('#wind-div').html(windHtml);
        if(numWindCategories === 4) {
            $('#wind-div h2').addClass('med-weather-numbers');
        } else if(numWindCategories >= 5) {
            $('#wind-div h2').addClass('small-weather-numbers');
        }
        //Temperature
        var tempHtml = "",
            numTempCategories = data.temperature.length,
            colLen = Math.floor(12 / numTempCategories);
        function compare(a,b) {
          if (a.category < b.category)
            return -1;
          if (a.category > b.category)
            return 1;
          return 0;
        }
        data.temperature.sort(compare);
        data.temperature.forEach(function(category){
            var sign = "+";
            if(category.scoreToPar == 0){
                sign = "";
            } else if(category.scoreToPar < 0) {
                sign = "-"
            }
            var scoreToParAvg = sign + String(Math.round((category.scoreToPar / category.rounds) * 10) / 10);
            var firPercent = String(Math.round(((category.roundFirs / category.roundTeeShots) * 100 ) * 10) / 10) + "%";
            var girPercent = String(Math.round(((category.roundGirs / category.roundApproaches) * 100 ) * 10) / 10) + "%";
            tempHtml += '<div class="col-md-'+colLen+'"><div class="counter"><div class="row"><div><div class="col-md-4 no-col-pad"><h2 class="timer count-title count-number" data-to="" data-speed="1500">'+scoreToParAvg+'</h2><p class="count-text ">Score to Par</p></div><div class="col-md-4 no-col-pad"><h2 class="timer count-title count-number" data-to="" data-speed="1500">'+firPercent+'</h2><p class="count-text">FIR %</p></div><div class="col-md-4 no-col-pad"><h2 class="timer count-title count-number" data-to="" data-speed="1500">'+girPercent+'</h2><p class="count-text ">GIR %</p></div></div></div><div class="row"><p class="count-text wind-category-label">'+category.category+'</p></div></div></div></div>';
        });
        $('#temp-div').html(tempHtml);
        if(numWindCategories === 4) {
            $('#temp-div h2').addClass('med-weather-numbers');
        } else if(numWindCategories >= 5) {
            $('#temp-div h2').addClass('small-weather-numbers');
        }
    });
};