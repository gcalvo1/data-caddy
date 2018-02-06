var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");
var AWS = require('aws-sdk');

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
                                name: req.body.name,
                                role: "user",
                                signUpDate: Date.now()
                            });
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            req.flash("error", err.message);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "Welcome to DataCaddy " + user.username);
            res.redirect("/dashboard");   
        });
    });
});

//Handle login logic
router.post("/", passport.authenticate("local", 
    {
        successRedirect: "/rounds",
        failureRedirect: "/"
    }), function(req, res){
});

//Logout Route
router.get("/logout", function(req, res){
   req.logout();
   req.flash("success", "Logged Out");
   res.redirect("/");
});

module.exports = router;