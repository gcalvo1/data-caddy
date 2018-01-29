var mongoose = require("mongoose");

var roundSchema = new mongoose.Schema({
    date: Date,
    isFull: Boolean,
    roundType: String,
    username: String,
    courseName: String,
    tees: String,
    weather: {
        wind: Number,
        temp: Number,
        type: String
    },
    course: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course"
        }
    ],
    user: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    holes: [
        {
            holeNumber: Number,
            par: Number,
            teeShotClub: String,
            teeShotLength: Number,
            teeShotDirection: String,
            teeShotResult: String,
            approachToGreen: Boolean,
            approachClub: String,
            approachLength: Number,
            approachDirection: String,
            approachResult: String,
            putts: Number,
            score: Number,
        }
    ],
    loadDate: Date
});

module.exports = mongoose.model("Round", roundSchema);