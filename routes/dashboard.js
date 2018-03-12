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
                if(round.isFull && round.isComplete){
                    numFullRounds++;
                } else if(!round.isFull && round.isComplete){
                    numNineRounds++;
                }
            });
            if(numFullRounds > 0){
                roundTypes[0].found = true;
            }
            if(numNineRounds > 0){
                roundTypes[1].found = true;
            }
                    
            // AWS.config.loadFromPath('./s3_config.json');
            
            var s3Bucket = new AWS.S3({ params: {Bucket: 'data-caddy-profile-pics'} });
            var urlParams = {Bucket: 'data-caddy-profile-pics', Key: req.user.username + req.user.imgExt};
            s3Bucket.getSignedUrl('getObject', urlParams, function(err, url){
                if(err){
                    console.log(err);
                } else {
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
    Round.find({"player.id": req.user._id, isFull:true, isComplete:true}).populate("course").exec(function(err, rounds){
        if(err){
            console.log(err);
        } else {
            function compare(a,b) {
              if (a.date < b.date)
                return 1;
              if (a.date > b.date)
                return -1;
              return 0;
            }
            rounds.sort(compare);
            //get latest 20 rounds
            //Change to 5
            if(rounds.length < 5){
                res.send({handicapIndex: null})
            }
            else {
                var roundsTwenty = []
                if(rounds.length > 20){
                    for(let i=0; i<20; i++){
                        roundsTwenty.push(rounds[i]);
                    }
                } else {
                    rounds.forEach(function(round){
                        roundsTwenty.push(round);
                    });
                }
                var differentials = [];
                roundsTwenty.forEach(function(round){
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
                
                differentials.sort();
                //determine what differentials to use based on the number of rounds recorded
                var selectedDifferentials = [];
                if(differentials.length <= 6){
                    for(let i=0; i<1; i++){
                        selectedDifferentials.push(differentials[i]);
                    }
                } else if(differentials.length >= 7 && differentials.length <= 8){
                    for(let i=0; i<2; i++){
                        selectedDifferentials.push(differentials[i]);
                    }
                } else if(differentials.length >= 9 && differentials.length <= 10){
                    for(let i=0; i<3; i++){
                        selectedDifferentials.push(differentials[i]);
                    }
                } else if(differentials.length >= 11 && differentials.length <= 12){
                    for(let i=0; i<4; i++){
                        selectedDifferentials.push(differentials[i]);
                    }
                } else if(differentials.length >= 13 && differentials.length <= 14){
                    for(let i=0; i<5; i++){
                        selectedDifferentials.push(differentials[i]);
                    }
                } else if(differentials.length >= 15 && differentials.length <= 16){
                    for(let i=0; i<6; i++){
                        selectedDifferentials.push(differentials[i]);
                    }
                } else if(differentials.length == 17){
                    for(let i=0; i<7; i++){
                        selectedDifferentials.push(differentials[i]);
                    }
                } else if(differentials.length == 18){
                    for(let i=0; i<8; i++){
                        selectedDifferentials.push(differentials[i]);
                    }
                } else if(differentials.length == 19){
                    for(let i=0; i<9; i++){
                        selectedDifferentials.push(differentials[i]);
                    }
                } else if(differentials.length == 20){
                    for(let i=0; i<10; i++){
                        selectedDifferentials.push(differentials[i]);
                    }
                }
                
                var count = 0,
                    differentialSum = 0;
                selectedDifferentials.forEach(function(differential){
                    count++;
                    differentialSum += differential;
                });
                var handicapIndex = (differentialSum / count) * .96;
                handicapIndex = parseInt('' + (handicapIndex * 10)) / 10;
                res.send({handicapIndex:handicapIndex});
            }
        }
    });
});

router.get("/roundsdata", middleware.isLoggedIn, function(req, res){
    Round.find({"player.id": req.user._id, isFull: req.query.isFull, date: {$gte: req.query.dateFrom,$lte: req.query.dateTo}, isComplete:true}).populate("course").exec(function(err, rounds){
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
                scoreByCourse = [],
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
                },
                scoreNames = [],
                weatherIcons = [],
                windSpeed = [],
                temperature = [];
            rounds.forEach(function(round){
                var roundScore = 0,
                    roundPar = 0,
                    roundData = [],
                    roundFirs = 0,
                    roundTeeShots = 0,
                    roundGirs = 0,
                    roundApproaches = 0;
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
                        roundApproaches++;
                        if(hole.approach.approachResult === "GIR" || hole.approach.approachResult === "Under GIR"){
                            roundGirs++;
                        }
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
                        roundTeeShots++;
                        roundApproaches++;
                        if(hole.teeShot.teeShotResult === "FIR") {
                            roundFirs++;
                        }
                        if(hole.approach.approachResult === "GIR" || hole.approach.approachResult === "Under GIR"){
                            roundGirs++;
                        }
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
                        roundTeeShots++;
                        roundApproaches++;
                        if(hole.teeShot.teeShotResult === "FIR") {
                            roundFirs++;
                        }
                        if(hole.approach.approachResult === "GIR"  || hole.approach.approachResult === "Under GIR"){
                            roundGirs++;
                        }
                    }
                });
                //weather
                if(round.weather.icon){
                    if(weatherIcons.length === 0){
                        weatherIcons.push(
                            {
                                icon: round.weather.icon,
                                score: roundScore,
                                scoreToPar: roundScore - roundPar,
                                rounds: 1
                            }
                        );
                    } else {
                        var found = false;
                        weatherIcons.forEach(function(icon){
                            if(icon.icon === round.weather.icon){
                                found = true;
                                icon.score += roundScore;
                                icon.scoreToPar += roundScore - roundPar;
                                icon.rounds++;
                            }
                        });
                        if(!found){
                            weatherIcons.push(
                                {
                                    icon: round.weather.icon,
                                    score: roundScore,
                                    scoreToPar: roundScore - roundPar,
                                    rounds: 1
                                }        
                            );
                        }
                    }
                }
                var windCategory = "";
                if(round.weather.windSpeed){
                    if(round.weather.windSpeed < 10){
                        windCategory = "0 - 10 mph";
                    } else if(round.weather.windSpeed >= 10 && round.weather.windSpeed < 20) {
                        windCategory = "10 - 20 mph";
                    } else if(round.weather.windSpeed >= 20 && round.weather.windSpeed < 30) {
                        windCategory = "20 - 30 mph";
                    } else if(round.weather.windSpeed >= 30 && round.weather.windSpeed < 40) {
                        windCategory = "30 - 40 mph";
                    } else {
                        windCategory = "40+ mph";
                    }
                    if(windSpeed.length === 0){
                        windSpeed.push(
                            {
                                category: windCategory,
                                score: roundScore,
                                scoreToPar: roundScore - roundPar,
                                roundTeeShots: roundTeeShots,
                                roundFirs: roundFirs,
                                roundApproaches: roundApproaches,
                                roundGirs: roundGirs,
                                rounds: 1
                            }
                        );
                    } else {
                        var windFound = false;
                        windSpeed.forEach(function(speed){
                            if(speed.category === windCategory){
                                windFound = true;
                                speed.score += roundScore;
                                speed.scoreToPar += roundScore - roundPar;
                                speed.roundTeeShots += roundTeeShots;
                                speed,roundFirs += roundFirs;
                                speed.roundApproaches += roundApproaches;
                                speed.roundGirs += roundGirs;
                                speed.rounds++;
                            }
                        });
                        if(!windFound){
                            windSpeed.push(
                                {
                                    category: windCategory,
                                    score: roundScore,
                                    scoreToPar: roundScore - roundPar,
                                    roundTeeShots: roundTeeShots,
                                    roundFirs: roundFirs,
                                    roundApproaches: roundApproaches,
                                    roundGirs: roundGirs,
                                    rounds: 1
                                }        
                            );
                        }
                    }
                }
                //Temperature
                var tempCategory = "";
                if(round.weather.temperature){
                    if(round.weather.temperature < 50){
                        tempCategory = "0 - 50 Degrees";
                    } else if(round.weather.temperature >= 50 && round.weather.temperature < 60) {
                        tempCategory = "50 - 60 Degrees";
                    } else if(round.weather.temperature >= 60 && round.weather.temperature < 70) {
                        tempCategory = "60 - 70 Degrees";
                    } else if(round.weather.temperature >= 70 && round.weather.temperature < 80) {
                        tempCategory = "70 - 80 Degrees";
                    } else if(round.weather.temperature >= 80 && round.weather.temperature < 90) {
                        tempCategory = "80 - 90 Degrees";
                    } else {
                        tempCategory = "90+ Degrees";
                    }
                    if(temperature.length === 0){
                        temperature.push(
                            {
                                category: tempCategory,
                                score: roundScore,
                                scoreToPar: roundScore - roundPar,
                                roundTeeShots: roundTeeShots,
                                roundFirs: roundFirs,
                                roundApproaches: roundApproaches,
                                roundGirs: roundGirs,
                                rounds: 1
                            }
                        );
                    } else {
                        var tempFound = false;
                        temperature.forEach(function(temp){
                            if(temp.category === tempCategory){
                                tempFound = true;
                                temp.score += roundScore;
                                temp.scoreToPar += roundScore - roundPar;
                                temp.roundTeeShots += roundTeeShots;
                                temp,roundFirs += roundFirs;
                                temp.roundApproaches += roundApproaches;
                                temp.roundGirs += roundGirs;
                                temp.rounds++;
                            }
                        });
                        if(!tempFound){
                            temperature.push(
                                {
                                    category: tempCategory,
                                    score: roundScore,
                                    scoreToPar: roundScore - roundPar,
                                    roundTeeShots: roundTeeShots,
                                    roundFirs: roundFirs,
                                    roundApproaches: roundApproaches,
                                    roundGirs: roundGirs,
                                    rounds: 1
                                }        
                            );
                        }
                    }
                }
                roundData.push(roundScore);
                scoreByDate.push(roundData);
                scoreByCourse.push(
                    {
                        name: round.courseName,
                        latitude: round.course[0].location.latitude,
                        longitude: round.course[0].location.longitude,
                        score: roundScore,
                        rounds: 1
                    });
                totalScoreToPar += (roundScore - roundPar);
            }); 
            if(numScoreNames.par > 0){
                scoreNames.push({name:"Par", y:numScoreNames.par});
            }
            if(numScoreNames.bogey > 0){
                scoreNames.push({name:"Bogey", y:numScoreNames.bogey});
            }
            if(numScoreNames.birdie > 0){
                scoreNames.push({name:"Birdie", y:numScoreNames.birdie});
            }
            if(numScoreNames.doubleBogey > 0){
                scoreNames.push({name:"Double Bogey", y:numScoreNames.doubleBogey});
            }
            if(numScoreNames.eagle > 0){
                scoreNames.push({name:"Eagle", y:numScoreNames.eagle});
            }
            if(numScoreNames.bogeyWorse > 0){
                scoreNames.push({name:"Bogey Worse", y:numScoreNames.bogeyWorse});
            }
            if(numScoreNames.eagleBetter > 0){
                scoreNames.push({name:"Eagle Better", y:numScoreNames.eagleBetter});
            }
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
        var dataToSend = 
            {
                rounds:rounds, 
                avgScore, 
                user: req.user, 
                numScoreNames, 
                scoreNames: scoreNames, 
                scoreByCourse: scoreByCourse,
                allClubs: allClubs, 
                weatherIcons: weatherIcons, 
                windSpeed: windSpeed,
                temperature: temperature
            };
        res.send(dataToSend);
    });
});

router.get("/mostrecentround", middleware.isLoggedIn, function(req, res){
    Round.find({"player.id": req.user._id, isFull: req.query.isFull, date: {$gte: req.query.dateFrom,$lte: req.query.dateTo}, isComplete:true}).sort({date:-1}).limit(1).populate("course").exec(function(err, mostRecentRound){
        if(err){
            console.log(err);
        } else {
            res.send({mostRecentRound: mostRecentRound});
        }
    });
});


module.exports = router;