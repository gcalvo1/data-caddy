function setDriving(parameters) {
    $.get( '/dashboard/roundsdata', parameters, function(data) {
        var totalFirs = 0,
            totalDrives = 0,
            totalDrivingDistance = 0,
            totalMiss = {
                right: 0,
                left: 0,
                short: 0,
                long: 0
            },
            numDrivesWithDistance = 0,
            firByDate = [];
        if(parameters.club === "All"){
            data.rounds.forEach(function(round){
                var roundFirData = [],
                    roundFirs = 0;
                roundFirData.push(round.date);
                round.holes.forEach(function(hole){
                    if(hole.par != 3) {
                        totalDrives++;
                        if(hole.teeShot.teeShotResult === "FIR"){
                            totalFirs++;
                            roundFirs++;
                        } else if(hole.teeShot.teeShotDirection === "Right") {
                            totalMiss.right++;
                        } else if(hole.teeShot.teeShotDirection === "Left") {
                            totalMiss.left++;
                        } else if(hole.teeShot.teeShotDirection === "Long") {
                            totalMiss.long++;
                        } else if(hole.teeShot.teeShotDirection === "Short") {
                            totalMiss.short++;
                        }
                        if(hole.teeShot.teeShotLength){
                            numDrivesWithDistance++;
                            totalDrivingDistance += hole.teeShot.teeShotLength;
                        }
                    }
                });
                roundFirData.push(roundFirs);
                firByDate.push(roundFirData);
            });
        } else {
            data.rounds.forEach(function(round){
                var roundFirData = [],
                    roundFirs = 0;
                roundFirData.push(round.date);
                round.holes.forEach(function(hole){
                    if(hole.par != 3 && hole.teeShot.teeShotClub === parameters.club) {
                        totalDrives++;
                        if(hole.teeShot.teeShotResult === "FIR"){
                            totalFirs++;
                            roundFirs++;
                        } else if(hole.teeShot.teeShotDirection === "Right") {
                            totalMiss.right++;
                        } else if(hole.teeShot.teeShotDirection === "Left") {
                            totalMiss.left++;
                        } else if(hole.teeShot.teeShotDirection === "Long") {
                            totalMiss.long++;
                        } else if(hole.teeShot.teeShotDirection === "Short") {
                            totalMiss.short++;
                        }
                        if(hole.teeShot.teeShotLength){
                            numDrivesWithDistance++;
                            totalDrivingDistance += hole.teeShot.teeShotLength;
                        }
                    }
                });
                roundFirData.push(roundFirs);
                firByDate.push(roundFirData);
            });
        }
        //Set data for selected tee club
        var firPercent = ( totalFirs / totalDrives ) * 100,
            avgDrivingDistance = totalDrivingDistance / numDrivesWithDistance,
            driveMissPercent = {
                right: ( totalMiss.right / totalDrives ) * 100,
                left: ( totalMiss.left / totalDrives ) * 100,
                long: ( totalMiss.long / totalDrives ) * 100,
                short: ( totalMiss.short / totalDrives ) * 100
            };
        if(totalDrives === 0){
            $("#driving-distance").html("N/A");
            $("#fir-percent").html("N/A");
            $("#tee-miss-right").html("N/A");
            $("#tee-miss-left").html("N/A");
            $("#tee-miss-long").html("N/A");
            $("#tee-miss-short").html("N/A");
            $("#fir-ratio").html("");
            $("#tee-miss-right-ratio").html("");
            $("#tee-miss-left-ratio").html("");
            $("#tee-miss-long-ratio").html("");
            $("#tee-miss-short-ratio").html("");
        } else {
            if (numDrivesWithDistance === 0){
                $("#driving-distance").html("N/A");
            } else {
                $("#driving-distance").html(Math.round(avgDrivingDistance * 10) / 10 + " yds");
            }
            $("#fir-percent").html(Math.round(firPercent * 10) / 10 + "%");
            $("#tee-miss-right").html(Math.round(driveMissPercent.right * 10) / 10 + "%");
            $("#tee-miss-left").html(Math.round(driveMissPercent.left * 10) / 10 + "%");
            $("#tee-miss-long").html(Math.round(driveMissPercent.long * 10) / 10 + "%");
            $("#tee-miss-short").html(Math.round(driveMissPercent.short * 10) / 10 + "%");
            $("#fir-ratio").html(totalFirs + "/" + totalDrives);
            $("#tee-miss-right-ratio").html(totalMiss.right + "/" + totalDrives);
            $("#tee-miss-left-ratio").html(totalMiss.left + "/" + totalDrives);
            $("#tee-miss-long-ratio").html(totalMiss.long + "/" + totalDrives);
            $("#tee-miss-short-ratio").html(totalMiss.short + "/" + totalDrives);
        }
        
        //Line Chart
        highChartsFirByRound(firByDate);
    });
}