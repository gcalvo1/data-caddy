function setApproach(parameters) {
    $.get( '/dashboard/roundsdata', parameters, function(data) {
        
        var totalGirs = 0,
            totalApproaches = 0,
            totalApproachDistance = 0,
            totalHoles = 0,
            totalMiss = {
                right: 0,
                left: 0,
                short: 0,
                long: 0,
                gir: 0,
            },
            totalMissHazzard = {
                rough: 0,
                bunker: 0,
                fescue: 0,
                water: 0,
                woods: 0,
                fairway: 0,
                fringe: 0,
                gir: 0
            },
            girByDate = [],
            approachSpreadByDate = []
        if(parameters.club === "All"){
            data.rounds.forEach(function(round){
                var roundGirData = [],
                    approachSpreadData = [],
                    roundGirs = 0,
                    roundMiss = {
                        right: 0,
                        left: 0,
                        short: 0,
                        long: 0,
                        gir: 0,
                    };
                roundGirData.push(round.date);
                approachSpreadData.push(round.date);
                round.holes.forEach(function(hole){
                    totalHoles++;
                    if(hole.approach.approachToGreen){
                        totalApproaches++;
                        totalApproachDistance += hole.approach.approachLength;
                        //Set directional miss
                        if(hole.approach.approachResult === "GIR"){
                            totalGirs++;
                            roundGirs++;
                            totalMiss.gir++;
                            roundMiss.gir++;
                        } else if(hole.approach.approachDirection === "Right") {
                            totalMiss.right++;
                            roundMiss.right++;
                        } else if(hole.approach.approachDirection === "Left") {
                            totalMiss.left++;
                            roundMiss.left++;
                        } else if(hole.approach.approachDirection === "Long") {
                            totalMiss.long++;
                            roundMiss.long++;
                        } else if(hole.approach.approachDirection === "Short") {
                            totalMiss.short++;
                            roundMiss.short++;
                        }
                        //Set hazard miss
                        totalMissHazzard[hole.approach.approachResult.toLowerCase()]++;
                    }
                });
                roundGirData.push(roundGirs);
                girByDate.push(roundGirData);
                approachSpreadData.push(roundMiss);
                approachSpreadByDate.push(approachSpreadData);
            });
        } else {
            data.rounds.forEach(function(round){
                var roundGirData = [],
                    approachSpreadData = [],
                    roundGirs = 0,
                    roundMiss = {
                        right: 0,
                        left: 0,
                        short: 0,
                        long: 0,
                        gir: 0,
                    };
                roundGirData.push(round.date);
                approachSpreadData.push(round.date);
                round.holes.forEach(function(hole){
                    if(hole.approach.approachClub === parameters.club){
                        totalHoles++;
                        if(hole.approach.approachToGreen){
                            totalApproaches++;
                            totalApproachDistance += hole.approach.approachLength;
                            if(hole.approach.approachResult === "GIR"){
                                totalGirs++;
                                roundGirs++;
                                totalMiss.gir++;
                                roundMiss.gir++;
                            } else if(hole.approach.approachDirection === "Right") {
                                totalMiss.right++;
                                roundMiss.right++;
                            } else if(hole.approach.approachDirection === "Left") {
                                totalMiss.left++;
                                roundMiss.left++;
                            } else if(hole.approach.approachDirection === "Long") {
                                totalMiss.long++;
                                roundMiss.long++;
                            } else if(hole.approach.approachDirection === "Short") {
                                totalMiss.short++;
                                roundMiss.short++;
                            }
                            //Set hazard miss
                            totalMissHazzard[hole.approach.approachResult.toLowerCase()]++;
                        }
                    }
                });
                roundGirData.push(roundGirs);
                girByDate.push(roundGirData);
                approachSpreadData.push(roundMiss);
                approachSpreadByDate.push(approachSpreadData);
            });
        }
        //Set data for selected tee club
        var girPercent = ( totalGirs / totalHoles ) * 100,
            avgApproachDistance = totalApproachDistance / totalApproaches,
            approachMissPercent = {
                right: ( totalMiss.right / totalApproaches ) * 100,
                left: ( totalMiss.left / totalApproaches ) * 100,
                long: ( totalMiss.long / totalApproaches ) * 100,
                short: ( totalMiss.short / totalApproaches ) * 100
            };
        //Protect against divide by zero
        if(totalHoles === 0){
            $("#gir-percent").html("N/A");
            $("#gir-ratio").html("");
        } else {
            $("#gir-percent").html(Math.round(girPercent * 10) / 10 + "%");
            $("#gir-ratio").html(totalGirs + "/" + totalHoles);
        }
        if(totalApproaches === 0){
            $("#approach-miss-right").html("N/A");
            $("#approach-miss-left").html("N/A");
            $("#approach-miss-long").html("N/A");
            $("#approach-miss-short").html("N/A");
            $("#approach-miss-right-ratio").html("");
            $("#approach-miss-left-ratio").html("");
            $("#approach-miss-long-ratio").html("");
            $("#approach-miss-short-ratio").html("");
        } else {
            $("#approach-miss-right").html(Math.round(approachMissPercent.right * 10) / 10 + "%");
            $("#approach-miss-left").html(Math.round(approachMissPercent.left * 10) / 10 + "%");
            $("#approach-miss-long").html(Math.round(approachMissPercent.long * 10) / 10 + "%");
            $("#approach-miss-short").html(Math.round(approachMissPercent.short * 10) / 10 + "%");
            $("#approach-miss-right-ratio").html(totalMiss.right + "/" + totalApproaches);
            $("#approach-miss-left-ratio").html(totalMiss.left + "/" + totalApproaches);
            $("#approach-miss-long-ratio").html(totalMiss.long + "/" + totalApproaches);
            $("#approach-miss-short-ratio").html(totalMiss.short + "/" + totalApproaches);
        }
        $("#approach-distance").html(Math.round(avgApproachDistance * 10) / 10 + " yds");
        $("#approach-miss-rough").html(Math.round(totalMissHazzard.rough * 10) / 10);
        $("#approach-miss-bunker").html(Math.round(totalMissHazzard.bunker * 10) / 10);
        $("#approach-miss-woods").html(Math.round(totalMissHazzard.woods * 10) / 10);
        $("#approach-miss-fescue").html(Math.round(totalMissHazzard.fescue * 10) / 10);
        $("#approach-miss-water").html(Math.round(totalMissHazzard.water * 10) / 10);
        $("#approach-miss-fringe").html(Math.round(totalMissHazzard.fringe * 10) / 10);
        
        //Area Chart
        highChartsApproachSpread(approachSpreadByDate);
    });
}