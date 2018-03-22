function updateTeeClubFilter(){
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
    
    var parameters = { isFull: isFull, dateFrom: dateFrom, dateTo:dateTo };
    var teeClubDropdownHtml = "<option value=All>All</option>";
    
    $.get( '/dashboard/roundsdata', parameters, function(data) {
        data.allClubs.forEach(function(club){
            if(club.teeFound) {
                teeClubDropdownHtml += "<option value=" + club.clubName + ">" + club.clubName + "</option>";
             }     
        });
        $('#tee-club-dropdown').html(teeClubDropdownHtml);
    });
}

function updateDriveTrackerFilter(club, callback){
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
        
    var parameters = { isFull: isFull, dateFrom: dateFrom, dateTo:dateTo };
    
    $.get( '/dashboard/roundsdata', parameters, function(data) {
        //set DriveTracker dropdown
        var roundDates = [];
        $('#drivetracker-rounds').children().remove();
        data.rounds.forEach(function(round){
            var roundDate = new Date(round.date);
            var clubFound = false;
            if(club === "All"){
                clubFound = true;
            }
            if(roundDates.length === 0){
                round.holes.forEach(function(hole){
                    if(hole.teeShot.teeShotClub === club){
                        clubFound = true;
                    }
                });
                if(clubFound){
                    roundDates.push({
                        date: roundDate.toISOString().split('T')[0],
                        datetime: round.date
                    });
                }
            } else {
                var found = false;
                roundDates.forEach(function(foundRoundDate) {
                    if(roundDate.toISOString().split('T')[0] === foundRoundDate.date){
                        found = true;
                    }
                });
                if(!found){
                    round.holes.forEach(function(hole){
                        if(hole.teeShot.teeShotClub === club){
                            clubFound = true;
                        }
                    });
                    if(clubFound){
                        roundDates.push({
                            date: roundDate.toISOString().split('T')[0],
                            datetime: round.date
                        });
                    }
                }
            }
        });
        function compare(a,b) {
          if (a.date < b.date)
            return 1;
          if (a.date > b.date)
            return -1;
          return 0;
        }
        if(roundDates.length > 1){
            roundDates.sort(compare);
        }
        roundDates.forEach(function(date){
            $('#drivetracker-rounds').append($('<option>', {
                value: date.datetime,
                text: date.date
            }));
        });
        callback();
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
        
    if (numHoles === "9 Holes") {
        isFull = false;
    }
    var parameters = { isFull: isFull, dateFrom: dateFrom, dateTo:dateTo };
    var approachClubDropdownHtml = "<option value=All>All</option>";
        
        
    
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

function updateDashboard(club, updateSource){
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

    if(activeTab === "driving"){
        if(!club){
            var club = $("#tee-club-dropdown :selected").text();
        }
        if(updateSource != "teeClub"){
            updateTeeClubFilter();
        }
        
        updateDriveTrackerFilter(club, function(){
            //DriveTracker Dates
            var driveTrackerDateFrom = new Date($("#drivetracker-rounds :selected").val());
            var driveTrackerDateTo = new Date($("#drivetracker-rounds :selected").val());
            driveTrackerDateFrom.setHours(0,0,0,0);
            driveTrackerDateTo.setHours(23,59,59,0);
            var dtDateFrom = driveTrackerDateFrom.toISOString();
            var dtDateTo = driveTrackerDateTo.toISOString();
            var parameters = { isFull: isFull, club: club, dateFrom: dateFrom, dateTo:dateTo, dtDateFrom: dtDateFrom, dtDateTo:dtDateTo};
            driveTracker(parameters, club);
        });
        
        var parameters = { isFull: isFull, club: club, dateFrom: dateFrom, dateTo:dateTo};
        setDriving(parameters);
    }
    if(activeTab === "approach"){
        if(!club){
            var club = $("#approach-club-dropdown :selected").text();
        }
        var parameters = { isFull: isFull, club: club, dateFrom: dateFrom, dateTo:dateTo };
        if(updateSource != "approachClub"){
            updateApproachClubFilter();
        }
        setApproach(parameters);
    }
    if(activeTab === "short-game"){
        var parameters = { isFull: isFull, dateFrom: dateFrom, dateTo:dateTo };
        setShortGame(parameters);
    }
    if(activeTab === "weather"){
        var parameters = { isFull: isFull, dateFrom: dateFrom, dateTo:dateTo };
        setWeather(parameters);
    }
    if(activeTab === "map"){
        var parameters = { isFull: isFull, dateFrom: dateFrom, dateTo:dateTo };
        setMap(parameters);
    }
}