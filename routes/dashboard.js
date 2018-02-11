var express = require("express");
var router = express.Router();
var Round = require("../models/round");
var Course = require("../models/course");
var middleware = require("../middleware");

router.get("/", middleware.isLoggedIn, function(req, res){
    Round.find({"player.id": req.user._id}).populate("course").exec(function(err, rounds){
        var numFullRounds = 0,
            numNineRounds = 0;
        if(err){
            console.log(err);
        } else {
            //Dashboard data to be returned
            var roundTypes = [
                    {
                        numHoles: '18 Holes',
                        found: false
                    },
                    {
                        numHoles: '9 Holes',
                        found: false
                    }
                ];
            rounds.forEach(function(round){
                if(round.isFull){
                    numFullRounds++;
                } else {
                    numNineRounds++;
                }
            });
            if(numFullRounds > 0){
                roundTypes[0].found = true;
            }
            if(numNineRounds > 0){
                roundTypes[1].found = true;
            }
            res.render("dashboard/index",{
                user:req.user, 
                roundTypes:roundTypes});
        }
    });
});

router.get("/roundsdata", middleware.isLoggedIn, function(req, res){
    Round.find({"player.id": req.user._id, isFull: req.query.isFull}).populate("course").exec(function(err, rounds){
        if(err){
            console.log(err);
        } else {
            //Dashboard data to be returned
            var numRounds = 0,
                totalScore = 0,
                totalScoreToPar = 0,
                numScoreNames = {
                    par: 0,
                    bogey: 0,
                    birdie: 0,
                    doubleBogey: 0,
                    eagle: 0,
                    bogeyWorse: 0,
                    eagleBetter: 0
                },
                scoreByDate = [],
                allTeeClubs = [
                    {
                        clubName:'Driver',
                        found:false
                    },
                    {
                        clubName:'3W',
                        found:false
                    },
                    {
                        clubName:'5W',
                        found:false
                    },
                    {
                        clubName:'Rescue',
                        found:false
                    },
                    {
                        clubName:'3I',
                        found:false
                    },
                    {
                        clubName:'4I',
                        found:false
                    },
                    {
                        clubName:'5I',
                        found:false
                    },
                    {
                        clubName:'6I',
                        found:false
                    },
                    {
                        clubName:'7I',
                        found:false
                    },
                    {
                        clubName:'8I',
                        found:false
                    },
                    {
                        clubName:'9I',
                        found:false
                    }
                ],
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
                    roundData = [];
                numRounds++;
                roundData.push(round.date);
                round.holes.forEach(function(hole){
                    totalScore += hole.score;
                    roundScore += hole.score;
                    roundPar += hole.par;
                    //Set Score Names
                    if(hole.score - hole.par === 0){
                        numScoreNames.par++;
                    } else if(hole.score - hole.par === 1){
                        numScoreNames.bogey++;
                    } else if(hole.score - hole.par === -1){
                        numScoreNames.birdie++;
                    } else if(hole.score - hole.par === 2){
                        numScoreNames.doubleBogey++;
                    } else if(hole.score - hole.par === -2){
                        numScoreNames.eagle++;
                    } else if(hole.score - hole.par > 2){
                        numScoreNames.bogeyWorse++;
                    } else if(hole.score - hole.par < -2){
                        numScoreNames.eagleBetter++;
                    }
                    if(hole.par === 3) {
                        totalScoreByHolePar.parThree.score += hole.score;
                        totalScoreByHolePar.parThree.numHoles ++;
                    } else if(hole.par === 4) {
                        totalScoreByHolePar.parFour.score += hole.score;
                        totalScoreByHolePar.parFour.numHoles ++;
                        //Found tee club
                        allTeeClubs.forEach(function(club){
                            if(club.clubName === hole.teeShot.teeShotClub){
                                club.found = true;
                            }
                        });
                    } else {
                        totalScoreByHolePar.parFive.score += hole.score;
                        totalScoreByHolePar.parFive.numHoles ++;
                        //Found tee club
                        allTeeClubs.forEach(function(club){
                            if(club.clubName === hole.teeShot.teeShotClub){
                                club.found = true;
                            }
                        });
                    }
                });
                roundData.push(roundScore);
                scoreByDate.push(roundData);
                totalScoreToPar += (roundScore - roundPar);
            }); 
        }
        var avgScore =
            {
                avgScore: totalScore / numRounds,
                avgScoreToPar: totalScoreToPar / numRounds,
                scoreByDate: scoreByDate,
                avgScoreByHolePar: {
                    parThree: totalScoreByHolePar.parThree.score / totalScoreByHolePar.parThree.numHoles,
                    parFour: totalScoreByHolePar.parFour.score / totalScoreByHolePar.parFour.numHoles,
                    parFive: totalScoreByHolePar.parFive.score / totalScoreByHolePar.parFive.numHoles
                }
            };
        res.send({rounds:rounds, avgScore, user: req.user, numScoreNames, allTeeClubs:allTeeClubs});
    });
});

router.get("/mostrecentround", middleware.isLoggedIn, function(req, res){
    Round.find({"player.id": req.user._id, isFull: req.query.isFull}).sort({date:-1}).limit(1).populate("course").exec(function(err, mostRecentRound){
        if(err){
            console.log(err);
        } else {
            res.send({mostRecentRound: mostRecentRound});
        }
    });
});


module.exports = router;