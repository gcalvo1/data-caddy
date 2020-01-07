function setSummary(parameters){
    $.get( '/dashboard/roundsdata', parameters, function(data) {
        
        data.rounds[0].course[0].tees        

        var coursePlayed = [],
            favClubs = [],
            scoreToParByRating = [],
            scoreToParBySlope = [],
            scoreByHandicap = [
                { handicap: "1", totalScoreToPar: 0, timesPlayed: 0},
                { handicap: "2", totalScoreToPar: 0, timesPlayed: 0},
                { handicap: "3", totalScoreToPar: 0, timesPlayed: 0},
                { handicap: "4", totalScoreToPar: 0, timesPlayed: 0},
                { handicap: "5", totalScoreToPar: 0, timesPlayed: 0},
                { handicap: "6", totalScoreToPar: 0, timesPlayed: 0},
                { handicap: "7", totalScoreToPar: 0, timesPlayed: 0},
                { handicap: "8", totalScoreToPar: 0, timesPlayed: 0},
                { handicap: "9", totalScoreToPar: 0, timesPlayed: 0},
                { handicap: "10", totalScoreToPar: 0, timesPlayed: 0},
                { handicap: "11", totalScoreToPar: 0, timesPlayed: 0},
                { handicap: "12", totalScoreToPar: 0, timesPlayed: 0},
                { handicap: "13", totalScoreToPar: 0, timesPlayed: 0},
                { handicap: "14", totalScoreToPar: 0, timesPlayed: 0},
                { handicap: "15", totalScoreToPar: 0, timesPlayed: 0},
                { handicap: "16", totalScoreToPar: 0, timesPlayed: 0},
                { handicap: "17", totalScoreToPar: 0, timesPlayed: 0},
                { handicap: "18", totalScoreToPar: 0, timesPlayed: 0},
            ];
        data.rounds.forEach(function(round){
            var totalScore = 0,
                totalScoreToPar = 0,
                rating = 0,
                slope = 0;

            //Get slope/rating for the course
            round.course[0].tees.forEach(function(tee){
                if(round.tees == tee.color){
                    rating = tee.rating;
                    slope = tee.slope;
                } 
            });
                           
            round.holes.forEach(function(hole){
                totalScore += hole.score;
                totalScoreToPar += hole.score - hole.par;
                scoreByHandicap.forEach(function(score){
                    if(score.handicap == hole.handicap ){
                        score.totalScoreToPar += hole.score - hole.par;
                        score.timesPlayed++;
                    }
                });
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

            //Push data to score by rating/slope array for highchart on summary dashboard
            scoreToParByRating.push([rating,totalScoreToPar]);
            scoreToParBySlope.push([slope,totalScoreToPar]);
            
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

        console.log(scoreToParByRating);
        console.log(scoreToParBySlope);
        
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
        //Score By Handicap Column Chart
        highChartsScoreByHoleHandicap(scoreByHandicap);   
        //Score By Rating Column Chart
        highChartsScoreBySlopeRatingScatter('score-to-par-by-rating','Score to Par By Course Rating','Rating','Score to Par',scoreToParByRating);
     
        
        //fav courses
        var favCourseHtml = "<table class='table'><thead><tr><th>Course Name</th><th>Times Played</th><th>Average Score</th></tr></thead><tbody>",
            favClubHtml = "<table class='table'><thead><tr><th>Club</th><th>Times Used</th><th>Average Score to Par</th></tr></thead><tbody>",
            courseLoopLength = coursePlayed.length,
            clubLoopLength = favClubs.length;
            
        if(courseLoopLength > 5){
            courseLoopLength = 5;
        }
        if(clubLoopLength > 5){
            clubLoopLength = 5;
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