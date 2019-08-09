var mongoose = require("mongoose");

var courseSchema = new mongoose.Schema({
    name: String,
    location: {
        country: String,
        state: String,
        city: String,
        zip: Number,
        latitude: Number,
        longitude: Number
    },
    img: String,
    s3Img: String,
    isNine: Boolean,
    isNineOnly: Boolean,
    holes: [
        {
            number: Number,
            par: Number,
            handicap: Number,
            yardage: {
                red: Number,
                white: Number,
                blue: Number,
                black: Number,
                yellow: Number,
                gold: Number,
                green: Number,
                silver: Number
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