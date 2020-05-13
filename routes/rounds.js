var express = require("express");
var router = express.Router();
var Round = require("../models/round");
var Course = require("../models/course");
var User = require("../models/user");
var middleware = require("../middleware");
var request = require('request');
var AWS = require('aws-sdk');
var http = require('http');

var s3Bucket = new AWS.S3({ params: {Bucket: 'data-caddy-profile-pics'} });

router.get("/", middleware.isLoggedIn, middleware.emailVerified, function(req, res){
    Round.find({"player.id": req.user._id}).populate("course").exec(function(err, rounds){
        if(err){
            console.log(err);
        } else {
            var urlParams = {Bucket: 'data-caddy-profile-pics', Key: req.user.username + req.user.imgExt};
            s3Bucket.getSignedUrl('getObject', urlParams, function(err, url){
                res.render("rounds/index",{rounds:rounds,userImg: url});
            });
        }
    });
});

//CREATE
router.post("/", middleware.isLoggedIn, middleware.emailVerified, function(req, res){
    if(req.body.round.course && req.body.round.numHoles && req.body.round.tees && req.body.round.datetime && (req.body.round.par == 3 || req.body.round.teeShotClub) && (req.body.round.par == 3 || req.body.round.teeShotDirection) && (req.body.round.par == 3 || req.body.round.teeShotResult) && req.body.round.approachToGreen && (req.body.round.approachToGreen === "No" || req.body.round.approachClub) && (req.body.round.approachToGreen === "No" || req.body.round.approachDirection) && (req.body.round.approachToGreen === "No" || req.body.round.approachResult) && req.body.round.putts && req.body.round.score){

        var isFull = false;
        var approachToGreen = false;
        
        if(req.body.round.numHoles === '18 Holes'){
            isFull = true;
        }
        if(req.body.round.approachToGreen === 'Yes')
        {
            approachToGreen = true;
        }
        
        var roundKey = {
            courseName: req.body.round.course,
            isFull: isFull,
            date: req.body.round.datetime,
            "player.username": req.user.username
        };
        
        var newRound = {
            date: req.body.round.datetime,
            isFull: isFull,
            isComplete: false,
            roundType: req.body.round.numHoles,
            tees: req.body.round.tees,
            weather: {
                summary: "",
                icon: "",
                precipIntensity: "",
                precipProbability: "",
                temperature: "",
                apparentTemperature: "",
                dewPoint: "",
                humidity: "",
                pressure: "",
                windSpeed: "",
                windGust: "",
                windBearing: "",
                cloudCover: "",
                uvIndex: "",
                visibility: ""
            },
            player: {
                id: req.user._id,
                username: req.user.username
            },
            courseName: req.body.round.course,
            holes: {
                holeNumber: req.body.round.holeNumber,
                par: req.body.round.par,
                teeShot : {
                    teeShotClub: req.body.round.teeShotClub,
                    teeShotLength: req.body.round.teeShotLength,
                    teeShotDirection: req.body.round.teeShotDirection,
                    teeShotResult: req.body.round.teeShotResult
                },
                approach: {
                    approachToGreen: approachToGreen,
                    approachClub: req.body.round.approachClub,
                    approachLength: req.body.round.approachLength,
                    approachDirection: req.body.round.approachDirection,
                    approachResult: req.body.round.approachResult
                },
                putts: req.body.round.putts,
                score: req.body.round.score,                
                handicap: req.body.round.handicap
            },
            loadDate: Date.now()
            
        };
        
        Round.findOne(roundKey).exec(function(err, foundRound){
            if(err){
                console.log(err);
            } else {
                if(foundRound == null) {
                    //not found round
                    //create new round
                    Round.create(newRound, function(err, newRound){
                        if(err){
                            console.log(err);
                        } else {
                            //Insert Course ID
                            Course.findOne({name: newRound.courseName}, function(err, foundCourse){
                                if(err){
                                    console.log(err);
                                } else {
                                    //Get weather
                                    var date = new Date(newRound.date).getTime() / 1000;
                                    request('https://api.darksky.net/forecast/eabbc6c00a33a5c6b6bb82cdd4955a48/'+foundCourse.location.latitude+','+foundCourse.location.longitude+','+date+'?exclude=minutely,daily,flags', function(error, response, body) {
                                        if(!error && response.statusCode == 200){
                                            var parsedData = JSON.parse(body);
                                            newRound.weather.summary = parsedData["currently"]["summary"];
                                            newRound.weather.icon = parsedData["currently"]["icon"];
                                            newRound.weather.precipIntensity = parsedData["currently"]["precipIntensity"];
                                            newRound.weather.precipProbability = parsedData["currently"]["precipProbability"];
                                            newRound.weather.temperature = parsedData["currently"]["temperature"];
                                            newRound.weather.apparentTemperature = parsedData["currently"]["apparentTemperature"];
                                            newRound.weather.dewPoint = parsedData["currently"]["dewPoint"];
                                            newRound.weather.humidity = parsedData["currently"]["humidity"];
                                            newRound.weather.pressure = parsedData["currently"]["pressure"];
                                            newRound.weather.windSpeed = parsedData["currently"]["windSpeed"];
                                            newRound.weather.windGust = parsedData["currently"]["windGust"];
                                            newRound.weather.windBearing = parsedData["currently"]["windBearing"];
                                            newRound.weather.cloudCover = parsedData["currently"]["cloudCover"];
                                            newRound.weather.uvIndex = parsedData["currently"]["uvIndex"];
                                            newRound.weather.visibility = parsedData["currently"]["visibility"];
                                            
                                            newRound.course.push(foundCourse._id);
                                            newRound.save(function(err, data){  
                                                if(err){
                                                    console.log(err);
                                                } else {
                                                    res.writeHead(200, { 'Content-Type': 'application/json' });
                                                    res.write(JSON.stringify({ status: "OK" }));
                                                    res.end();
                                                }
                                            });
                                        } else {
                                            newRound.course.push(foundCourse._id);
                                            newRound.save(function(err, data){  
                                                if(err){
                                                    console.log(err);
                                                } else {
                                                    res.writeHead(200, { 'Content-Type': 'application/json' });
                                                    res.write(JSON.stringify({ status: "OK" }));
                                                    res.end();
                                                }
                                            });
                                            console.log(error);
                                        }
                                    });
                                }
                            });
                        }
                    }); 
                } else {
                    //found round
                    var foundHole = false;
                    var foundPos = 0;
                    
                    for (let i=0; i < foundRound.holes.length; i++) {
                        if(foundRound.holes[i].holeNumber == newRound.holes.holeNumber){
                            foundHole = true;
                            foundPos = i;
                        }
                    }
                    if(foundHole){
                        //Replace hole
                        foundRound.holes.splice(foundPos, 1, newRound.holes);
                        foundRound.save(function(err, data){  
                            if(err){
                                console.log(err);
                            } else {
                                res.writeHead(200, { 'Content-Type': 'application/json' });
                                res.write(JSON.stringify({ status: "OK" }));
                                res.end();
                            }
                        });
                    } else {
                        //push new hole
                        foundRound.holes.push(newRound.holes);
                        foundRound.save(function(err, data){  
                            if(err){
                                console.log(err);
                            } else {
                                if((data.isFull && data.holes.length === 18) || (!data.isFull && data.holes.length === 9)){
                                    foundRound.isComplete = true;
                                    foundRound.save(function(err, data){  
                                        if(err){
                                            console.log(err);
                                        } else {
                                            res.writeHead(200, { 'Content-Type': 'application/json' });
                                            res.write(JSON.stringify({ status: "OK" }));
                                            res.end();
                                        }  
                                    });
                                } else {
                                    res.writeHead(200, { 'Content-Type': 'application/json' });
                                    res.write(JSON.stringify({ status: "OK" }));
                                    res.end();
                                }
                            }
                        });
                    }
                }
            }
        });

        //Update user handicap index
        var handicapIndex = null;
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
                if(rounds.length >= 5){
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
                    var handicapIndexFull = (differentialSum / count) * .96;
                    console.log(handicapIndexFull);
                    handicapIndex = parseInt('' + (handicapIndexFull * 10)) / 10;
                    console.log(handicapIndex);

                    var conditions = { email: req.user.email }, 
                        update = { $set: { 'handicapIndex': handicapIndex }}, 
                        options = { multi: false };

                    User.update(conditions, update, options, function(err, updated){
                        if(err){
                            console.log(err);
                        } else {
                            console.log("handicap update");
                            res.end();
                        }
                    });
                }
            }
        });        
    }
});

