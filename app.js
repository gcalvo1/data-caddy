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
    busboy = require('connect-busboy'),
    seedDB = require("./seeds");
    
    
//Requiring routes    
var roundRoutes = require("./routes/rounds"),
    indexRoutes = require("./routes/index"),
    dashboardRoutes = require("./routes/dashboard");

mongoose.connect("mongodb://localhost/data_caddy");
app.use(bodyParser.urlencoded({extended: true, uploadDir:'./uploads'}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public")); 
app.use(methodOverride("_method"));
app.use(flash());
// seedDB();

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

// app.get("/userimg", function(req, res){
//     var s3Bucket = new AWS.S3({ params: {Bucket: 'data-caddy-profile-pics'} });
//         var urlParams = {Bucket: 'data-caddy-profile-pics', Key: req.user.username + '.jpg'};
//         s3Bucket.getSignedUrl('getObject', urlParams, function(err, url){
//             if(err){
//                 console.log(err);
//             } else {
//                 res.send({userImg: url});
//             }
//         });
// });



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