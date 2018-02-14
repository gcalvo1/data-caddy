function setSummary(){
    var numHoles = $("#num-holes-dropdown :selected").text(),
        isFull = true;
    if (numHoles === "9 Holes") {
        isFull = false;
    }
    var parameters = { isFull: isFull };
    //$('#tee-club-dropdown').trigger("change");
    //$('#approach-club-dropdown').trigger("change");
    $.get( '/dashboard/roundsdata', parameters, function(data) {
        //Set Tee Club Dropdown
        teeClubDropdownHtml = "<option value='all'>All</option>";
        data.allClubs.forEach(function(club){
            if(club.teeFound) {
                teeClubDropdownHtml += "<option value=" + club.clubName + ">" + club.clubName + "</option>";
             }     
        });
        $('#tee-club-dropdown').html(teeClubDropdownHtml);
        //Set Approach Club Dropdown
        approachClubDropdownHtml = "<option value='all'>All</option>";
        data.allClubs.forEach(function(club){
            if(club.approachFound) {
                approachClubDropdownHtml += "<option value=" + club.clubName + ">" + club.clubName + "</option>";
             }     
        });
        $('#approach-club-dropdown').html(approachClubDropdownHtml);
        
        //Set current dashboard data for reset filters
        if($('#driving-tab-li').hasClass('active')){
            setDrivingDashboard();
        }
        if($('#approach-tab-li').hasClass('active')){
            setApproachDashboard();
        }
        if($('#short-game-tab-li').hasClass('active')){
            setShortGameDashboard();
        }
        
        //Set Summary Data Cards
        $('#scoring-avg').html(Math.round(data.avgScore.avgScore * 10) / 10);
        $('#avg-score-to-par').html(Math.round(data.avgScore.avgScoreToPar * 10) / 10);
        $('#par-three-scoring-avg').html(Math.round(data.avgScore.avgScoreByHolePar.parThree * 10) / 10);
        $('#par-four-scoring-avg').html(Math.round(data.avgScore.avgScoreByHolePar.parFour * 10) / 10);
        $('#par-five-scoring-avg').html(Math.round(data.avgScore.avgScoreByHolePar.parFive * 10) / 10);
        
        //Score By Date Line Chart 
        highChartsScoreByDate(data.avgScore.scoreByDate);
        
        //Score Name Pie Chart
        highChartsScoreByName(data.numScoreNames);
    });
}