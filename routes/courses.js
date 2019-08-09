var express = require("express");
var router = express.Router();
var Course = require("../models/course");
var middleware = require("../middleware");
var AWS = require('aws-sdk');

var s3Bucket = new AWS.S3({ params: {Bucket: 'data-caddy-profile-pics'} });
var courseS3Bucket = new AWS.S3({ params: {Bucket: 'data-caddy-course-pics'} });

router.get("/", middleware.isLoggedIn, function(req, res){
    courseS3Bucket.listObjects(function (err, courseImgs) {
        if (err) {
            console.log(err);
        } else {
            Course.find({}).lean().exec(function(err, courses){
                if(err){
                    console.log(err);
                } else {
                    courses.forEach(function(course) {                        
                        courseImgs.Contents.forEach(function(courseImg) {
                            if(course.img.replace('../img/','') == courseImg.Key){
                                var courseUrlParams = {Bucket: 'data-caddy-course-pics', Key: courseImg.Key};
                                courseS3Bucket.getSignedUrl('getObject', courseUrlParams, function(err, url){
                                    console.log("match");
                                    course['s3ImgUrl'] = url;
                                    console.log(course);
                                });
                            }                            
                        });
                    });            
                    var urlParams = {Bucket: 'data-caddy-profile-pics', Key: req.user.username + req.user.imgExt};
                    s3Bucket.getSignedUrl('getObject', urlParams, function(err, url){                        
                        console.log('profile');
                        res.render("courses/index",{courses:courses,userImg: url});
                    });
                }
            });
        }
    });    
});

//CREATE
router.post("/", middleware.isLoggedIn, middleware.emailVerified, middleware.isAdmin, function(req, res){
    var isNine = false,
    isNineOnly = false;
    if(req.body.course.isNine == ""){
        isNine = true;
    }
    if(req.body.course.isNineOnly == ""){
        isNineOnly = true;
    }
    
    
    //Create tees array
    var found = true,
        count = 1,
        tees = [];
    while(found){
        if(eval("req.body.course.color_" + count)){
            tees.push({
                color: eval("req.body.course.color_" + count),
                rating: eval("req.body.course.rating_" + count),
                slope: eval("req.body.course.slope_" + count)
            });
            count++;
        } else {
            found = false;
        }        
    }
    
    //Create holes array
    var num_holes = 18,
        holes = [];
    if(isNineOnly){
        num_holes = 9;
    }
    for(var i=1;i<=num_holes;i++){
        var teeFound = true,
            teeCount = 1,
            yardage = {};
        while(teeFound){
            if(eval("req.body.course.tee_label_" + teeCount)){
                yardage[eval("req.body.course.tee_label_" + teeCount)] = eval("req.body.course.yardage_" + teeCount + "[" + i + "-1]");
                teeCount++;
            } else {
                teeFound = false;
            }        
        }
        
        holes.push({
            number: i,
            par: eval("req.body.course.par_" + i),
            handicap: eval("req.body.course.handicap_" + i),
            yardage: yardage
        });
    }
    
    var img = "../img/" + req.body.course.name.split(' ').join('_') + "-Logo.png",
    newCourse = {
        name: req.body.course.name,
        location: {
          country: req.body.course.country,
          state: req.body.course.state,
          city: req.body.course.city,  
          zip: req.body.course.zip,
          latitude: req.body.course.latitude,
          longitude: req.body.course.longitude
        },
        img: img,
        isNine: isNine,
        isNineOnly: isNineOnly,
        tees: tees,
        holes: holes,
        loadDate: Date.now()
    };
    
    Course.create(newCourse, function(err, newCourse){
        if(err){
            console.log(err);
        } else {
            newCourse.save(function(err, data){  
                if(err){
                    console.log(err);
                } else {
                    res.redirect("/courses");
                }
            });
        } 
    });
});

