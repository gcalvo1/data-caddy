function setSummary(parameters){
    // var numHoles = $("#num-holes-dropdown :selected").text(),
    //     isFull = true;
    // if (numHoles === "9 Holes") {
    //     isFull = false;
    // }
    // var parameters = { isFull: isFull };
    //$('#tee-club-dropdown').trigger("change");
    //$('#approach-club-dropdown').trigger("change");
    $.get( '/dashboard/roundsdata', parameters, function(data) {
        
        //Set Summary Data Cards
        $('#scoring-avg').html(Math.round(data.avgScore.avgScore * 10) / 10);
        $('#scoring-avg').attr("data-to",Math.round(data.avgScore.avgScore * 10) / 10);
        var sign = "+";
        if(data.avgScore.avgScoreToPar === 0) {
            sign = "";
        } else if(data.avgScore.avgScoreToPar < 0) {
            sign = "-";
        }
        $('#avg-score-to-par').html(sign + String(Math.round(data.avgScore.avgScoreToPar * 10) / 10));
        $('#avg-score-to-par').attr("data-to",Math.round(data.avgScore.avgScoreToPar * 10) / 10);
        $('#par-three-scoring-avg').html(Math.round(data.avgScore.avgScoreByHolePar.parThree * 10) / 10);
        $('#par-three-scoring-avg').attr("data-to",Math.round(data.avgScore.avgScoreByHolePar.parThree * 10) / 10);
        $('#par-four-scoring-avg').html(Math.round(data.avgScore.avgScoreByHolePar.parFour * 10) / 10);
        $('#par-four-scoring-avg').attr("data-to",Math.round(data.avgScore.avgScoreByHolePar.parFour * 10) / 10);
        $('#par-five-scoring-avg').html(Math.round(data.avgScore.avgScoreByHolePar.parFive * 10) / 10);
        $('#par-five-scoring-avg').attr("data-to",Math.round(data.avgScore.avgScoreByHolePar.parFive * 10) / 10);
        //Score By Date Line Chart 
        highChartsScoreByDate(data.avgScore.scoreByDate);
        
        //Score Name Pie Chart
        highChartsScoreByName(data.scoreNames);
        //numCounterUpdate();
    });
}