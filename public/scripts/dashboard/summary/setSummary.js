function setSummary(parameters){
    $.get( '/dashboard/roundsdata', parameters, function(data) {
        
        //Set Summary Data Cards
        var sign = "+";
        if(data.avgScore.avgScoreToPar === 0) {
            sign = "";
        } else if(data.avgScore.avgScoreToPar < 0) {
            sign = "-";
        }
        
        if(data.rounds.length === 0){
            $('#no-round-data').removeClass("hidden");
            $('#no-round-data').addClass("no-round-data");
            
            $('#scoring-avg').html("N/A");
            $('#avg-score-to-par').html("N/A");
            $('#par-three-scoring-avg').html("N/A");
            $('#par-four-scoring-avg').html("N/A");
            $('#par-five-scoring-avg').html("N/A");
        } else {
            $('#scoring-avg').html(Math.round(data.avgScore.avgScore * 10) / 10);
            $('#scoring-avg').attr("data-to",Math.round(data.avgScore.avgScore * 10) / 10);
            $('#avg-score-to-par').html(sign + String(Math.round(data.avgScore.avgScoreToPar * 10) / 10));
            $('#avg-score-to-par').attr("data-to",Math.round(data.avgScore.avgScoreToPar * 10) / 10);
            $('#par-three-scoring-avg').html(Math.round(data.avgScore.avgScoreByHolePar.parThree * 10) / 10);
            $('#par-three-scoring-avg').attr("data-to",Math.round(data.avgScore.avgScoreByHolePar.parThree * 10) / 10);
            $('#par-four-scoring-avg').html(Math.round(data.avgScore.avgScoreByHolePar.parFour * 10) / 10);
            $('#par-four-scoring-avg').attr("data-to",Math.round(data.avgScore.avgScoreByHolePar.parFour * 10) / 10);
            $('#par-five-scoring-avg').html(Math.round(data.avgScore.avgScoreByHolePar.parFive * 10) / 10);
            $('#par-five-scoring-avg').attr("data-to",Math.round(data.avgScore.avgScoreByHolePar.parFive * 10) / 10);
        }
        //Score By Date Line Chart 
        highChartsScoreByDate(data.avgScore.scoreByDate);
        
        //Score Name Pie Chart
        highChartsScoreByName(data.scoreNames);
        //numCounterUpdate();
    });
}