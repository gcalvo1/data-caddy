var Round = require("../models/round");

// all the middleare goes here
var middlewareObj = {};

middlewareObj.checkRoundOwnership = function(req, res, next) {
 if(req.isAuthenticated()){
        Round.findById(req.params.id, function(err, foundRound){
           if(err){
               req.flash("error","Round not found");
               res.redirect("back");
           }  else {
               // does user own the round?
            if(foundRound.player.id.equals(req.user._id)) {
                next();
            } else {
                
                req.flash("error", "You do not have permission to do that");
                res.redirect("back");
            }
           }
        });
    } else {
        req.flash("error","You need to be logged in to do that");
        res.redirect("back");
    }
};

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You need to be logged in to do that");
    res.redirect("back");
};

middlewareObj.emailVerified = function(req, res, next){
    if(req.isAuthenticated()){
        if(req.user.emailConfirmed){
            return next();
        } else {
            req.flash("error", "You must verify your email address to do that");
            res.redirect("back");
        }
    }
    req.flash("error", "You need to be logged in to do that");
    res.redirect("back");
};

middlewareObj.isAdmin = function(req, res, next){
    if(req.isAuthenticated()){
        if(req.user.role == "admin"){
            return next();
        } else {
            req.flash("error", "You must be an administrator to do that");
            res.redirect("back");
        }
    }
    req.flash("error", "You need to be logged in to do that");
    res.redirect("back");
};

module.exports = middlewareObj;