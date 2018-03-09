function setShortGame(parameters) {
    // var numHoles = $("#num-holes-dropdown :selected").text(),
    //     isFull = true;
    // if (numHoles === "9 Holes") {
    //     isFull = false;
    // }
    // var parameters = { isFull: isFull };
    $.get( '/dashboard/roundsdata', parameters, function(data) {
        var totalScrambleAttempts = 0,
            totalScrambles = 0,
            totalSandSaveAttempts = 0,
            totalSandSaves = 0,
            totalPutts = 0,
            totalThreePutts = 0,
            totalRounds = 0,
            traps = [ 
                {
                    name: "bunker",
                    found: false,
                    timesInTrap: 0,
                    score: [
                        {
                            name: "eagleBetter",
                            total: 0
                        },
                        {
                            name: "eagle",
                            total: 0
                        },
                        {
                            name: "birdie",
                            total: 0
                        },
                        {
                            name: "par",
                            total: 0
                        },
                        {
                            name: "bogey",
                            total: 0
                        },
                        {
                            name: "doubleBogey",
                            total: 0
                        },
                        {
                            name: "bogeyWorse",
                            total: 0
                        }
                    ]
                },
                {
                    name: "fairway",
                    found: false,
                    timesInTrap: 0,
                    score: [
                        {
                            name: "eagleBetter",
                            total: 0
                        },
                        {
                            name: "eagle",
                            total: 0
                        },
                        {
                            name: "birdie",
                            total: 0
                        },
                        {
                            name: "par",
                            total: 0
                        },
                        {
                            name: "bogey",
                            total: 0
                        },
                        {
                            name: "doubleBogey",
                            total: 0
                        },
                        {
                            name: "bogeyWorse",
                            total: 0
                        }
                    ]
                },
                {
                    name: "fescue",
                    found: false,
                    timesInTrap: 0,
                    score: [
                        {
                            name: "eagleBetter",
                            total: 0
                        },
                        {
                            name: "eagle",
                            total: 0
                        },
                        {
                            name: "birdie",
                            total: 0
                        },
                        {
                            name: "par",
                            total: 0
                        },
                        {
                            name: "bogey",
                            total: 0
                        },
                        {
                            name: "doubleBogey",
                            total: 0
                        },
                        {
                            name: "bogeyWorse",
                            total: 0
                        }
                    ]
                },
                {
                    name: "fringe",
                    found: false,
                    timesInTrap: 0,
                    score: [
                        {
                            name: "eagleBetter",
                            total: 0
                        },
                        {
                            name: "eagle",
                            total: 0
                        },
                        {
                            name: "birdie",
                            total: 0
                        },
                        {
                            name: "par",
                            total: 0
                        },
                        {
                            name: "bogey",
                            total: 0
                        },
                        {
                            name: "doubleBogey",
                            total: 0
                        },
                        {
                            name: "bogeyWorse",
                            total: 0
                        }
                    ]
                },
                {
                    name: "gir",
                    found: false,
                    timesInTrap: 0,
                    score: [
                        {
                            name: "eagleBetter",
                            total: 0
                        },
                        {
                            name: "eagle",
                            total: 0
                        },
                        {
                            name: "birdie",
                            total: 0
                        },
                        {
                            name: "par",
                            total: 0
                        },
                        {
                            name: "bogey",
                            total: 0
                        },
                        {
                            name: "doubleBogey",
                            total: 0
                        },
                        {
                            name: "bogeyWorse",
                            total: 0
                        }
                    ]
                },
                {
                    name: "rough",
                    found: false,
                    timesInTrap: 0,
                    score: [
                        {
                            name: "eagleBetter",
                            total: 0
                        },
                        {
                            name: "eagle",
                            total: 0
                        },
                        {
                            name: "birdie",
                            total: 0
                        },
                        {
                            name: "par",
                            total: 0
                        },
                        {
                            name: "bogey",
                            total: 0
                        },
                        {
                            name: "doubleBogey",
                            total: 0
                        },
                        {
                            name: "bogeyWorse",
                            total: 0
                        }
                    ]
                },
                {
                    name: "water",
                    found: false,
                    timesInTrap: 0,
                    score: [
                        {
                            name: "eagleBetter",
                            total: 0
                        },
                        {
                            name: "eagle",
                            total: 0
                        },
                        {
                            name: "birdie",
                            total: 0
                        },
                        {
                            name: "par",
                            total: 0
                        },
                        {
                            name: "bogey",
                            total: 0
                        },
                        {
                            name: "doubleBogey",
                            total: 0
                        },
                        {
                            name: "bogeyWorse",
                            total: 0
                        }
                    ]
                },
                {
                    name: "woods",
                    found: false,
                    timesInTrap: 0,
                    score: [
                        {
                            name: "eagleBetter",
                            total: 0
                        },
                        {
                            name: "eagle",
                            total: 0
                        },
                        {
                            name: "birdie",
                            total: 0
                        },
                        {
                            name: "par",
                            total: 0
                        },
                        {
                            name: "bogey",
                            total: 0
                        },
                        {
                            name: "doubleBogey",
                            total: 0
                        },
                        {
                            name: "bogeyWorse",
                            total: 0
                        }
                    ]
                }
            ],
            foundTraps = [];
        data.rounds.forEach(function(round){
            totalRounds++;
            round.holes.forEach(function(hole){
                traps.forEach(function(trap){
                    if(trap.name === hole.approach.approachResult.toLowerCase()){
                        trap.found = true;
                        trap.timesInTrap++;
                        //Set Score Names
                        if(hole.score - hole.par === 0){
                            trap.score.forEach(function(score){
                                if(score.name === "par"){
                                    score.total++;
                                }
                            });
                        } else if(hole.score - hole.par === 1){
                            trap.score.forEach(function(score){
                                if(score.name === "bogey"){
                                    score.total++;
                                }
                            });
                        } else if(hole.score - hole.par === -1){
                            trap.score.forEach(function(score){
                                if(score.name === "birdie"){
                                    score.total++;
                                }
                            });
                        } else if(hole.score - hole.par === 2){
                            trap.score.forEach(function(score){
                                if(score.name === "doubleBogey"){
                                    score.total++;
                                }
                            });
                        } else if(hole.score - hole.par === -2){
                            trap.score.forEach(function(score){
                                if(score.name === "eagle"){
                                    score.total++;
                                }
                            });
                        } else if(hole.score - hole.par > 2){
                            trap.score.forEach(function(score){
                                if(score.name === "bogeyWorse"){
                                    score.total++;
                                }
                            });
                        } else if(hole.score - hole.par < -2){
                            trap.score.forEach(function(score){
                                if(score.name === "eagleBetter"){
                                    score.total++;
                                }
                            });
                        }
                    }
                });
                totalPutts += hole.putts;
                if(hole.putts >= 3){
                    totalThreePutts++;
                }
                if(!hole.approach.approachResult || hole.approach.approachResult != "GIR"){
                    totalScrambleAttempts++;
                    if(hole.score === hole.par){
                        totalScrambles++;
                    }
                }
                if(hole.approach.approachResult === "Bunker"){
                    totalSandSaveAttempts++;
                    if(hole.score === hole.par){
                        totalSandSaves++;
                    }
                }
            });
        });
        var scramblePercent = ( totalScrambles / totalScrambleAttempts ) * 100,
            sandSavePercent = ( totalSandSaves / totalSandSaveAttempts ) * 100,
            puttsPerRound = (totalPutts / totalRounds),
            threePuttsPerRound = (totalThreePutts / totalRounds);
            
        //Protect against divide by zero
        if(totalScrambleAttempts === 0){
            $("#scramble-percent").html("N/A");
            $("#scramble-ratio").html("");
        } else {
            $("#scramble-percent").html(Math.round(scramblePercent * 10) / 10 + "%");
            $("#scramble-percent").attr("data-to",Math.round(scramblePercent * 10) / 10 + "%");
            $("#scramble-ratio").html(totalScrambles + "/" + totalScrambleAttempts);
        }
        if(totalSandSaveAttempts === 0){
            $("#sand-save-percent").html("N/A");
            $("#sand-save-ratio").html("");
        } else {
            $("#sand-save-percent").html(Math.round(sandSavePercent * 10) / 10 + "%");
            $("#sand-save-percent").attr("data-to",Math.round(sandSavePercent * 10) / 10 + "%");
            $("#sand-save-ratio").html(totalSandSaves + "/" + totalSandSaveAttempts);
        }
        //Set scrambling data
        $("#three-putt-ratio").html(totalThreePutts + "/" + totalRounds);
        $("#putts-per-round").html(Math.round(puttsPerRound * 10) / 10);
        $("#putts-per-round").attr("data-to",Math.round(puttsPerRound * 10) / 10);
        $("#three-putts-per-round").html(Math.round(threePuttsPerRound * 10) / 10);
        $("#three-putts-per-round").attr("data-to",Math.round(threePuttsPerRound * 10) / 10);
        
        //Pie Chart
        highChartsScoreByAR(traps);
        
        //Scrambling % by trap bar chart
        highChartsScramblingByTrap(traps);
        
        //numCounterUpdate();
    });
};