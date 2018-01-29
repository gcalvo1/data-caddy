var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    passport = require("passport"),
    Course = require("./models/course"),
    LocalStrategy = require("passport-local"),
    User = require("./models/user"),
    seedDB = require("./seeds")
    
//Requiring routes    
var roundRoutes = require("./routes/rounds"),
    indexRoutes = require("./routes/index")

mongoose.connect("mongodb://localhost/data_caddy");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public")); 
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
   //res.locals.error = req.flash("error");
   //res.locals.success = req.flash("success");
   next();
});

app.use("/", indexRoutes);
app.use("/rounds", roundRoutes);
// app.use("/campgrounds/:id/comments", commentRoutes);

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

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("The DataCaddy Server Has Started!");
});