router.get("/new", middleware.isLoggedIn, middleware.emailVerified, function(req, res){
    Course.find().exec(function(err, courses){
        if(err){
            console.log(err);
        } else {
            var urlParams = {Bucket: 'data-caddy-profile-pics', Key: req.user.username + req.user.imgExt};
            s3Bucket.getSignedUrl('getObject', urlParams, function(err, url){
                res.render("courses/new",{courses:courses, user: req.user, userImg: url}); 
            });
        }
    });
});

//SHOW
router.get("/:id", middleware.isLoggedIn, middleware.emailVerified, function(req, res) {
    Course.findById(req.params.id).exec(function(err, foundCourse){
      if(err){
          console.log(err);
      } else {
          var urlParams = {Bucket: 'data-caddy-profile-pics', Key: req.user.username + req.user.imgExt};
          s3Bucket.getSignedUrl('getObject', urlParams, function(err, url){
            res.render("courses/show", {course: foundCourse, user: req.user, userImg: url});
          });
      }
    });
});

//EDIT
router.get("/:id/edit", middleware.isLoggedIn, middleware.isAdmin, function(req, res) {
    Course.findById(req.params.id, function(err, foundCourse){
        if(err){
            console.log(err);
        } else {
                    var urlParams = {Bucket: 'data-caddy-profile-pics', Key: req.user.username + req.user.imgExt};
                    s3Bucket.getSignedUrl('getObject', urlParams, function(err, url){
                        res.render("courses/edit",{course: foundCourse, user:req.user, userImg: url}); 
                    });
                }
    });
});

//UPDATE
router.put("/:id", function(req, res){
    var isNine = false,
    isNineOnly = false;
    if(req.body.course.isNine == ""){
        isNine = true;
    }
    if(req.body.course.isNineOnly == ""){
        isNineOnly = true;
    }
    
    //Create tees array
    var found = true,
        count = 1,
        tees = [];
    while(found){
        if(eval("req.body.course.color_" + count)){
            tees.push({
                color: eval("req.body.course.color_" + count),
                rating: eval("req.body.course.rating_" + count),
                slope: eval("req.body.course.slope_" + count)
            });
            count++;
        } else {
            found = false;
        }        
    }
    
    //Create holes array
    var num_holes = 18,
        holes = [];
    if(isNineOnly){
        num_holes = 9;
    }
    for(var i=1;i<=num_holes;i++){
        var teeFound = true,
            teeCount = 1,
            yardage = {};
        while(teeFound){
            console.log(eval("req.body.course.tee_label_" + teeCount));
            console.log(eval("req.body.course.yardage_" + teeCount + "[" + i + "-1]"));
            if(eval("req.body.course.tee_label_" + teeCount)){
                yardage[eval("req.body.course.tee_label_" + teeCount)] = eval("req.body.course.yardage_" + teeCount + "[" + i + "-1]");
                teeCount++;
            } else {
                teeFound = false;
            }        
        }
        
        holes.push({
            number: i,
            par: eval("req.body.course.par_" + i),
            handicap: eval("req.body.course.handicap_" + i),
            yardage: yardage
        });
        
        console.log(yardage);
    }
    
    var img = "../img/" + req.body.course.name.split(' ').join('_') + "-Logo.png";
    
    var updateObj = {
        name: req.body.course.name,
        img: img,
        location: {
          country: req.body.course.country,
          state: req.body.course.state,
          city: req.body.course.city,  
          zip: req.body.course.zip,
          latitude: req.body.course.latitude,
          longitude: req.body.course.longitude
        },
        isNine: isNine,
        isNineOnly: isNineOnly,
        tees: tees,
        holes: holes,
        loadDate: Date.now()
    };
    
    Course.findByIdAndUpdate(req.body.id, updateObj, function(err, updatedCourse){
        if(err){
            res.redirect("/courses");
        } else {
            res.redirect("/courses");
        }
    });
});

//DESTROY
router.delete("/:id", middleware.isLoggedIn, middleware.emailVerified, middleware.isAdmin, function(req, res){
    Course.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/courses");    
        } else {
            res.redirect("/courses");
        }
    });
});

module.exports = router;