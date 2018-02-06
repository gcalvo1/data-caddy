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
                scoreByDate = [];
            rounds.forEach(function(round){
                var roundScore = 0,
                    roundPar = 0,
                    roundData = [];
                if(round.isFull){
                    numFullRounds++;
                    roundData.push(Date.UTC(round.date));
                    round.holes.forEach(function(hole){
                        totalFullScore += hole.score;
                        roundScore += hole.score;
                        roundPar += hole.par;
                    });
                    roundData.push(totalFullScore);
                    scoreByDate.push(roundData);
                } else {
                    numNineRounds++;
                    round.holes.forEach(function(hole){
                        totalNineScore += hole.score;
                    });
                }
                totalFullScoreToPar += (roundScore - roundPar);
                
            });
            var avgScore =
                {
                    avgNineScore: totalNineScore / numNineRounds,
                    avgFullScore: totalFullScore / numFullRounds,
                    avgFullScoreToPar: totalFullScoreToPar / numFullRounds,
                    scoreByDate: scoreByDate
                }
            res.render("dashboard/index",{user:req.user, rounds:rounds, avgScore});
        }
    });
});

module.exports = router;