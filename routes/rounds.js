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
            //console.log({rounds:rounds});
            res.render("rounds/index",{rounds:rounds});
        }
    });
});

//CREATE
router.post("/", middleware.isLoggedIn, function(req, res){
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
        date: req.body.round.datetime
    };
    
    var newRound = {
        date: req.body.round.datetime,
        isFull: isFull,
        roundType: req.body.round.numHoles,
        player: {
            id: req.user._id,
            username: req.user.username
        },
        courseName: req.body.round.course,
        holes: {
            holeNumber: req.body.round.holeNumber,
            par: req.body.round.par,
            teeShotClub: req.body.round.teeShotClub,
            teeShotLength: req.body.round.teeShotLength,
            teeShotDirection: req.body.round.teeShotDirection,
            teeShotResult: req.body.round.teeShotResult,
            approachToGreen: approachToGreen,
            approachClub: req.body.round.approachClub,
            approachLength: req.body.round.approachLength,
            approachDirection: req.body.round.approachDirection,
            approachResult: req.body.round.approachResult,
            putts: req.body.round.putts,
            score: req.body.round.score
        },
        loadDate: Date.now()
        
    };
    
    console.log(roundKey);
    
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
                                newRound.course.push(foundCourse._id);
                                newRound.save(function(err, data){  
                                    if(err){
                                        console.log(err);
                                    } else {
                                        //console.log("found course: " + data);
                                    }
                                });
                            }
                        });
                    }
                }); 
            } else {
                //found round
                //push new hole
                foundRound.holes.push(newRound.holes);
                foundRound.save(function(err, data){  
                    if(err){
                        console.log(err);
                    } else {
                        //console.log("found course: " + data);
                    }
                });
                console.log("found round");
            }
        }
    });
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

// //SHOW - shows more info about one campground
// router.get("/:id", function(req, res) {
//     //find the campground with id and render show page with the campground
//     Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
//       if(err){
//           console.log(err);
//       } else {
//           console.log(foundCampground);
//           res.render("campgrounds/show", {campground: foundCampground});
//       }
//     });
// });

// function isLoggedIn(req, res, next){
//     if(req.isAuthenticated()){
//         return next();
//     }
//     res.redirect("/login");
// }

module.exports = router;