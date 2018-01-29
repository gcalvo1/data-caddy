var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");

//Route route
router.get("/", function(req,res){
    res.render("landing");
});


//==================Auth Routes==========================
router.get("/register", function(req, res){
    res.render("register");
});

router.post("/register", function(req, res){
    var newUser = new User(
                            {
                                username: req.body.username,
                                email: req.body.email,
                                role: "user",
                                signUpDate: Date.now()
                            });
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render('register');
        }
        passport.authenticate("local")(req, res, function(){
            res.redirect("/rounds");    
        });
    });
});

//Login Routes
router.get("/login", function(req, res){
    res.render("login");
});

// //Handle login logic
router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/rounds",
        failureRedirect: "/login"
    }), function(req, res){
});

//Logout Route
router.get("/logout", function(req, res){
    req.logout();
    res.redirect("/landing");
});

// //Middleware
// function isLoggedIn(req, res, next){
//     if(req.isAuthenticated()){
//         return next();
//     }
//     res.redirect("/login");
// }

module.exports = router;