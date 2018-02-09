var express = require("express");
var router = express.Router();
var Round = require("../models/round");
var Course = require("../models/course");
var middleware = require("../middleware");

router.get("/", middleware.isLoggedIn, function(req, res){
    Round.find({"player.id": req.user._id}).populate("course").exec(function(err, rounds){
        if(err){
            console.log(err);
        } else {
            //Dashboard data to be returned
            var numFullRounds = 0,
                totalFullScore = 0,
                numNineRounds = 0,
                totalNineScore = 0,
                totalFullScoreToPar = 0,
                scoreByDate = [],
                totalScoreByHolePar = {
                    parThree: {
                        score: 0,
                        numHoles: 0
                    },
                    parFour: {
                        score: 0,
                        numHoles: 0
                    },
                    parFive: {
                        score: 0,
                        numHoles: 0
                    }
                };
            rounds.forEach(function(round){
                var roundScore = 0,
                    roundPar = 0,
                    roundData = []
                if(round.isFull){
                    numFullRounds++;
                    roundData.push(Date.UTC(round.date));
                    round.holes.forEach(function(hole){
                        totalFullScore += hole.score;
                        roundScore += hole.score;
                        roundPar += hole.par;
                        if(hole.par === 3) {
                            totalScoreByHolePar.parThree.score += hole.score;
                            totalScoreByHolePar.parThree.numHoles ++;
                        } else if(hole.par === 4) {
                            totalScoreByHolePar.parFour.score += hole.score;
                            totalScoreByHolePar.parFour.numHoles ++;
                        } else {
                            totalScoreByHolePar.parFive.score += hole.score;
                            totalScoreByHolePar.parFive.numHoles ++;
                        }
                    });
                    roundData.push(totalFullScore);
                    scoreByDate.push(roundData);
                } else {
                    numNineRounds++;
                    round.holes.forEach(function(hole){
                        totalNineScore += hole.score;
                        if(hole.par === 3) {
                            totalScoreByHolePar.parThree.score += hole.score;
                            totalScoreByHolePar.parThree.numHoles ++;
                        } else if(hole.par === 4) {
                            totalScoreByHolePar.parFour.score += hole.score;
                            totalScoreByHolePar.parFour.numHoles ++;
                        } else {
                            totalScoreByHolePar.parFive.score += hole.score;
                            totalScoreByHolePar.parFive.numHoles ++;
                        }
                    });
                }
                totalFullScoreToPar += (roundScore - roundPar);
                
            });
            var ScoreData =
                {
                    avgNineScore: totalNineScore / numNineRounds,
                    avgFullScore: totalFullScore / numFullRounds,
                    avgFullScoreToPar: totalFullScoreToPar / numFullRounds,
                    scoreByDate: scoreByDate,
                    avgScoreByHolePar: {
                        parThree: totalScoreByHolePar.parThree.score / totalScoreByHolePar.parThree.numHoles,
                        parFour: totalScoreByHolePar.parFour.score / totalScoreByHolePar.parFour.numHoles,
                        parFive: totalScoreByHolePar.parFive.score / totalScoreByHolePar.parFive.numHoles
                    }
                }
            res.render("dashboard/index",{user:req.user, rounds:rounds, ScoreData});
        }
    });
});

module.exports = router;