router.get("/new", middleware.isLoggedIn, middleware.emailVerified, function(req, res){
    Course.find().exec(function(err, courses){
        if(err){
            console.log(err);
        } else {
            var urlParams = {Bucket: 'data-caddy-profile-pics', Key: req.user.username + req.user.imgExt};
            s3Bucket.getSignedUrl('getObject', urlParams, function(err, url){
                res.render("rounds/new",{courses:courses, user: req.user, userImg: url}); 
            });
        }
    });
});

//SHOW
router.get("/:id", middleware.isLoggedIn, middleware.emailVerified, function(req, res) {
    //find the round with id and render show page with the round
    Round.findById(req.params.id).populate("course").exec(function(err, foundRound){
      if(err){
          console.log(err);
      } else {    
          var urlParams = {Bucket: 'data-caddy-profile-pics', Key: req.user.username + req.user.imgExt};
          s3Bucket.getSignedUrl('getObject', urlParams, function(err, url){
            res.render("rounds/show", {round: foundRound, user: req.user, userImg: url});
          });
      }
    });
});

//EDIT
router.get("/:id/edit", middleware.checkRoundOwnership, function(req, res) {
    Round.findById(req.params.id, function(err, foundRound){
        if(err){
            console.log(err);
        } else {
            Course.find().exec(function(err, courses){
                if(err){
                    console.log(err);
                } else {
                    Course.find({name:foundRound.courseName}).exec(function(err, course){
                        if(err){
                            console.log(err);
                        } else {
                            var urlParams = {Bucket: 'data-caddy-profile-pics', Key: req.user.username + req.user.imgExt};
                            s3Bucket.getSignedUrl('getObject', urlParams, function(err, url){
                                res.render("rounds/edit",{round: foundRound, courses:courses, course:course, user:req.user, userImg: url}); 
                            });
                        }
                    });
                }
            });
        }
    });
});

//UPDATE
router.put("/:id", middleware.checkRoundOwnership, function(req, res){
    var date = new Date(req.body.date);
    
    Round.findByIdAndUpdate(req.body.id, {$set: { date: date }}, function(err, updatedRound){
        if(err){
            res.redirect("/");
        } else {
            res.end();
        }
    });
});

//DESTROY
router.delete("/:id", middleware.checkRoundOwnership, function(req, res){
    Round.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/rounds");    
        } else {
            res.redirect("/rounds");
        }
    });
});

module.exports = router;