var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var UserSchema = new mongoose.Schema({
    username: String,
    name: String,
    email: String,
    password: String,
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    emailConfirmationToken: String,
    emailConfirmed: Boolean,
    hasImg: Boolean,
    imgExt: String,
    role: String,
    signUpDate: Date,
    bag:[
            {
                club: String,
                nickName: String,
                category: String,
                sort: Number,
                inBag: Boolean,
            }
    ]
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);