var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");
var AWS = require('aws-sdk');
var multer  = require('multer');
var multerS3 = require('multer-s3');
var path = require("path");
var async = require('async');
var crypto = require('crypto');
var nodemailer = require('nodemailer');
var sgMail = require('@sendgrid/mail');
var middleware = require("../middleware");

// AWS.config.loadFromPath('./s3_config.json');
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
    var fileInfo = "";
    const upload = multer({
        storage: multerS3({
            s3: s3,
            bucket: 'data-caddy-profile-pics',
            acl: 'public-read',
            key: function (request, file, cb) {
              fileInfo = file;
              cb(null, req.body.username + path.extname(file.originalname));
            }
        })
    }).array('imgFile', 1);
    
    
    
    upload(req, res, function (error) {
        if (error) {
          console.log(error);
        } else {
            User.findOne({ email: req.body.email } , function(err, user) {
                if(user){
                    req.flash("error", "Account with that email address already exists");
                    return res.redirect("register");
                }
                else {
                    if(fileInfo){
                      hasImg = true;  
                    }
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
                            return res.redirect("register");
                        }
                        passport.authenticate("local")(req, res, function(){
                            req.flash("success", "Welcome to DataCaddy " + user.username);
                            res.redirect("/dashboard");   
                        });
                    });
                }
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

router.get('/forgot', function(req, res) {
    res.render('forgot');
});

router.post('/forgot', function(req, res, next) {
  async.waterfall([
    function(done) {
      crypto.randomBytes(20, function(err, buf) {
        var token = buf.toString('hex');
        done(err, token);
      });
    },
    function(token, done) {
      User.findOne({ email: req.body.email }, function(err, user) {
        if (!user) {
          req.flash('error', 'No account with that email address exists.');
          return res.redirect('/forgot');
        }

        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

        user.save(function(err) {
          done(err, token, user);
        });
      });
    },
    function(token, user, done) {
        sgMail.setApiKey(process.env.SGMAILAPIKEY);
        const msg = {
          to: user.email,
          from: 'noreply@datacaddy.com',
          subject: 'Node.js Password Reset',
          text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
          'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
          'http://' + req.headers.host + '/reset/' + token + '\n\n' +
          'If you did not request this, please ignore this email and your password will remain unchanged.\n'
        };
        sgMail.send(msg, function(err){
            if(err){
                console.log(err);
            } else {
                req.flash('info', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
                done(err, 'done');
            }
        });
    }
  ], function(err) {
    if (err) return next(err);
    res.redirect('/forgot');
  });
});

router.get('/reset/:token', function(req, res) {
  User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
    if (!user) {
      req.flash('error', 'Password reset token is invalid or has expired.');
      return res.redirect('/forgot');
    }
    res.render('reset', {
      user: req.user
    });
  });
});

router.post('/reset/:token', function(req, res) {
  async.waterfall([
    function(done) {
      User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
        if (!user) {
          req.flash('error', 'Password reset token is invalid or has expired.');
          return res.redirect('back');
        }
        
        user.setPassword(req.body.password, function(){
            user.save();
        });
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        user.save(function(err) {
          req.logIn(user, function(err) {
            done(err, user);
          });
        });
      });
    },
    function(user, done) {
      sgMail.setApiKey(process.env.SGMAILAPIKEY);
        const msg = {
          to: user.email,
          from: 'noreply@datacaddy.com',
          subject: 'Your password has been changed',
          text: 'Hello,\n\n' +
          'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
        };
        sgMail.send(msg, function(err){
            if(err){
                console.log(err);
            } else {
                req.flash('success', 'Success! Your password has been changed.');
                done(err, 'done');
            }
        });
    }
  ], function(err) {
    res.redirect('/');
  });
});

//User Profile Route
router.get("/profile", middleware.isLoggedIn, function(req, res){
    // AWS.config.loadFromPath('./s3_config.json');
            
    var s3Bucket = new AWS.S3({ params: {Bucket: 'data-caddy-profile-pics'} });
    var urlParams = {Bucket: 'data-caddy-profile-pics', Key: req.user.username + '.jpg'};
    s3Bucket.getSignedUrl('getObject', urlParams, function(err, url){
        if(err){
            console.log(err);
        } else {
            res.render("profile",{
                user: req.user,
                userImg: url
            });
        }
    });
});

router.post("/profile", middleware.isLoggedIn, function(req, res){
    var fileInfo = "";
    const upload = multer({
        storage: multerS3({
            s3: s3,
            bucket: 'data-caddy-profile-pics',
            acl: 'public-read',
            key: function (request, file, cb) {
              fileInfo = file;
              cb(null, req.user.username + path.extname(file.originalname));
            }
        })
    }).array('imgFile', 1);
    
    upload(req, res, function (error) {
        if (error) {
          console.log(error);
        } else {
            User.findOne({ email: req.user.email } , function(err, user) {
                if(err) {
                  console.log(err);
                } else {
                    if(fileInfo){
                      if(!user.hasImg){
                        user.hasImg = true;
                      }
                      user.save(function(err) {
                        if(err){
                          console.log(err);
                        } else {
                        }
                        req.flash('success', 'Profile Picture Updated');
                        res.redirect("/profile");
                      });
                    } else {
                      res.redirect("/profile");
                    }
                }
            });
        }
    });
});

module.exports = router;