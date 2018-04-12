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
var sgMail = require('@sendgrid/mail');
var randomstring = require("randomstring");
var middleware = require("../middleware");

var s3Bucket = new AWS.S3({ params: {Bucket: 'data-caddy-profile-pics'} });

//Route route
router.get("/", function(req,res){
    if(req.user){
        var urlParams = {Bucket: 'data-caddy-profile-pics', Key: req.user.username + req.user.imgExt};
        s3Bucket.getSignedUrl('getObject', urlParams, function(err, url){
            res.render("landing",{userImg: url});
        });
      } else {
          res.render("landing",{userImg: null});  
      }
});

//==================Auth Routes==========================
router.get("/register", function(req, res){
    res.render("register");
});

router.post("/register", function(req, res){
    var hasImg = false,
        fileInfo = "",
        imgExt = "";
    const upload = multer({
        storage: multerS3({
            s3: s3Bucket,
            bucket: 'data-caddy-profile-pics',
            acl: 'public-read',
            key: function (request, file, cb) {
              fileInfo = file;
              cb(null, req.body.username + path.extname(file.originalname));
            }
        }),
        fileFilter: function (req, file, cb) {
          var filetypes = /png|jpg|jpeg|gif/;
          var mimetype = filetypes.test(file.mimetype);
          var extname = filetypes.test(path.extname(file.originalname).toLowerCase());
      
          if (mimetype && extname) {
            return cb(null, true);
          }
          cb("Error: File upload only supports the following filetypes - " + filetypes);
          req.flash('error', 'Error: File upload only supports the following filetypes - jpg, jpeg, png, gif');
          res.redirect("/register");
        },
        limits: {fileSize: 1024 * 1024 * 1024}
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
                    var verification_token = randomstring.generate({
                            length: 64
                        });
                    if(fileInfo){
                      hasImg = true;  
                      imgExt = path.extname(fileInfo.originalname);
                    }
                    var newUser = new User(
                                            {
                                                username: req.body.username,
                                                email: req.body.email,
                                                name: req.body.name,
                                                hasImg: hasImg,
                                                imgExt: imgExt,
                                                emailConfirmationToken: verification_token,
                                                emailConfirmed: false,
                                                role: "user",
                                                signUpDate: Date.now(),
                                                bag: [
                                                        {
                                                            club: "Driver",
                                                            nickName: "Driver",
                                                            category: "Woods",
                                                            sort: 1,
                                                            inBag: true
                                                        },
                                                        {
                                                            club: "3 Wood",
                                                            nickName: "3W",
                                                            category: "Woods",
                                                            sort: 2,
                                                            inBag: true
                                                        },
                                                        {
                                                            club: "5 Wood",
                                                            nickName: "5W",
                                                            category: "Woods",
                                                            sort: 3,
                                                            inBag: true
                                                        },
                                                        {
                                                            club: "7 Wood",
                                                            nickName: "7W",
                                                            category: "Woods",
                                                            sort: 4,
                                                            inBag: false
                                                        },
                                                        {
                                                            club: "2 Hybrid",
                                                            nickName: "2H",
                                                            category: "Hybrids",
                                                            sort: 5,
                                                            inBag: false
                                                        },
                                                        {
                                                            club: "3 Hybrid",
                                                            nickName: "3H",
                                                            category: "Hybrids",
                                                            sort: 6,
                                                            inBag: false
                                                        },
                                                        {
                                                            club: "4 Hybrid",
                                                            nickName: "4H",
                                                            category: "Hybrids",
                                                            sort: 7,
                                                            inBag: false
                                                        },
                                                        {
                                                            club: "Rescue",
                                                            nickName: "Rescue",
                                                            category: "Hybrids",
                                                            sort: 8,
                                                            inBag: false
                                                        },
                                                        {
                                                            club: "2 Iron",
                                                            nickName: "2I",
                                                            category: "Irons",
                                                            sort: 9,
                                                            inBag: false
                                                        },
                                                        {
                                                            club: "3 Iron",
                                                            nickName: "3I",
                                                            category: "Irons",
                                                            sort: 10,
                                                            inBag: false
                                                        },
                                                        {
                                                            club: "4 Iron",
                                                            nickName: "4I",
                                                            category: "Irons",
                                                            sort: 11,
                                                            inBag: true
                                                        },
                                                        {
                                                            club: "5 Iron",
                                                            nickName: "5I",
                                                            category: "Irons",
                                                            sort: 12,
                                                            inBag: true
                                                        },
                                                        {
                                                            club: "6 Iron",
                                                            nickName: "6I",
                                                            category: "Irons",
                                                            sort: 13,
                                                            inBag: true
                                                        },
                                                        {
                                                            club: "7 Iron",
                                                            nickName: "7I",
                                                            category: "Irons",
                                                            sort: 14,
                                                            inBag: true
                                                        },
                                                        {
                                                            club: "8 Iron",
                                                            nickName: "8I",
                                                            category: "Irons",
                                                            sort: 15,
                                                            inBag: true
                                                        },
                                                        {
                                                            club: "9 Iron",
                                                            nickName: "9I",
                                                            category: "Irons",
                                                            sort: 16,
                                                            inBag: true
                                                        },
                                                        {
                                                            club: "Pitching Wedge",
                                                            nickName: "PW",
                                                            category: "Wedges",
                                                            sort: 17,
                                                            inBag: true
                                                        },
                                                        {
                                                            club: "Gap Wedge",
                                                            nickName: "GW",
                                                            category: "Wedges",
                                                            sort: 18,
                                                            inBag: true
                                                        },
                                                        {
                                                            club: "Sand Wedge",
                                                            nickName: "SW",
                                                            category: "Wedges",
                                                            sort: 19,
                                                            inBag: true
                                                        },
                                                        {
                                                            club: "Lob Wedge",
                                                            nickName: "LW",
                                                            category: "Wedges",
                                                            sort: 20,
                                                            inBag: true
                                                        },
                                                ]
                                            });
                    User.register(newUser, req.body.password, function(err, user){
                        if(err){
                            console.log(err);
                            req.flash("error", err.message);
                            return res.redirect("register");
                        }
                        passport.authenticate("local")(req, res, function(){
                            sgMail.setApiKey(process.env.SGMAILAPIKEY);
                            const msg = {
                              to: user.email,
                              from: 'noreply@mydatacaddy.com',
                              subject: 'DataCaddy Email Confirmation',
                              text: 'Welcome to DataCaddy!\n\n' +
                                    'You are receiving this because you signed up for DataCaddy.\n\n' +
                                    'Please click on the following link, or paste this into your browser to confirm your email to complete the process:\n\n' +
                                    'http://' + req.headers.host + '/confirm/' + user.emailConfirmationToken + '\n\n' +
                                    'If you did not request this, please ignore this email.\n'
                            };
                            sgMail.send(msg, function(err){
                                if(err){
                                    console.log(err);
                                } 
                            });
                            req.flash("success", "Welcome to DataCaddy " + user.username + "! Please remember to verify your email address.");
                            res.redirect("/dashboard#summary");   
                        });
                    });
                }
            });
        }
    });
});

