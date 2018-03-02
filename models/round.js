var mongoose = require("mongoose");

var roundSchema = new mongoose.Schema({
    date: Date,
    isFull: Boolean,
    isComplete: Boolean,
    roundType: String,
    courseName: String,
    tees: String,
    weather: {
        summary: String,
        icon: String,
        precipIntensity: Number,
        precipProbability: Number,
        temperature: Number,
        apparentTemperature: Number,
        dewPoint: Number,
        humidity: Number,
        pressure: Number,
        windSpeed: Number,
        windGust: Number,
        windBearing: Number,
        cloudCover: Number,
        uvIndex: Number,
        visibility: Number
    },
    course: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course"
        }
    ],
    player: {
      id: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User"
      },
      username: String
    },
    holes: [
        {
            holeNumber: Number,
            par: Number,
            teeShot: {
                teeShotClub: String,
                teeShotLength: Number,
                teeShotDirection: String,
                teeShotResult: String
            },
            approach: {
                approachToGreen: Boolean,
                approachClub: String,
                approachLength: Number,
                approachDirection: String,
                approachResult: String
            },
            putts: Number,
            score: Number,
        }
    ],
    loadDate: Date
});

module.exports = mongoose.model("Round", roundSchema);