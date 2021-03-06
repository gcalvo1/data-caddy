function setApproach(parameters) {
  $.get("/dashboard/roundsdata", parameters, function (data) {
    var totalGirs = 0,
      totalApproaches = 0,
      totalNonPar3Approaches = 0,
      totalApproachDistance = 0,
      totalHoles = 0,
      totalNonParThrees = 0,
      totalPunchOuts = 0,
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
        gir: 0,
      },
      girByDate = [],
      approachSpreadByDate = [],
      scoreByApproachDistance = [];
    if (parameters.club === "All") {
      data.rounds.forEach(function (round) {
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
        round.holes.forEach(function (hole) {
          totalHoles++;
          if (hole.par != 3) {
            totalNonParThrees++;
            if (!hole.approach.approachToGreen) {
              totalPunchOuts++;
            }
          }
          if (hole.approach.approachToGreen) {
            var scoreToPar = hole.score - hole.par;
            totalApproaches++;
            if (hole.par != 3) {
              totalNonPar3Approaches++;
              totalApproachDistance += hole.approach.approachLength;
            }
            scoreByApproachDistance.push([
              hole.approach.approachLength,
              scoreToPar,
            ]);
            //Set directional miss
            if (
              hole.approach.approachResult === "GIR" ||
              hole.approach.approachResult === "Under GIR"
            ) {
              totalGirs++;
              roundGirs++;
              totalMiss.gir++;
              roundMiss.gir++;
            } else if (hole.approach.approachDirection === "Right") {
              totalMiss.right++;
              roundMiss.right++;
            } else if (hole.approach.approachDirection === "Left") {
              totalMiss.left++;
              roundMiss.left++;
            } else if (hole.approach.approachDirection === "Long") {
              totalMiss.long++;
              roundMiss.long++;
            } else if (hole.approach.approachDirection === "Short") {
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
      data.rounds.forEach(function (round) {
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
        round.holes.forEach(function (hole) {
          if (hole.approach.approachClub === parameters.club) {
            totalHoles++;
            if (hole.par != 3) {
              totalNonParThrees++;
              if (!hole.approach.approachToGreen) {
                totalPunchOuts++;
              }
            }
            if (hole.approach.approachToGreen) {
              var scoreToPar = hole.score - hole.par;
              totalApproaches++;
              if (hole.par != 3) {
                totalNonPar3Approaches++;
                totalApproachDistance += hole.approach.approachLength;
              }
              scoreByApproachDistance.push([
                hole.approach.approachLength,
                scoreToPar,
              ]);
              if (
                hole.approach.approachResult === "GIR" ||
                hole.approach.approachResult === "Under GIR"
              ) {
                totalGirs++;
                roundGirs++;
                totalMiss.gir++;
                roundMiss.gir++;
              } else if (hole.approach.approachDirection === "Right") {
                totalMiss.right++;
                roundMiss.right++;
              } else if (hole.approach.approachDirection === "Left") {
                totalMiss.left++;
                roundMiss.left++;
              } else if (hole.approach.approachDirection === "Long") {
                totalMiss.long++;
                roundMiss.long++;
              } else if (hole.approach.approachDirection === "Short") {
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
    var girPercent = (totalGirs / totalHoles) * 100,
      punchPercent = (totalPunchOuts / totalNonParThrees) * 100,
      avgApproachDistance = totalApproachDistance / totalNonPar3Approaches,
      approachMissPercent = {
        right: (totalMiss.right / totalApproaches) * 100,
        left: (totalMiss.left / totalApproaches) * 100,
        long: (totalMiss.long / totalApproaches) * 100,
        short: (totalMiss.short / totalApproaches) * 100,
      };
    //Protect against divide by zero
    if (totalHoles === 0) {
      $("#gir-percent").html("N/A");
      $("#gir-ratio").html("");
      $("#punch-percent").html("N/A");
      $("#punch-ratio").html("");
    } else {
      $("#gir-percent").html(Math.round(girPercent * 10) / 10 + "%");
      $("#gir-ratio").html(totalGirs + "/" + totalHoles);
      $("#punch-percent").html(Math.round(punchPercent * 10) / 10 + "%");
      $("#punch-ratio").html(totalPunchOuts + "/" + totalNonParThrees);
    }
    if (totalApproaches === 0) {
      $("#approach-distance").html("N/A");
      $("#approach-miss-right").html("N/A");
      $("#approach-miss-left").html("N/A");
      $("#approach-miss-long").html("N/A");
      $("#approach-miss-short").html("N/A");
      $("#approach-miss-right-ratio").html("");
      $("#approach-miss-left-ratio").html("");
      $("#approach-miss-long-ratio").html("");
      $("#approach-miss-short-ratio").html("");
      $("#approach-miss-rough").html("N/A");
      $("#approach-miss-bunker").html("N/A");
      $("#approach-miss-woods").html("N/A");
      $("#approach-miss-fescue").html("N/A");
      $("#approach-miss-water").html("N/A");
      $("#approach-miss-fringe").html("N/A");
    } else {
      $("#approach-distance").html(
        Math.round(avgApproachDistance * 10) / 10 + " yds"
      );
      $("#approach-miss-right").html(
        Math.round(approachMissPercent.right * 10) / 10 + "%"
      );
      $("#approach-miss-left").html(
        Math.round(approachMissPercent.left * 10) / 10 + "%"
      );
      $("#approach-miss-long").html(
        Math.round(approachMissPercent.long * 10) / 10 + "%"
      );
      $("#approach-miss-short").html(
        Math.round(approachMissPercent.short * 10) / 10 + "%"
      );
      $("#approach-miss-right-ratio").html(
        totalMiss.right + "/" + totalApproaches
      );
      $("#approach-miss-left-ratio").html(
        totalMiss.left + "/" + totalApproaches
      );
      $("#approach-miss-long-ratio").html(
        totalMiss.long + "/" + totalApproaches
      );
      $("#approach-miss-short-ratio").html(
        totalMiss.short + "/" + totalApproaches
      );
      $("#approach-miss-rough").html(
        Math.round(totalMissHazzard.rough * 10) / 10
      );
      $("#approach-miss-bunker").html(
        Math.round(totalMissHazzard.bunker * 10) / 10
      );
      $("#approach-miss-woods").html(
        Math.round(totalMissHazzard.woods * 10) / 10
      );
      $("#approach-miss-fescue").html(
        Math.round(totalMissHazzard.fescue * 10) / 10
      );
      $("#approach-miss-water").html(
        Math.round(totalMissHazzard.water * 10) / 10
      );
      $("#approach-miss-fringe").html(
        Math.round(totalMissHazzard.fringe * 10) / 10
      );
    }

    //Area Chart
    highChartsGirByRound("gir-by-date", 408, girByDate);
    highChartsApproachSpread(approachSpreadByDate);
    highChartsApproachScatter(
      "score-to-par-by-approach-distance",
      "Score to Par By Approach Distance",
      "Score to Par",
      scoreByApproachDistance
    );
  });
}