router.get('/confirm/:emailConfirmationToken', function (req, res) {
    User.findOne({ emailConfirmationToken: req.params.emailConfirmationToken }, function(err, user) {
        if(err) {
          req.flash("error", "Verification Failed");
          res.redirect("/");   
        } else {
            User.findOneAndUpdate({emailConfirmationToken: req.params.emailConfirmationToken}, {emailConfirmed: true}, function (err, resp) {
                if(err){
                    console.log(err);
                } else {
                    req.flash("success", "Email Verified");
                    res.redirect('/');
                }
            });
        }
    });
});

router.get("/resend-verification", function (req, res) {
  User.findOne({email: req.user.email }, function(err, user) {
    if(err){
      console.log(err);
      req.flash("error", "Verification email could not be sent.");
      res.redirect('/profile');
    } else {
        sgMail.setApiKey(process.env.SGMAILAPIKEY);
        const msg = {
          to: user.email,
          from: 'noreply@mydatacaddy.com',
          subject: 'DataCaddy Email Confirmation',
          text: 'Hello '+user.name+',\n\n' +
                'Welcome to DataCaddy!\n\n' +
                'You are receiving this because you signed up for DataCaddy.\n\n' +
                'Please click on the following link, or paste this into your browser to confirm your email to complete the process:\n\n' +
                'http://' + req.headers.host + '/confirm/' + user.emailConfirmationToken + '\n\n' +
                'If you did not request this, please ignore this email.\n'
        };
        sgMail.send(msg, function(err){
          if(err){
              console.log(err);
          } 
        });
        req.flash("success", "Verification Email Sent to: " + user.email);
        res.redirect('/profile');
      }
  });
});

