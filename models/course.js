var mongoose = require("mongoose");

var courseSchema = new mongoose.Schema({
    name: String,
    location: {
        zip: Number,
        latitude: Number,
        longitude: Number
    },
    img: String,
    isNine: Boolean,
    holes: [
        {
            number: Number,
            par: Number,
            yardage: {
                red: Number,
                white: Number,
                blue: Number,
                black: Number
            }
        }
    ],
    tees: [
        {
            color: String,
            rating: Number,
            slope: Number
        }
    ]
});

module.exports = mongoose.model("Course", courseSchema);