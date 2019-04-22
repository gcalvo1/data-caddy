function setYoy(parameters) {
    $.get( '/dashboard/roundsdata', parameters, function(data) {
        var currentYear = parameters.dateTo.substring(0, 4);
        var prevYear = parameters.dateFrom.substring(0, 4);
        console.log(currentYear);
        console.log(prevYear);
        console.log(data);
        
        //Break out current year and previous year rounds
        var currentYearRounds = [],
            prevYearRounds = [];
        data.rounds.forEach(function(round){
           if (round.date.substring(0, 4) == currentYear){
               currentYearRounds.push(round);
           } else {
               prevYearRounds.push(round);
           }
        });
        
        var numRoundsCurrentYear = currentYearRounds.length,
            numRoundsPrevYear = prevYearRounds.length,
            numRoundsCompare = numRoundsCurrentYear;
            
        if (numRoundsPrevYear <= numRoundsCurrentYear){
            numRoundsCompare = numRoundsPrevYear;
        }
        
        var currentYearTotalScoreToPar = 0,
            prevYearTotalScoreToPar = 0,
            currentYearTotalScore = 0,
            prevYearTotalScore = 0,
            currentYearTotalFirs = 0,
            prevYearTotalFirs = 0,
            currentYearTotalDrives = 0,
            prevYearTotalDrives = 0,
            currentYearTotalHoles = 0,
            prevYearTotalHoles = 0,
            currentYearTotalGirs = 0,
            prevYearTotalGirs = 0;            ;
        for(var i=0;i<numRoundsCompare;i++){
            currentYearRounds[i].holes.forEach(function(hole){
                currentYearTotalScore = currentYearTotalScore + hole.score;
                currentYearTotalScoreToPar = currentYearTotalScoreToPar + (hole.score - hole.par);
                currentYearTotalHoles++;
                if(hole.par != 3) {
                    currentYearTotalDrives++;
                    if(hole.teeShot.teeShotResult === "FIR"){
                        currentYearTotalFirs++;
                    }
                }
                if(hole.approach.approachResult === "GIR"){
                    currentYearTotalGirs++;
                }
            });
            prevYearRounds[i].holes.forEach(function(hole){
                prevYearTotalScore = prevYearTotalScore + hole.score;
                prevYearTotalScoreToPar = prevYearTotalScoreToPar + (hole.score - hole.par);
                prevYearTotalHoles++;
                if(hole.par != 3) {
                    prevYearTotalDrives++;
                    if(hole.teeShot.teeShotResult === "FIR"){
                        prevYearTotalFirs++;
                    }
                }
                if(hole.approach.approachResult === "GIR"){
                    prevYearTotalGirs++;
                }
            });
        }
        
        var currYearAvgScoreToPar = currentYearTotalScoreToPar / numRoundsCompare,
            prevYearAvgScoreToPar = prevYearTotalScoreToPar / numRoundsCompare,
            currYearAvgScore = currentYearTotalScore / numRoundsCompare,
            prevYearAvgScore = prevYearTotalScore / numRoundsCompare,
            currYearfirPercent = ( currentYearTotalFirs / currentYearTotalDrives ) * 100,
            prevYearfirPercent = ( prevYearTotalFirs / prevYearTotalDrives ) * 100,
            currYearGirPercent = ( currentYearTotalGirs / currentYearTotalHoles ) * 100,
            prevYearGirPercent = ( prevYearTotalGirs / prevYearTotalHoles ) * 100;
        
        var currentSign = "+";
        if(currYearAvgScoreToPar === 0 || currYearAvgScoreToPar < 0) {
            currentSign = "";
        }
        
        var prevSign = "+";
        if(prevYearAvgScoreToPar === 0 || prevYearAvgScoreToPar < 0) {
            prevSign = "";
        }
            
        $('#yoy-title').html("Year-Over-Year Data Through " + numRoundsCompare + " Rounds");
        $('#yoy-years').html("Current Year: " + currentYear + " | Previous Year: " + prevYear);
        
        $('#current-year-strokes-to-par').html(currentSign + Math.round(currYearAvgScoreToPar * 10) / 10);
        $('#prev-year-strokes-to-par').html(prevSign + Math.round(prevYearAvgScoreToPar * 10) / 10);
        $('#current-year-strokes-to-par-p').html(currentYear + " Score to Par");
        $('#prev-year-strokes-to-par-p').html(prevYear + " Score to Par");
        $('#strokes-to-par-change').html(Math.abs(Math.round((((currYearAvgScoreToPar - prevYearAvgScoreToPar) / prevYearAvgScoreToPar) * 100) * 10) / 10) + "%");
        if( currYearAvgScoreToPar - prevYearAvgScoreToPar < 0 ) {
            $('#strokes-to-par-change').addClass('pos-change');
        } else if ( currYearAvgScoreToPar - prevYearAvgScoreToPar > 0 ) {
            $('#strokes-to-par-change').addClass('neg-change');
        }
        
        $('#current-year-score').html(Math.round(currYearAvgScore * 10) / 10);
        $('#prev-year-score').html(Math.round(prevYearAvgScore * 10) / 10);
        $('#current-year-score-p').html(currentYear + " Score");
        $('#prev-year-score-p').html(prevYear + " Score");
        $('#score-change').html(Math.abs(Math.round((((currYearAvgScore - prevYearAvgScore) / prevYearAvgScore) * 100) * 10) / 10) + "%");
        if( currYearAvgScore - prevYearAvgScore < 0 ) {
            $('#score-change').addClass('pos-change');
        } else if ( currYearAvgScore - prevYearAvgScore > 0 ) {
            $('#score-change').addClass('neg-change');
        }
        
        $("#current-year-fir-ratio").html(currentYearTotalFirs + "/" + currentYearTotalDrives);
        $("#prev-year-fir-ratio").html(prevYearTotalFirs + "/" + prevYearTotalDrives);
        $("#current-year-fir").html(Math.round(currYearfirPercent * 10) / 10 + "%");
        $("#prev-year-fir").html(Math.round(prevYearfirPercent * 10) / 10 + "%");
        $('#current-year-fir-p').html(currentYear + " FIR%");
        $('#prev-year-fir-p').html(prevYear + " FIR%");
        $('#fir-change').html(Math.abs(Math.round((((currYearfirPercent - prevYearfirPercent) / prevYearfirPercent) * 100) * 10) / 10) + "%");
        if( currYearfirPercent - prevYearfirPercent > 0 ) {
            $('#fir-change').addClass('pos-change');
        } else if ( currYearfirPercent - prevYearfirPercent < 0 ) {
            $('#fir-change').addClass('neg-change');
        }
        
        $("#current-year-gir-ratio").html(currentYearTotalGirs + "/" + currentYearTotalHoles);
        $("#prev-year-gir-ratio").html(prevYearTotalGirs + "/" + prevYearTotalHoles);
        $("#current-year-gir").html(Math.round(currYearGirPercent * 10) / 10 + "%");
        $("#prev-year-gir").html(Math.round(prevYearGirPercent * 10) / 10 + "%");
        $('#current-year-gir-p').html(currentYear + " GIR%");
        $('#prev-year-gir-p').html(prevYear + " GIR%");
        $('#gir-change').html(Math.abs(Math.round((((currYearGirPercent - prevYearGirPercent) / prevYearGirPercent) * 100) * 10) / 10) + "%");
        if( currYearGirPercent - prevYearGirPercent > 0 ) {
            $('#gir-change').addClass('pos-change');
        } else if ( currYearGirPercent - prevYearGirPercent < 0 ) {
            $('#gir-change').addClass('neg-change');
        }
    });
}