//Handle login logic
router.post("/", passport.authenticate("local", 
    {
        successRedirect: "/dashboard#summary",
        failureRedirect: "/",
        failureFlash: true
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
          res.redirect('/forgot');
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
          from: 'noreply@mydatacaddy.com',
          subject: 'DataCaddy Password Reset',
          text: 'Hello '+user.name+',\n\n' +
          'You are receiving this because you requested the reset of the password for your account.\n\n' +
          'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
          'http://' + req.headers.host + '/reset/' + token + '\n\n' +
          'If you did not request this, please ignore this email and your password will remain unchanged.\n'
        };
        sgMail.send(msg, function(err){
            if(err){
                console.log(err);
            } else {
                req.flash('success', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
                res.redirect('/forgot');
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
      res.redirect('/forgot');
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
          res.redirect('back');
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
          from: 'noreply@mydatacaddy.com',
          subject: 'Your password has been changed',
          text: 'Hello '+user.name+',\n\n' +
          'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
        };
        sgMail.send(msg, function(err){
            if(err){
                console.log(err);
            } else {
                req.flash('success', 'Success! Your password has been changed.');
                res.redirect('/');
            }
        });
    }
  ], function(err) {
    res.redirect('/');
  });
});

//User Profile Route
router.get("/profile", middleware.isLoggedIn, function(req, res){
    var s3Bucket = new AWS.S3({ params: {Bucket: 'data-caddy-profile-pics'} });
    var urlParams = {Bucket: 'data-caddy-profile-pics', Key: req.user.username + req.user.imgExt};
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
        }),
        fileFilter: function (req, file, cb) {
          var filetypes = /png|jpg|jpeg|gif/;
          var mimetype = filetypes.test(file.mimetype);
          var extname = filetypes.test(path.extname(file.originalname).toLowerCase());
      
          if (mimetype && extname) {
            return cb(null, true);
          }
          cb("Error: File upload only supports the following filetypes - " + filetypes);
          req.flash('error', 'Error: File upload only supports the following filetypes - jpg, jpeg, png, gif');
          res.redirect("/profile");
        },
        limits: {fileSize: 1024 * 1024 * 1024}
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
                      user.imgExt = path.extname(fileInfo.originalname);
                      if(!user.hasImg){
                        user.hasImg = true;
                      } else {
                         var params = {
                            Bucket: "data-caddy-profile-pics", 
                            Key: req.user.username+req.user.imgExt
                         };
                         s3.deleteObject(params, function(err, data) {
                           if (err) console.log(err, err.stack); // an error occurred
                         });
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

router.post("/clubs", middleware.isLoggedIn, function(req, res){
  var clubList = req.body.clubList;
  clubList.forEach(function(club){
    var conditions = { 'bag.club': club.club, email: req.user.email }
      , update = { $set: { 'bag.$.inBag': club.inBag }}
      , options = { multi: false };
    User.update(conditions, update, options, function(err, updated){
      if(err){
        console.log(err);
      } else {
          res.end();
      }
    });
  });
});

module.exports = router;