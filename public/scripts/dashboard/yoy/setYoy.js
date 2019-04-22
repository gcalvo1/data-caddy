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
            prevYearTotalScore = 0;
        for(var i=0;i<numRoundsCompare;i++){
            currentYearRounds[i].holes.forEach(function(hole){
                currentYearTotalScore = currentYearTotalScore + hole.score;
                currentYearTotalScoreToPar = currentYearTotalScoreToPar + (hole.score - hole.par);
            });
            prevYearRounds[i].holes.forEach(function(hole){
                prevYearTotalScore = prevYearTotalScore + hole.score;
                prevYearTotalScoreToPar = prevYearTotalScoreToPar + (hole.score - hole.par);
            });
        }
        
        var currYearAvgScoreToPar = currentYearTotalScoreToPar / numRoundsCompare,
            prevYearAvgScoreToPar = prevYearTotalScoreToPar / numRoundsCompare,
            currYearAvgScore = currentYearTotalScore / numRoundsCompare,
            prevYearAvgScore = prevYearTotalScore / numRoundsCompare;
            
        $('#yoy-title').html("Year-Over-Year Data Through " + numRoundsCompare + " Rounds");
        $('#yoy-years').html("Current Year: " + currentYear + " | Previous Year: " + prevYear);
        
        $('#current-year-strokes-to-par').html(Math.round(currYearAvgScoreToPar * 10) / 10);
        $('#prev-year-strokes-to-par').html(Math.round(prevYearAvgScoreToPar * 10) / 10);
        $('#current-year-strokes-to-par-p').html(currentYear + " Strokes to Par");
        $('#prev-year-strokes-to-par-p').html(prevYear + " Strokes to Par");
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
    });
}