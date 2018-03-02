var express = require("express");
var router = express.Router();
var Round = require("../models/round");
var Course = require("../models/course");
var middleware = require("../middleware");
var request = require('request');

router.get("/", middleware.isLoggedIn, function(req, res){
    Round.find({"player.id": req.user._id}).populate("course").exec(function(err, rounds){
        if(err){
            console.log(err);
        } else {
            //console.log({rounds:rounds});
            res.render("rounds/index",{rounds:rounds});
        }
    });
});

//CREATE
router.post("/", middleware.isLoggedIn, function(req, res){
    console.log(req.body.round);
    if(req.body.round.course && req.body.round.numHoles && req.body.round.tees && req.body.round.datetime && (req.body.round.par == 3 || req.body.round.teeShotClub) && (req.body.round.par == 3 || req.body.round.teeShotDirection) && (req.body.round.par == 3 || req.body.round.teeShotResult) && req.body.round.approachToGreen && (req.body.round.approachToGreen === "No" || req.body.round.approachClub) && (req.body.round.approachToGreen === "No" || req.body.round.approachDirection) && (req.body.round.approachToGreen === "No" || req.body.round.approachResult) && req.body.round.putts && req.body.round.score){
        console.log("here");
        console.log(req.body.round);
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
        
        console.log(roundKey);
        
        var newRound = {
            date: req.body.round.datetime,
            isFull: isFull,
            isComplete: false,
            roundType: req.body.round.numHoles,
            tees: req.body.round.tees,
            weather: {
                summary: "",
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
                score: req.body.round.score
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
                    console.log("not found round");
                    
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
                                    console.log(date);
                                    request('https://api.darksky.net/forecast/eabbc6c00a33a5c6b6bb82cdd4955a48/'+foundCourse.location.latitude+','+foundCourse.location.longitude+','+date+'?exclude=minutely,daily,flags', function(error, response, body) {
                                        if(!error && response.statusCode == 200){
                                            var parsedData = JSON.parse(body);
                                            newRound.weather.summary = parsedData["currently"]["summary"];
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
                                                    req.flash("success", "Hole Saved");
                                                }
                                            });
                                        } else {
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
                            console.log("hole match");
                            foundHole = true;
                            foundPos = i;
                        }
                    }
                    console.log(foundHole);
                    if(foundHole){
                        //Replace hole
                        foundRound.holes.splice(foundPos, 1, newRound.holes);
                        foundRound.save(function(err, data){  
                            if(err){
                                console.log(err);
                            } else {
                                req.flash("success", "Hole Saved");
                            }
                        });
                    } else {
                        //push new hole
                        foundRound.holes.push(newRound.holes);
                        foundRound.save(function(err, data){  
                            if(err){
                                console.log(err);
                            } else {
                                req.flash("success", "Hole Saved");
                                if((data.isFull && data.holes.length === 18) || (!data.isFull && data.holes.length === 9)){
                                    foundRound.isComplete = true;
                                    foundRound.save(function(err, data){  
                                        if(err){
                                            console.log(err);
                                        }  
                                    });
                                }
                            }
                        });
                    }
                }
            }
        });
    }
});

router.get("/new", middleware.isLoggedIn, function(req, res){
    Course.find().exec(function(err, courses){
        if(err){
            console.log(err);
        } else {
            res.render("rounds/new",{courses:courses}); 
        }
    });
});

//SHOW
router.get("/:id", middleware.isLoggedIn, function(req, res) {
    //find the round with id and render show page with the round
    Round.findById(req.params.id).populate("course").exec(function(err, foundRound){
      if(err){
          console.log(err);
      } else {
          console.log(req.user);
          res.render("rounds/show", {round: foundRound, user: req.user});
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
                            res.render("rounds/edit",{round: foundRound, courses:courses, course:course}); 
                        }
                    });
                }
            });
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