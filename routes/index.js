var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");
var AWS = require('aws-sdk');
var multer  = require('multer');
var multerS3 = require('multer-s3');
var path = require("path");

AWS.config.loadFromPath('./s3_config.json');
var s3 = new AWS.S3();

//Route route
router.get("/", function(req,res){
    res.render("landing");
});

//==================Auth Routes==========================
router.get("/register", function(req, res){
    res.render("register");
});

router.post("/register", function(req, res){
    var hasImg = false;
    const upload = multer({
        storage: multerS3({
            s3: s3,
            bucket: 'data-caddy-profile-pics',
            acl: 'public-read',
            key: function (request, file, cb) {
              cb(null, req.body.username + path.extname(file.originalname));
            }
        })
    }).array('imgFile', 1);
    
    upload(req, res, function (error) {
        if (error) {
          console.log(error);
        } else {
            hasImg = true;
            var newUser = new User(
                                    {
                                        username: req.body.username,
                                        email: req.body.email,
                                        name: req.body.name,
                                        hasImg: hasImg,
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
        }
    });
});

//Handle login logic
router.post("/", passport.authenticate("local", 
    {
        successRedirect: "/dashboard",
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