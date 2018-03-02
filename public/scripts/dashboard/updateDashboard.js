function updateTeeClubFilter(){
    var numHoles = $("#num-holes-dropdown :selected").text(),
        isFull = true,
        dateFrom = $('#date-from').datepicker('getDate'),
        dateTo = $('#date-to').datepicker('getDate');
        dateFrom.setHours(0,0,0,0);
        dateTo.setHours(23,59,59,0);
        dateFrom = dateFrom.toISOString();
        dateTo = dateTo.toISOString();
        parameters = { isFull: isFull, dateFrom: dateFrom, dateTo:dateTo };
        teeClubDropdownHtml = "<option value=All>All</option>"
    
    $.get( '/dashboard/roundsdata', parameters, function(data) {
        data.allClubs.forEach(function(club){
            if(club.teeFound) {
                teeClubDropdownHtml += "<option value=" + club.clubName + ">" + club.clubName + "</option>";
             }     
        });
        $('#tee-club-dropdown').html(teeClubDropdownHtml);
    });
}

function updateApproachClubFilter(){
    var numHoles = $("#num-holes-dropdown :selected").text(),
        isFull = true,
        dateFrom = $('#date-from').datepicker('getDate'),
        dateTo = $('#date-to').datepicker('getDate');
        dateFrom.setHours(0,0,0,0);
        dateTo.setHours(23,59,59,0);
        dateFrom = dateFrom.toISOString();
        dateTo = dateTo.toISOString();
        parameters = { isFull: isFull, dateFrom: dateFrom, dateTo:dateTo };
        approachClubDropdownHtml = "<option value=All>All</option>"
    
    $.get( '/dashboard/roundsdata', parameters, function(data) {
        //Set Approach Club Dropdown
        data.allClubs.forEach(function(club){
            if(club.approachFound) {
                approachClubDropdownHtml += "<option value=" + club.clubName + ">" + club.clubName + "</option>";
             }     
        });
        $('#approach-club-dropdown').html(approachClubDropdownHtml);
    });
}

function updateDashboard(club){
    var numHoles = $("#num-holes-dropdown :selected").text(),
        isFull = true,
        dateFrom = $('#date-from').datepicker('getDate'),
        dateTo = $('#date-to').datepicker('getDate');
        dateFrom.setHours(0,0,0,0);
        dateTo.setHours(23,59,59,0);
        dateFrom = dateFrom.toISOString();
        dateTo = dateTo.toISOString();
    
    if (numHoles === "9 Holes") {
        isFull = false;
    }
    //set parameters for each dashboard tab    
    if(activeTab === "summary"){
        var parameters = { isFull: isFull, dateFrom: dateFrom, dateTo:dateTo };
        setSummary(parameters);
    }
    //if($('#driving-tab-li').hasClass('active')){
    if(activeTab === "driving"){
        if(!club){
            var club = $("#tee-club-dropdown :selected").text();
        }
        var parameters = { isFull: isFull, club: club, dateFrom: dateFrom, dateTo:dateTo };
        driveTracker(parameters, club);
        setDriving(parameters);
    }
    if(activeTab === "approach"){
        if(!club){
            var club = $("#approach-club-dropdown :selected").text();
        }
        var parameters = { isFull: isFull, club: club, dateFrom: dateFrom, dateTo:dateTo };
        setApproach(parameters);
    }
    if(activeTab === "shortgame"){
        var parameters = { isFull: isFull, dateFrom: dateFrom, dateTo:dateTo };
        setShortGame(parameters);
    }
    if(activeTab === "weather"){
        var parameters = { isFull: isFull, dateFrom: dateFrom, dateTo:dateTo };
        setWeather(parameters);
    }
}