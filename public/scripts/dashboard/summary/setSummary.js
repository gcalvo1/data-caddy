function setSummary(parameters){
    $.get( '/dashboard/roundsdata', parameters, function(data) {
        
        var coursePlayed = [];
        var favClubs = [];
        data.rounds.forEach(function(round){
            var totalScore = 0;
            round.holes.forEach(function(hole){
                totalScore += hole.score;
                if(favClubs.length == 0){
                    if(hole.teeShot.teeShotClub){
                        favClubs.push({
                            name: hole.teeShot.teeShotClub,
                            timesUsed: 1,
                            totalScoreToPar: hole.score - hole.par
                        });
                    } 
                    if(hole.approach.approachClub){
                        favClubs.push({
                            name: hole.approach.approachClub,
                            timesUsed: 1,
                            totalScoreToPar: hole.score - hole.par
                        });
                    }
                } else {
                    var teeFound = false;
                    var approachFound = false;
                    favClubs.forEach(function(club){
                        if(club.name == hole.teeShot.teeShotClub){
                            club.timesUsed++;
                            club.totalScoreToPar+= hole.score - hole.par;
                            teeFound = true;
                        }
                        if(club.name == hole.approach.approachClub){
                            club.timesUsed++;
                            club.totalScoreToPar+= hole.score - hole.par;
                            approachFound = true;
                        }
                    });
                    if(!teeFound && hole.teeShot.teeShotClub){
                        favClubs.push({
                            name: hole.teeShot.teeShotClub,
                            timesUsed: 1,
                            totalScoreToPar: hole.score - hole.par
                        });
                    }
                    if(!approachFound && hole.approach.approachClub){
                        favClubs.push({
                            name: hole.approach.approachClub,
                            timesUsed: 1,
                            totalScoreToPar: hole.score - hole.par
                        });
                    }
                }
            });
            if(coursePlayed.length == 0){
                coursePlayed.push({
                    name: round.course[0].name,
                    timesPlayed: 1,
                    totalScore: totalScore
                });
            } else {
                var found = false;
                coursePlayed.forEach(function(course){
                    if(course.name == round.course[0].name){
                        course.timesPlayed++;
                        course.totalScore += totalScore;
                        found = true;
                    }
                });
                if(!found){
                    coursePlayed.push({
                        name: round.course[0].name,
                        timesPlayed: 1,
                        totalScore: totalScore
                    });
                }
            }
        });
        
        function Coursecompare(a,b) {
          if (a.timesPlayed < b.timesPlayed)
            return 1;
          if (a.timesPlayed > b.timesPlayed)
            return -1;
          return 0;
        }
        coursePlayed.sort(Coursecompare);
        
        function Clubcompare(a,b) {
          if (a.timesUsed < b.timesUsed)
            return 1;
          if (a.timesUsed > b.timesUsed)
            return -1;
          return 0;
        }
        favClubs.sort(Clubcompare);
        
        //Set Summary Data Cards
        var sign = "+";
        if(data.avgScore.avgScoreToPar === 0 || data.avgScore.avgScoreToPar < 0) {
            sign = "";
        }
        
        if(data.rounds.length === 0){
            $('#no-round-data').removeClass("hidden");
            $('#no-round-data').addClass("no-round-data");
            $('#num-rounds').addClass("hidden");
            $('#scoring-avg').html("N/A");
            $('#avg-score-to-par').html("N/A");
            $('#par-three-scoring-avg').html("N/A");
            $('#par-four-scoring-avg').html("N/A");
            $('#par-five-scoring-avg').html("N/A");
        } else {
            $('#no-round-data').addClass("hidden");
            $('#num-rounds').removeClass("hidden");
            var roundText = "Rounds";
            if(data.rounds.length === 1){
                roundText = "Round";
            }
            $('#num-rounds').html("Showing Data for " + data.rounds.length + " " + roundText);
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
        
        //fav courses
        var favCourseHtml = "<table class='table'><thead><tr><th>Course Name</th><th>Times Played</th><th>Average Score</th></tr></thead><tbody>",
            favClubHtml = "<table class='table'><thead><tr><th>Club</th><th>Times Used</th><th>Average Score to Par</th></tr></thead><tbody>",
            courseLoopLength = coursePlayed.length,
            clubLoopLength = favClubs.length;
            
        if(courseLoopLength > 5){
            courseLoopLength = 5;
        }
        if(clubLoopLength > 6){
            clubLoopLength = 6;
        }
        
        for(let i=0; i<courseLoopLength; i++){
            var avgRoundScore = Math.round(coursePlayed[i].totalScore / coursePlayed[i].timesPlayed * 10) / 10;
            favCourseHtml += "<tr><td>"+coursePlayed[i].name+"</td><td>"+coursePlayed[i].timesPlayed+"</td><td>"+avgRoundScore+"</td></tr>";
        }
        favCourseHtml += "</tbody></table>";
        for(let i=0; i<clubLoopLength; i++){
            var avgClubScore = Math.round(favClubs[i].totalScoreToPar / favClubs[i].timesUsed * 10) / 10;
            if(avgClubScore > 0){
                avgClubScore = "+" + avgClubScore;
            } else if(avgClubScore == 0){
                avgClubScore = "E"
            }
            favClubHtml += "<tr><td>"+favClubs[i].name+"</td><td>"+favClubs[i].timesUsed+"</td><td>"+avgClubScore+"</td></tr>";
        }
        favClubHtml += "</tbody></table>";
        
        $('#fav-courses').html(favCourseHtml);
        $('#fav-clubs').html(favClubHtml);
    });
}