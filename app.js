var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    flash = require("connect-flash"),
    methodOverride = require("method-override"),
    Course = require("./models/course"),
    Round = require("./models/round"),
    User = require("./models/user"),
    AWS = require('aws-sdk'),
    seedDB = require("./seeds");
    
//Requiring routes    
var roundRoutes = require("./routes/rounds"),
    indexRoutes = require("./routes/index"),
    dashboardRoutes = require("./routes/dashboard");

mongoose.connect("mongodb://localhost/data_caddy");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public")); 
app.use(methodOverride("_method"));
app.use(flash());
//seedDB();

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "This app is kewl dood",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   res.locals.error = req.flash("error");
   res.locals.success = req.flash("success");
   next();
});

app.use("/", indexRoutes);
app.use("/rounds", roundRoutes);
app.use("/dashboard", dashboardRoutes);

app.get('/coursedropdown', function(req, res){
    var courseSelect = req.query.course;
 
    Course.findOne({name: courseSelect}).exec(function(err, course){
        if(err){
            console.log(err);
        } else {
            res.send({course:course}); 
        }
    });
});

app.get('/roundkey', function(req, res){
    var isFull = false;
    if(req.query.numHoles === '18 Holes'){
        isFull = true;
    }
    
    var key = {
        courseName: req.query.course,
        isFull: isFull,
        date: req.query.date
    }
 
    Round.find(key).exec(function(err, round){
        if(err){
            console.log(err);
        } else {
            if(round == null){
                res.send(null);
            } else {
                res.send({round:round}); 
            }
        }
    });
});

app.get("/userimg", function(req, res){
    var s3Bucket = new AWS.S3({ params: {Bucket: 'data-caddy-profile-pics'} });
        var urlParams = {Bucket: 'data-caddy-profile-pics', Key: req.user.username + '.jpg'};
        s3Bucket.getSignedUrl('getObject', urlParams, function(err, url){
            if(err){
                console.log(err);
            } else {
                res.send({userImg: url});
            }
        });
});

app.get("/roundsdata", function(req, res){
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
                numScoreNames = {
                    par: 0,
                    bogey: 0,
                    birdie: 0,
                    doubleBogey: 0,
                    eagle: 0,
                    bogeyWorse: 0,
                    eagleBetter: 0
                },
                scoreByDate = [];
            rounds.forEach(function(round){
                var roundScore = 0,
                    roundPar = 0,
                    roundData = [];
                if(round.isFull){
                    numFullRounds++;
                    roundData.push(round.date);
                    round.holes.forEach(function(hole){
                        totalFullScore += hole.score;
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
                    });
                    roundData.push(roundScore);
                    scoreByDate.push(roundData);
                } else {
                    numNineRounds++;
                    round.holes.forEach(function(hole){
                        totalNineScore += hole.score;
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
                };
            res.send({rounds:rounds, avgScore, user: req.user, numScoreNames});
        }
    });
});

app.get("/mostrecentround", function(req, res){
    Round.find({"player.id": req.user._id}).sort({date:-1}).limit(1).populate("course").exec(function(err, mostRecentRound){
        if(err){
            console.log(err);
        } else {
            res.send({mostRecentRound: mostRecentRound});
        }
    });
});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("The DataCaddy Server Has Started!");
});