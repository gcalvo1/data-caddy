var mongoose = require("mongoose");
var Round = require("./models/round");
var Course = require("./models/course");

var roundData = [
    {
        date: "2018-01-19",
        isFull: true,
        username: "georgecalvo@georgecalvo.com",
        courseName: "Bethpage Red",
        holes: [
            {
                holeNumber: 1,
                fir: true,
                gir: false,
                putts: 2,
                score: 5,
            },
            {
                holeNumber: 2,
                fir: false,
                gir: true,
                putts: 2,
                score: 4,
            }
        ]
    },
    {
        date: "2018-01-20",
        isFull: true,
        username: "georgecalvo@georgecalvo.com",
        courseName: "Bethpage Blue",
        holes: [
            {
                holeNumber: 1,
                fir: true,
                gir: true,
                putts: 2,
                score: 4,
            },
            {
                holeNumber: 2,
                fir: false,
                gir: false,
                putts: 2,
                score: 6,
            }
        ]
    }
];

var courseData = [
    {
        name: "Bethpage Blue",
        zip: 11735,
        img: "http://4.bp.blogspot.com/-UMIFpbHhJCU/UDffZEyhE1I/AAAAAAAAEi0/L20yVaX-lMU/s1600/redlogo.gif",
        isNine: true,
        holes: [
            {
                number: 1,
                par: 4,
                yardage: {
                    red: 350,
                    white: 380,
                    blue: 400,
                }
            },
            {
                number: 2,
                par: 4,
                yardage: {
                    red: 400,
                    white: 420,
                    blue: 450,
                }
            },
            {
                number: 3,
                par: 3,
                yardage: {
                    red: 170,
                    white: 180,
                    blue: 200,
                }
            }
        ]
    },
    {
        name: "Bethpage Red",
        zip: 11735,
        img: "http://4.bp.blogspot.com/-UMIFpbHhJCU/UDffZEyhE1I/AAAAAAAAEi0/L20yVaX-lMU/s1600/redlogo.gif",
        isNine: false,
        holes: [
            {
                number: 1,
                par: 4,
                yardage: {
                    red: 420,
                    white: 440,
                    blue: 460
                }
            },
            {
                number: 2,
                par: 4,
                yardage: {
                    red: 380,
                    white: 390,
                    blue: 400,
                }
            },
            {
                number: 3,
                par: 4,
                yardage: {
                    red: 370,
                    white: 380,
                    blue: 390,
                }
            },
            {
                number: 4,
                par: 3,
                yardage: {
                    red: 150,
                    white: 175,
                    blue: 190,
                }
            }
        ]
    },
    {
        name: "Bethpage Green",
        zip: 11735,
        img: "http://4.bp.blogspot.com/-UMIFpbHhJCU/UDffZEyhE1I/AAAAAAAAEi0/L20yVaX-lMU/s1600/redlogo.gif",
        isNine: false,
        tees: [],
        holes: [
            {
                number: 1,
                par: 4,
                yardage: {
                    red: 338,
                    white: 345,
                    blue: 360
                }
            },
            {
                number: 2,
                par: 4,
                yardage: {
                    red: 357,
                    white: 367,
                    blue: 380,
                }
            },
            {
                number: 3,
                par: 3,
                yardage: {
                    red: 115,
                    white: 133,
                    blue: 159,
                }
            },
            {
                number: 4,
                par: 4,
                yardage: {
                    red: 334,
                    white: 344,
                    blue: 374,
                }
            },
            {
                number: 5,
                par: 4,
                yardage: {
                    red: 376,
                    white: 387,
                    blue: 400,
                }
            },
            {
                number: 6,
                par: 3,
                yardage: {
                    red: 169,
                    white: 186,
                    blue: 190,
                }
            },
            {
                number: 7,
                par: 5,
                yardage: {
                    red: 485,
                    white: 500,
                    blue: 507,
                }
            },
            {
                number: 8,
                par: 4,
                yardage: {
                    red: 329,
                    white: 337,
                    blue: 349,
                }
            },
            {
                number: 9,
                par: 5,
                yardage: {
                    red: 515,
                    white: 532,
                    blue: 560,
                }
            },
            {
                number: 10,
                par: 4,
                yardage: {
                    red: 290,
                    white: 328,
                    blue: 369,
                }
            },
            {
                number: 11,
                par: 3,
                yardage: {
                    red: 148,
                    white: 175,
                    blue: 184,
                }
            },
            {
                number: 12,
                par: 4,
                yardage: {
                    red: 268,
                    white: 279,
                    blue: 302,
                }
            },
            {
                number: 13,
                par: 5,
                yardage: {
                    red: 494,
                    white: 553,
                    blue: 574,
                }
            },
            {
                number: 14,
                par: 4,
                yardage: {
                    red: 341,
                    white: 352,
                    blue: 401,
                }
            },
            {
                number: 15,
                par: 3,
                yardage: {
                    red: 165,
                    white: 180,
                    blue: 221,
                }
            },
            {
                number: 16,
                par: 4,
                yardage: {
                    red: 334,
                    white: 343,
                    blue: 376,
                }
            },
            {
                number: 17,
                par: 4,
                yardage: {
                    red: 400,
                    white: 408,
                    blue: 418,
                }
            },
            {
                number: 18,
                par: 4,
                yardage: {
                    red: 368,
                    white: 386,
                    blue: 398,
                }
            }
        ]
    }
];

// function seedDB(){
//     //Remove all rounds
//     Round.remove({}, function(err){
//         if(err){
//             console.log(err);     
//         }
//         //console.log("removed rounds!");
//         //Add a few campgrounds
//         roundData.forEach(function(seed){
//             Round.create(seed, function(err, round){
//               if(err){
//                   console.log(err);
//               } else {
//                     //Insert Course ID
//                     Course.findOne({name: round.courseName}, function(err, foundCourse){
//                         if(err){
//                             console.log(err);
//                         } else {
//                             round.course.push(foundCourse._id);
//                             round.save(function(err, data){  
//                                 if(err){
//                                     console.log(err);
//                                 } else {
//                                     //console.log("found course: " + data);
//                                 }
//                             });
//                         }
//                     });    
//                 }
//             });
//         });
//     });
// };

//     //Remove all courses
function seedDB(){
    Course.remove({}, function(err){
        if(err){
            console.log(err);     
        }
        console.log("removed courses!");
        //Add a few campgrounds
        courseData.forEach(function(seed){
            Course.create(seed, function(err, course){
              if(err){
                  console.log(err);
              } else {
                  console.log("Added a course");
                  
                }
            });
        });
    });
}

module.exports = seedDB;