var express = require("express");
var router = express.Router();
var Round = require("../models/round");
var Course = require("../models/course");
var middleware = require("../middleware");
var AWS = require('aws-sdk');

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
            
            // res.render("dashboard/index",{
            //             user:req.user, 
            //             roundTypes:roundTypes,
            //             userImg: null
            //         });
                    
            AWS.config.loadFromPath('./s3_config.json');
            
            var s3Bucket = new AWS.S3({ params: {Bucket: 'data-caddy-profile-pics'} });
            var urlParams = {Bucket: 'data-caddy-profile-pics', Key: req.user.username + '.jpg'};
            s3Bucket.getSignedUrl('getObject', urlParams, function(err, url){
                if(err){
                    console.log(err);
                } else {
                    console.log(url);
                    res.render("dashboard/index",{
                        user:req.user, 
                        roundTypes:roundTypes,
                        userImg: url
                    });
                }
            });
        }
    });
});


router.get("/handicapdata", middleware.isLoggedIn, function(req, res){
    Round.find({"player.id": req.user._id, isFull:true}).populate("course").exec(function(err, rounds){
        if(err){
            console.log(err);
        } else {
            function compare(a,b) {
              if (a < b)
                return -1;
              if (a > b)
                return 1;
              return 0;
            }
            rounds.sort(compare);
            //get latest 20 rounds
            //Change to 5
            if(rounds.length < 1){
                //res.send({handicapIndex: null})
            }
            else {
                var differentials = [];
                rounds.forEach(function(round){
                    var ags = 0;
                    round.holes.forEach(function(hole){
                        if(hole.score - hole.par > 2){
                            hole.score = hole.par + 2
                        }
                        ags += hole.score;
                    });
                    
                    var slope = 0,
                        rating = 0;
                    round.course[0].tees.forEach(function(tee){
                        if(round.tees === tee.color){
                            slope = tee.slope;
                            rating = tee.rating;
                        }
                    });
                    
                    var handicapDifferential = (ags - rating) * 113 / slope;
                    differentials.push(handicapDifferential);
                });
                
                differentials.sort(compare);
                //determine what differentials to use based on the number of rounds recorded
                
                var count = 0,
                    differentialSum = 0;
                differentials.forEach(function(differential){
                    count++;
                    differentialSum += differential;
                });
                var handicapIndex = (differentialSum / count) * .96;
                res.send({handicapIndex:handicapIndex});
            }
        }
    });
});

router.get("/roundsdata", middleware.isLoggedIn, function(req, res){
    Round.find({"player.id": req.user._id, isFull: req.query.isFull, date: {$gte: req.query.dateFrom,$lte: req.query.dateTo}}).populate("course").exec(function(err, rounds){
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
                allClubs = [
                    {
                        clubName:'Driver',
                        teeFound: false,
                        approachFound: false
                    },
                    {
                        clubName:'3W',
                        teeFound: false,
                        approachFound: false
                    },
                    {
                        clubName:'5W',
                        teeFound: false,
                        approachFound: false
                    },
                    {
                        clubName:'Rescue',
                        teeFound:false
                    },
                    {
                        clubName:'3I',
                        teeFound: false,
                        approachFound: false
                    },
                    {
                        clubName:'4I',
                        teeFound: false,
                        approachFound: false
                    },
                    {
                        clubName:'5I',
                        teeFound: false,
                        approachFound: false
                    },
                    {
                        clubName:'6I',
                        teeFound: false,
                        approachFound: false
                    },
                    {
                        clubName:'7I',
                        teeFound: false,
                        approachFound: false
                    },
                    {
                        clubName:'8I',
                        teeFound: false,
                        approachFound: false
                    },
                    {
                        clubName:'9I',
                        teeFound: false,
                        approachFound: false
                    },
                    {
                        clubName:'PW',
                        teeFound: false,
                        approachFound: false
                    },
                    {
                        clubName:'GW',
                        teeFound: false,
                        approachFound: false
                    },
                    {
                        clubName:'SW',
                        teeFound: false,
                        approachFound: false
                    },
                    {
                        clubName:'LW',
                        teeFound: false,
                        approachFound: false
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
                        allClubs.forEach(function(club){
                            if(club.clubName === hole.teeShot.teeShotClub){
                                club.teeFound = true;
                            }
                            if(club.clubName === hole.approach.approachClub){
                                club.approachFound = true;
                            }
                        });
                    } else {
                        totalScoreByHolePar.parFive.score += hole.score;
                        totalScoreByHolePar.parFive.numHoles ++;
                        //Found tee club
                        allClubs.forEach(function(club){
                            if(club.clubName === hole.teeShot.teeShotClub){
                                club.teeFound = true;
                            }
                            if(club.clubName === hole.approach.approachClub){
                                club.approachFound = true;
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
        res.send({rounds:rounds, avgScore, user: req.user, numScoreNames, allClubs:allClubs});
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