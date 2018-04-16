var mongoose = require("mongoose");
var Round = require("./models/round");
var Course = require("./models/course");

// var roundData = [
//     {
//         date: "2018-01-19",
//         isFull: true,
//         isNineOnly: false,
//         username: "georgecalvo@georgecalvo.com",
//         courseName: "Bethpage Red",
//         holes: [
//             {
//                 holeNumber: 1,
//                 fir: true,
//                 gir: false,
//                 putts: 2,
//                 score: 5,
//             },
//             {
//                 holeNumber: 2,
//                 fir: false,
//                 gir: true,
//                 putts: 2,
//                 score: 4,
//             }
//         ]
//     },
//     {
//         date: "2018-01-20",
//         isFull: true,
//         username: "georgecalvo@georgecalvo.com",
//         courseName: "Bethpage Blue",
//         holes: [
//             {
//                 holeNumber: 1,
//                 fir: true,
//                 gir: true,
//                 putts: 2,
//                 score: 4,
//             },
//             {
//                 holeNumber: 2,
//                 fir: false,
//                 gir: false,
//                 putts: 2,
//                 score: 6,
//             }
//         ]
//     }
// ];

var courseData = [
    // {
    //     name: "Bethpage Blue",
    //     location : { 
    //         zip : 11735 ,
    //         latitude : 40.7415284, 
    //         longitude : -73.4674193, 
    //     },
    //     img: "../img/Bethpage-Blue-Logo.png",
    //     isNine: true,
    //     isNineOnly: false,
    //     tees: [{
    //         color: 'Red',
    //         rating: 72,
    //         slope: 118,
    //     },
    //     {
    //         color: 'White',
    //         rating: 70.9,
    //         slope: 122,
    //     },
    //     {
    //         color: 'Blue',
    //         rating: 71.7,
    //         slope: 124,
    //     }],
    //     holes: [
    //         {
    //             number: 1,
    //             par: 4,
    //             handicap: 7,
    //             yardage: {
    //                 red: 379,
    //                 white: 397,
    //                 blue: 417,
    //             }
    //         },
    //         {
    //             number: 2,
    //             par: 4,
    //             handicap: 3,
    //             yardage: {
    //                 red: 433,
    //                 white: 441,
    //                 blue: 451,
    //             }
    //         },
    //         {
    //             number: 3,
    //             par: 3,
    //             handicap: 15,
    //             yardage: {
    //                 red: 166,
    //                 white: 180,
    //                 blue: 195,
    //             }
    //         },
    //         {
    //             number: 4,
    //             par: 5,
    //             handicap: 13,
    //             yardage: {
    //                 red: 467,
    //                 white: 479,
    //                 blue: 493,
    //             }
    //         },
    //         {
    //             number: 5,
    //             par: 4,
    //             handicap: 17,
    //             yardage: {
    //                 red: 282,
    //                 white: 298,
    //                 blue: 306,
    //             }
    //         },
    //         {
    //             number: 6,
    //             par: 4,
    //             handicap: 1,
    //             yardage: {
    //                 red: 427,
    //                 white: 446,
    //                 blue: 462,
    //             }
    //         },
    //         {
    //             number: 7,
    //             par: 3,
    //             handicap: 9,
    //             yardage: {
    //                 red: 165,
    //                 white: 175,
    //                 blue: 186,
    //             }
    //         },
    //         {
    //             number: 8,
    //             par: 5,
    //             handicap: 5,
    //             yardage: {
    //                 red: 537,
    //                 white: 545,
    //                 blue: 555,
    //             }
    //         },
    //         {
    //             number: 9,
    //             par: 4,
    //             handicap: 11,
    //             yardage: {
    //                 red: 337,
    //                 white: 348,
    //                 blue: 360,
    //             }
    //         },
    //         {
    //             number: 10,
    //             par: 4,
    //             handicap: 16,
    //             yardage: {
    //                 red: 345,
    //                 white: 362,
    //                 blue: 381,
    //             }
    //         },
    //         {
    //             number: 11,
    //             par: 3,
    //             handicap: 14,
    //             yardage: {
    //                 red: 171,
    //                 white: 178,
    //                 blue: 187,
    //             }
    //         },
    //         {
    //             number: 12,
    //             par: 5,
    //             handicap: 10,
    //             yardage: {
    //                 red: 454,
    //                 white: 463,
    //                 blue: 473,
    //             }
    //         },
    //         {
    //             number: 13,
    //             par: 4,
    //             handicap: 18,
    //             yardage: {
    //                 red: 321,
    //                 white: 347,
    //                 blue: 362,
    //             }
    //         },
    //         {
    //             number: 14,
    //             par: 4,
    //             handicap: 8,
    //             yardage: {
    //                 red: 347,
    //                 white: 372,
    //                 blue: 383,
    //             }
    //         },
    //         {
    //             number: 15,
    //             par: 4,
    //             handicap: 2,
    //             yardage: {
    //                 red: 356,
    //                 white: 371,
    //                 blue: 387,
    //             }
    //         },
    //         {
    //             number: 16,
    //             par: 5,
    //             handicap: 4,
    //             yardage: {
    //                 red: 481,
    //                 white: 490,
    //                 blue: 501,
    //             }
    //         },
    //         {
    //             number: 17,
    //             par: 3,
    //             handicap: 6,
    //             yardage: {
    //                 red: 150,
    //                 white: 163,
    //                 blue: 175,
    //             }
    //         },
    //         {
    //             number: 18,
    //             par: 4,
    //             handicap: 12,
    //             yardage: {
    //                 red: 340,
    //                 white: 351,
    //                 blue: 364,
    //             }
    //         },
    //     ]
    // },
    // {
    //     name: "Bethpage Black",
    //     location : { 
    //         zip : 11735 ,
    //         latitude : 40.743849,
    //         longitude : -73.45207, 
    //     },
    //     img: "../img/Bethpage-Black-Logo.jpg",
    //     isNine: false,
    //     isNineOnly: false,
    //     tees: [{
    //         color: 'Red',
    //         rating: 77,
    //         slope: 152,
    //     },
    //     {
    //         color: 'White',
    //         rating: 73.8,
    //         slope: 135,
    //     },
    //     {
    //         color: 'Blue',
    //         rating: 78.1,
    //         slope: 152,
    //     }],
    //     holes: [
    //         {
    //             number: 1,
    //             par: 4,
    //             handicap: 8,
    //             yardage: {
    //                 red: 426,
    //                 white: 429,
    //                 blue: 430,
    //             }
    //         },
    //         {
    //             number: 2,
    //             par: 4,
    //             handicap: 16,
    //             yardage: {
    //                 red: 346,
    //                 white: 354,
    //                 blue: 389,
    //             }
    //         },
    //         {
    //             number: 3,
    //             par: 3,
    //             handicap: 18,
    //             yardage: {
    //                 red: 128,
    //                 white: 158,
    //                 blue: 230,
    //             }
    //         },
    //         {
    //             number: 4,
    //             par: 5,
    //             handicap: 2,
    //             yardage: {
    //                 red: 438,
    //                 white: 461,
    //                 blue: 517,
    //             }
    //         },
    //         {
    //             number: 5,
    //             par: 4,
    //             handicap: 4,
    //             yardage: {
    //                 red: 401,
    //                 white: 423,
    //                 blue: 478,
    //             }
    //         },
    //         {
    //             number: 6,
    //             par: 4,
    //             handicap: 10,
    //             yardage: {
    //                 red: 376,
    //                 white: 386,
    //                 blue: 408,
    //             }
    //         },
    //         {
    //             number: 7,
    //             par: 5,
    //             handicap: 6,
    //             yardage: {
    //                 red: 489,
    //                 white: 502,
    //                 blue: 553,
    //             }
    //         },
    //         {
    //             number: 8,
    //             par: 3,
    //             handicap: 14,
    //             yardage: {
    //                 red: 152,
    //                 white: 191,
    //                 blue: 210,
    //             }
    //         },
    //         {
    //             number: 9,
    //             par: 4,
    //             handicap: 12,
    //             yardage: {
    //                 red: 293,
    //                 white: 385,
    //                 blue: 460,
    //             }
    //         },
    //         {
    //             number: 10,
    //             par: 4,
    //             handicap: 9,
    //             yardage: {
    //                 red: 377,
    //                 white: 434,
    //                 blue: 502,
    //             }
    //         },
    //         {
    //             number: 11,
    //             par: 4,
    //             handicap: 11,
    //             yardage: {
    //                 red: 412,
    //                 white: 421,
    //                 blue: 435,
    //             }
    //         },
    //         {
    //             number: 12,
    //             par: 4,
    //             handicap: 7,
    //             yardage: {
    //                 red: 403,
    //                 white: 432,
    //                 blue: 501,
    //             }
    //         },
    //         {
    //             number: 13,
    //             par: 5,
    //             handicap: 3,
    //             yardage: {
    //                 red: 472,
    //                 white: 480,
    //                 blue: 608,
    //             }
    //         },
    //         {
    //             number: 14,
    //             par: 3,
    //             handicap: 17,
    //             yardage: {
    //                 red: 139,
    //                 white: 152,
    //                 blue: 161,
    //             }
    //         },
    //         {
    //             number: 15,
    //             par: 4,
    //             handicap: 1,
    //             yardage: {
    //                 red: 417,
    //                 white: 430,
    //                 blue: 478,
    //             }
    //         },
    //         {
    //             number: 16,
    //             par: 4,
    //             handicap: 5,
    //             yardage: {
    //                 red: 431,
    //                 white: 457,
    //                 blue: 490,
    //             }
    //         },
    //         {
    //             number: 17,
    //             par: 3,
    //             handicap: 13,
    //             yardage: {
    //                 red: 178,
    //                 white: 195,
    //                 blue: 207,
    //             }
    //         },
    //         {
    //             number: 18,
    //             par: 4,
    //             handicap: 15,
    //             yardage: {
    //                 red: 345,
    //                 white: 394,
    //                 blue: 411,
    //             }
    //         },
    //     ]
    // },
    // {
    //     name: "Bethpage Red",
    //     location : { 
    //         zip : 11735 ,
    //         latitude : 40.7446173, 
    //         longitude : -73.4570767, 
    //     },
    //     img: "../img/Bethpage-Red-Logo.gif",
    //     isNine: false,
    //     isNineOnly: false,
    //     tees: [{
    //         color: 'Red',
    //         rating: 75,
    //         slope: 126,
    //     },
    //     {
    //         color: 'White',
    //         rating: 71.2,
    //         slope: 124,
    //     },
    //     {
    //         color: 'Blue',
    //         rating: 72.2,
    //         slope: 127,
    //     }],
    //     holes: [
    //         {
    //             number: 1,
    //             par: 4,
    //             handicap: 3,
    //             yardage: {
    //                 red: 438,
    //                 white: 459,
    //                 blue: 471,
    //             }
    //         },
    //         {
    //             number: 2,
    //             par: 4,
    //             handicap: 7,
    //             yardage: {
    //                 red: 365,
    //                 white: 387,
    //                 blue: 401,
    //             }
    //         },
    //         {
    //             number: 3,
    //             par: 4,
    //             handicap: 11,
    //             yardage: {
    //                 red: 356,
    //                 white: 368,
    //                 blue: 382,
    //             }
    //         },
    //         {
    //             number: 4,
    //             par: 3,
    //             handicap: 15,
    //             yardage: {
    //                 red: 145,
    //                 white: 171,
    //                 blue: 181,
    //             }
    //         },
    //         {
    //             number: 5,
    //             par: 5,
    //             handicap: 5,
    //             yardage: {
    //                 red: 481,
    //                 white: 510,
    //                 blue: 528,
    //             }
    //         },
    //         {
    //             number: 6,
    //             par: 4,
    //             handicap: 9,
    //             yardage: {
    //                 red: 327,
    //                 white: 337,
    //                 blue: 350,
    //             }
    //         },
    //         {
    //             number: 7,
    //             par: 3,
    //             handicap: 17,
    //             yardage: {
    //                 red: 136,
    //                 white: 154,
    //                 blue: 184,
    //             }
    //         },
    //         {
    //             number: 8,
    //             par: 4,
    //             handicap: 13,
    //             yardage: {
    //                 red: 351,
    //                 white: 364,
    //                 blue: 378,
    //             }
    //         },
    //         {
    //             number: 9,
    //             par: 4,
    //             handicap: 1,
    //             yardage: {
    //                 red: 433,
    //                 white: 449,
    //                 blue: 466,
    //             }
    //         },
    //         {
    //             number: 10,
    //             par: 4,
    //             handicap: 14,
    //             yardage: {
    //                 red: 395,
    //                 white: 416,
    //                 blue: 446,
    //             }
    //         },
    //         {
    //             number: 11,
    //             par: 4,
    //             handicap: 12,
    //             yardage: {
    //                 red: 406,
    //                 white: 418,
    //                 blue: 432,
    //             }
    //         },
    //         {
    //             number: 12,
    //             par: 3,
    //             handicap: 16,
    //             yardage: {
    //                 red: 161,
    //                 white: 189,
    //                 blue: 208,
    //             }
    //         },
    //         {
    //             number: 13,
    //             par: 4,
    //             handicap: 6,
    //             yardage: {
    //                 red: 372,
    //                 white: 385,
    //                 blue: 400,
    //             }
    //         },
    //         {
    //             number: 14,
    //             par: 4,
    //             handicap: 4,
    //             yardage: {
    //                 red: 407,
    //                 white: 421,
    //                 blue: 435,
    //             }
    //         },
    //         {
    //             number: 15,
    //             par: 4,
    //             handicap: 2,
    //             yardage: {
    //                 red: 425,
    //                 white: 438,
    //                 blue: 452,
    //             }
    //         },
    //         {
    //             number: 16,
    //             par: 5,
    //             handicap: 8,
    //             yardage: {
    //                 red: 485,
    //                 white: 535,
    //                 blue: 565,
    //             }
    //         },
    //         {
    //             number: 17,
    //             par: 3,
    //             handicap: 13,
    //             yardage: {
    //                 red: 144,
    //                 white: 153,
    //                 blue: 165,
    //             }
    //         },
    //         {
    //             number: 18,
    //             par: 4,
    //             handicap: 10,
    //             yardage: {
    //                 red: 380,
    //                 white: 401,
    //                 blue: 424,
    //             }
    //         },
    //     ]
    // },
    // {
    //     name: "Bethpage Green",
    //     location : { 
    //         zip : 11735 ,
    //         latitude : 40.7446173, 
    //         longitude : -73.4570767, 
    //     },
    //     img: "../img/Bethpage-Green-Logo.png",
    //     isNine: false,
    //     isNineOnly: false,
    //     tees: [{
    //         color: 'Red',
    //         rating: 73,
    //         slope: 126,
    //     },
    //     {
    //         color: 'White',
    //         rating: 69.5,
    //         slope: 121,
    //     },
    //     {
    //         color: 'Blue',
    //         rating: 70.6,
    //         slope: 126,
    //     }],
    //     holes: [
    //         {
    //             number: 1,
    //             par: 4,
    //             handicap: 15,
    //             yardage: {
    //                 red: 338,
    //                 white: 345,
    //                 blue: 360
    //             }
    //         },
    //         {
    //             number: 2,
    //             par: 4,
    //             handicap: 3,
    //             yardage: {
    //                 red: 357,
    //                 white: 367,
    //                 blue: 380,
    //             }
    //         },
    //         {
    //             number: 3,
    //             par: 3,
    //             handicap: 17,
    //             yardage: {
    //                 red: 115,
    //                 white: 133,
    //                 blue: 159,
    //             }
    //         },
    //         {
    //             number: 4,
    //             par: 4,
    //             handicap: 11,
    //             yardage: {
    //                 red: 334,
    //                 white: 344,
    //                 blue: 374,
    //             }
    //         },
    //         {
    //             number: 5,
    //             par: 4,
    //             handicap: 7,
    //             yardage: {
    //                 red: 376,
    //                 white: 387,
    //                 blue: 400,
    //             }
    //         },
    //         {
    //             number: 6,
    //             par: 3,
    //             handicap: 5,
    //             yardage: {
    //                 red: 169,
    //                 white: 186,
    //                 blue: 190,
    //             }
    //         },
    //         {
    //             number: 7,
    //             par: 5,
    //             handicap: 9,
    //             yardage: {
    //                 red: 485,
    //                 white: 500,
    //                 blue: 507,
    //             }
    //         },
    //         {
    //             number: 8,
    //             par: 4,
    //             handicap: 13,
    //             yardage: {
    //                 red: 329,
    //                 white: 337,
    //                 blue: 349,
    //             }
    //         },
    //         {
    //             number: 9,
    //             par: 5,
    //             handicap: 1,
    //             yardage: {
    //                 red: 515,
    //                 white: 532,
    //                 blue: 560,
    //             }
    //         },
    //         {
    //             number: 10,
    //             par: 4,
    //             handicap: 12,
    //             yardage: {
    //                 red: 290,
    //                 white: 328,
    //                 blue: 369,
    //             }
    //         },
    //         {
    //             number: 11,
    //             par: 3,
    //             handicap: 16,
    //             yardage: {
    //                 red: 148,
    //                 white: 175,
    //                 blue: 184,
    //             }
    //         },
    //         {
    //             number: 12,
    //             par: 4,
    //             handicap: 18,
    //             yardage: {
    //                 red: 268,
    //                 white: 279,
    //                 blue: 302,
    //             }
    //         },
    //         {
    //             number: 13,
    //             par: 5,
    //             handicap: 2,
    //             yardage: {
    //                 red: 494,
    //                 white: 553,
    //                 blue: 574,
    //             }
    //         },
    //         {
    //             number: 14,
    //             par: 4,
    //             handicap: 14,
    //             yardage: {
    //                 red: 341,
    //                 white: 352,
    //                 blue: 401,
    //             }
    //         },
    //         {
    //             number: 15,
    //             par: 3,
    //             handicap: 8,
    //             yardage: {
    //                 red: 165,
    //                 white: 180,
    //                 blue: 221,
    //             }
    //         },
    //         {
    //             number: 16,
    //             par: 4,
    //             handicap: 10,
    //             yardage: {
    //                 red: 334,
    //                 white: 343,
    //                 blue: 376,
    //             }
    //         },
    //         {
    //             number: 17,
    //             par: 4,
    //             handicap: 4,
    //             yardage: {
    //                 red: 400,
    //                 white: 408,
    //                 blue: 418,
    //             }
    //         },
    //         {
    //             number: 18,
    //             par: 4,
    //             handicap: 6,
    //             yardage: {
    //                 red: 368,
    //                 white: 386,
    //                 blue: 398,
    //             }
    //         }
    //     ]
    // },
    // {
    //     name: "Bethpage Yellow",
    //     location : { 
    //         zip : 11735 ,
    //         latitude : 40.7388621, 
    //         longitude : -73.471153, 
    //     },
    //     img: "../img/Bethpage-Yellow-Logo.png",
    //     isNine: true,
    //     isNineOnly: false,
    //     tees: [{
    //         color: 'Red',
    //         rating: 72.9,
    //         slope: 124,
    //     },
    //     {
    //         color: 'White',
    //         rating: 68.6,
    //         slope: 119,
    //     },
    //     {
    //         color: 'Blue',
    //         rating: 69.4,
    //         slope: 120,
    //     }],
    //     holes: [
    //         {
    //             number: 1,
    //             par: 4,
    //             handicap: 2,
    //             yardage: {
    //                 red: 395,
    //                 white: 411,
    //                 blue: 429,
    //             }
    //         },
    //         {
    //             number: 2,
    //             par: 4,
    //             handicap: 4,
    //             yardage: {
    //                 red: 382,
    //                 white: 389,
    //                 blue: 398,
    //             }
    //         },
    //         {
    //             number: 3,
    //             par: 4,
    //             handicap: 6,
    //             yardage: {
    //                 red: 357,
    //                 white: 366,
    //                 blue: 390,
    //             }
    //         },
    //         {
    //             number: 4,
    //             par: 3,
    //             handicap: 14,
    //             yardage: {
    //                 red: 130,
    //                 white: 151,
    //                 blue: 166,
    //             }
    //         },
    //         {
    //             number: 5,
    //             par: 4,
    //             handicap: 10,
    //             yardage: {
    //                 red: 322,
    //                 white: 336,
    //                 blue: 347,
    //             }
    //         },
    //         {
    //             number: 6,
    //             par: 5,
    //             handicap: 8,
    //             yardage: {
    //                 red: 464,
    //                 white: 474,
    //                 blue: 487,
    //             }
    //         },
    //         {
    //             number: 7,
    //             par: 3,
    //             handicap: 16,
    //             yardage: {
    //                 red: 139,
    //                 white: 164,
    //                 blue: 174,
    //             }
    //         },
    //         {
    //             number: 8,
    //             par: 4,
    //             handicap: 12,
    //             yardage: {
    //                 red: 321,
    //                 white: 331,
    //                 blue: 338,
    //             }
    //         },
    //         {
    //             number: 9,
    //             par: 4,
    //             handicap: 18,
    //             yardage: {
    //                 red: 366,
    //                 white: 375,
    //                 blue: 386,
    //             }
    //         },
    //         {
    //             number: 10,
    //             par: 5,
    //             handicap: 3,
    //             yardage: {
    //                 red: 492,
    //                 white: 510,
    //                 blue: 524,
    //             }
    //         },
    //         {
    //             number: 11,
    //             par: 3,
    //             handicap: 11,
    //             yardage: {
    //                 red: 160,
    //                 white: 173,
    //                 blue: 188,
    //             }
    //         },
    //         {
    //             number: 12,
    //             par: 4,
    //             handicap: 17,
    //             yardage: {
    //                 red: 289,
    //                 white: 300,
    //                 blue: 313,
    //             }
    //         },
    //         {
    //             number: 13,
    //             par: 4,
    //             handicap: 1,
    //             yardage: {
    //                 red: 392,
    //                 white: 410,
    //                 blue: 429,
    //             }
    //         },
    //         {
    //             number: 14,
    //             par: 3,
    //             handicap: 9,
    //             yardage: {
    //                 red: 170,
    //                 white: 178,
    //                 blue: 188,
    //             }
    //         },
    //         {
    //             number: 15,
    //             par: 4,
    //             handicap: 7,
    //             yardage: {
    //                 red: 349,
    //                 white: 355,
    //                 blue: 363,
    //             }
    //         },
    //         {
    //             number: 16,
    //             par: 4,
    //             handicap: 13,
    //             yardage: {
    //                 red: 284,
    //                 white: 340,
    //                 blue: 353,
    //             }
    //         },
    //         {
    //             number: 17,
    //             par: 5,
    //             handicap: 5,
    //             yardage: {
    //                 red: 467,
    //                 white: 475,
    //                 blue: 485,
    //             }
    //         },
    //         {
    //             number: 18,
    //             par: 4,
    //             handicap: 15,
    //             yardage: {
    //                 red: 330,
    //                 white: 347,
    //                 blue: 366,
    //             }
    //         },
    //     ]
    // },
    // {
    //     name: "Montauk Downs",
    //     location : { 
    //         zip : 11954 ,
    //         latitude : 41.0486391, 
    //         longitude : -71.9358848, 
    //     },
    //     img: "../img/Montauk-Downs-Logo.jpg",
    //     isNine: false,
    //     isNineOnly: false,
    //     tees: [{
    //         color: 'Red',
    //         rating: 75.5,
    //         slope: 137,
    //     },
    //     {
    //         color: 'White',
    //         rating: 71.2,
    //         slope: 132,
    //     },
    //     {
    //         color: 'Blue',
    //         rating: 73.5,
    //         slope: 139,
    //     }],
    //     holes: [
    //         {
    //             number: 1,
    //             par: 4,
    //             handicap: 11,
    //             yardage: {
    //                 red: 351,
    //                 white: 370,
    //                 blue: 382,
    //             }
    //         },
    //         {
    //             number: 2,
    //             par: 3,
    //             handicap: 17,
    //             yardage: {
    //                 red: 94,
    //                 white: 111,
    //                 blue: 135,
    //             }
    //         },
    //         {
    //             number: 3,
    //             par: 4,
    //             handicap: 9,
    //             yardage: {
    //                 red: 341,
    //                 white: 368,
    //                 blue: 421,
    //             }
    //         },
    //         {
    //             number: 4,
    //             par: 4,
    //             handicap: 5,
    //             yardage: {
    //                 red: 381,
    //                 white: 391,
    //                 blue: 410,
    //             }
    //         },
    //         {
    //             number: 5,
    //             par: 5,
    //             handicap: 3,
    //             yardage: {
    //                 red: 393,
    //                 white: 472,
    //                 blue: 520,
    //             }
    //         },
    //         {
    //             number: 6,
    //             par: 4,
    //             handicap: 13,
    //             yardage: {
    //                 red: 301,
    //                 white: 334,
    //                 blue: 340,
    //             }
    //         },
    //         {
    //             number: 7,
    //             par: 5,
    //             handicap: 7,
    //             yardage: {
    //                 red: 407,
    //                 white: 485,
    //                 blue: 500,
    //             }
    //         },
    //         {
    //             number: 8,
    //             par: 3,
    //             handicap: 15,
    //             yardage: {
    //                 red: 126,
    //                 white: 145,
    //                 blue: 167,
    //             }
    //         },
    //         {
    //             number: 9,
    //             par: 4,
    //             handicap: 1,
    //             yardage: {
    //                 red: 368,
    //                 white: 409,
    //                 blue: 445,
    //             }
    //         },
    //         {
    //             number: 10,
    //             par: 5,
    //             handicap: 2,
    //             yardage: {
    //                 red: 442,
    //                 white: 467,
    //                 blue: 480,
    //             }
    //         },
    //         {
    //             number: 11,
    //             par: 4,
    //             handicap: 18,
    //             yardage: {
    //                 red: 271,
    //                 white: 285,
    //                 blue: 305,
    //             }
    //         },
    //         {
    //             number: 12,
    //             par: 3,
    //             handicap: 14,
    //             yardage: {
    //                 red: 127,
    //                 white: 161,
    //                 blue: 203,
    //             }
    //         },
    //         {
    //             number: 13,
    //             par: 5,
    //             handicap: 8,
    //             yardage: {
    //                 red: 406,
    //                 white: 455,
    //                 blue: 485,
    //             }
    //         },
    //         {
    //             number: 14,
    //             par: 3,
    //             handicap: 16,
    //             yardage: {
    //                 red: 158,
    //                 white: 174,
    //                 blue: 195,
    //             }
    //         },
    //         {
    //             number: 15,
    //             par: 4,
    //             handicap: 6,
    //             yardage: {
    //                 red: 357,
    //                 white: 395,
    //                 blue: 436,
    //             }
    //         },
    //         {
    //             number: 16,
    //             par: 4,
    //             handicap: 10,
    //             yardage: {
    //                 red: 313,
    //                 white: 336,
    //                 blue: 370,
    //             }
    //         },
    //         {
    //             number: 17,
    //             par: 4,
    //             handicap: 12,
    //             yardage: {
    //                 red: 346,
    //                 white: 350,
    //                 blue: 390,
    //             }
    //         },
    //         {
    //             number: 18,
    //             par: 4,
    //             handicap: 4,
    //             yardage: {
    //                 red: 359,
    //                 white: 430,
    //                 blue: 430,
    //             }
    //         },
    //     ]
    // },
    // {
    //     name: "9 Hole Only Test",
    //     location : { 
    //         zip : 11954 ,
    //         latitude : 41.0486391, 
    //         longitude : -71.9358848, 
    //     },
    //     img: "../img/Montauk-Downs-Logo.jpg",
    //     isNine: true,
    //     isNineOnly: true,
    //     tees: [{
    //         color: 'Red',
    //         rating: 75.5,
    //         slope: 137,
    //     },
    //     {
    //         color: 'White',
    //         rating: 71.2,
    //         slope: 132,
    //     },
    //     {
    //         color: 'Blue',
    //         rating: 73.5,
    //         slope: 139,
    //     }],
    //     holes: [
    //         {
    //             number: 1,
    //             par: 4,
    //             handicap: 11,
    //             yardage: {
    //                 red: 351,
    //                 white: 370,
    //                 blue: 382,
    //             }
    //         },
    //         {
    //             number: 2,
    //             par: 3,
    //             handicap: 17,
    //             yardage: {
    //                 red: 94,
    //                 white: 111,
    //                 blue: 135,
    //             }
    //         },
    //         {
    //             number: 3,
    //             par: 4,
    //             handicap: 9,
    //             yardage: {
    //                 red: 341,
    //                 white: 368,
    //                 blue: 421,
    //             }
    //         },
    //         {
    //             number: 4,
    //             par: 4,
    //             handicap: 5,
    //             yardage: {
    //                 red: 381,
    //                 white: 391,
    //                 blue: 410,
    //             }
    //         },
    //         {
    //             number: 5,
    //             par: 5,
    //             handicap: 3,
    //             yardage: {
    //                 red: 393,
    //                 white: 472,
    //                 blue: 520,
    //             }
    //         },
    //         {
    //             number: 6,
    //             par: 4,
    //             handicap: 13,
    //             yardage: {
    //                 red: 301,
    //                 white: 334,
    //                 blue: 340,
    //             }
    //         },
    //         {
    //             number: 7,
    //             par: 5,
    //             handicap: 7,
    //             yardage: {
    //                 red: 407,
    //                 white: 485,
    //                 blue: 500,
    //             }
    //         },
    //         {
    //             number: 8,
    //             par: 3,
    //             handicap: 15,
    //             yardage: {
    //                 red: 126,
    //                 white: 145,
    //                 blue: 167,
    //             }
    //         },
    //         {
    //             number: 9,
    //             par: 4,
    //             handicap: 1,
    //             yardage: {
    //                 red: 368,
    //                 white: 409,
    //                 blue: 445,
    //             }
    //         }
    //     ]
    // },
    // {
    //     name: "Hanah Mountain Resort",
    //     location : { 
    //         zip : 11954 ,
    //         latitude : 42.1768591, 
    //         longitude : -74.627025, 
    //     },
    //     img: "../img/Hanah-Logo.png",
    //     isNine: false,
    //     isNineOnly: false,
    //     tees: [{
    //         color: 'Red',
    //         rating: 69.7,
    //         slope: 123,
    //     },
    //     {
    //         color: 'White',
    //         rating: 70,
    //         slope: 126,
    //     },
    //     {
    //         color: 'Blue',
    //         rating: 73.5,
    //         slope: 133,
    //     },
    //     {
    //         color: 'Black',
    //         rating: 74,
    //         slope: 136,
    //     }],
    //     holes: [
    //         {
    //             number: 1,
    //             par: 4,
    //             handicap: 17,
    //             yardage: {
    //                 red: 291,
    //                 white: 346,
    //                 blue: 429,
    //                 black: 432
    //             }
    //         },
    //         {
    //             number: 2,
    //             par: 4,
    //             handicap: 7,
    //             yardage: {
    //                 red: 291,
    //                 white: 349,
    //                 blue: 470,
    //                 black: 470
    //             }
    //         },
    //         {
    //             number: 3,
    //             par: 3,
    //             handicap: 5,
    //             yardage: {
    //                 red: 107,
    //                 white: 168,
    //                 blue: 199,
    //                 black: 200
    //             }
    //         },
    //         {
    //             number: 4,
    //             par: 5,
    //             handicap: 9,
    //             yardage: {
    //                 red: 440,
    //                 white: 485,
    //                 blue: 511,
    //                 black: 515
    //             }
    //         },
    //         {
    //             number: 5,
    //             par: 4,
    //             handicap: 11,
    //             yardage: {
    //                 red: 275,
    //                 white: 341,
    //                 blue: 380,
    //                 black: 385
    //             }
    //         },
    //         {
    //             number: 6,
    //             par: 4,
    //             handicap: 15,
    //             yardage: {
    //                 red: 288,
    //                 white: 351,
    //                 blue: 391,
    //                 black: 394
    //             }
    //         },
    //         {
    //             number: 7,
    //             par: 3,
    //             handicap: 13,
    //             yardage: {
    //                 red: 160,
    //                 white: 169,
    //                 blue: 257,
    //                 black: 257
    //             }
    //         },
    //         {
    //             number: 8,
    //             par: 5,
    //             handicap: 3,
    //             yardage: {
    //                 red: 482,
    //                 white: 570,
    //                 blue: 587,
    //                 black: 590
    //             }
    //         },
    //         {
    //             number: 9,
    //             par: 4,
    //             handicap: 1,
    //             yardage: {
    //                 red: 385,
    //                 white: 450,
    //                 blue: 479,
    //                 black: 482
    //             }
    //         },
    //         {
    //             number: 10,
    //             par: 5,
    //             handicap: 4,
    //             yardage: {
    //                 red: 460,
    //                 white: 561,
    //                 blue: 598,
    //                 black: 600
    //             }
    //         },
    //         {
    //             number: 11,
    //             par: 4,
    //             handicap: 6,
    //             yardage: {
    //                 red: 301,
    //                 white: 329,
    //                 blue: 446,
    //                 black: 478
    //             }
    //         },
    //         {
    //             number: 12,
    //             par: 3,
    //             handicap: 12,
    //             yardage: {
    //                 red: 100,
    //                 white: 176,
    //                 blue: 186,
    //                 black: 188
    //             }
    //         },
    //         {
    //             number: 13,
    //             par: 4,
    //             handicap: 2,
    //             yardage: {
    //                 red: 283,
    //                 white: 390,
    //                 blue: 414,
    //                 black: 416
    //             }
    //         },
    //         {
    //             number: 14,
    //             par: 5,
    //             handicap: 8,
    //             yardage: {
    //                 red: 441,
    //                 white: 513,
    //                 blue: 523,
    //                 black: 525
    //             }
    //         },
    //         {
    //             number: 15,
    //             par: 3,
    //             handicap: 18,
    //             yardage: {
    //                 red: 96,
    //                 white: 140,
    //                 blue: 145,
    //                 black: 177
    //             }
    //         },
    //         {
    //             number: 16,
    //             par: 4,
    //             handicap: 10,
    //             yardage: {
    //                 red: 200,
    //                 white: 330,
    //                 blue: 341,
    //                 black: 343
    //             }
    //         },
    //         {
    //             number: 17,
    //             par: 4,
    //             handicap: 16,
    //             yardage: {
    //                 red: 267,
    //                 white: 324,
    //                 blue: 330,
    //                 black: 432
    //             }
    //         },
    //         {
    //             number: 18,
    //             par: 4,
    //             handicap: 14,
    //             yardage: {
    //                 red: 258,
    //                 white: 321,
    //                 blue: 347,
    //                 black: 386
    //             }
    //         },
    //     ]
    // },
    // {
    //     name: "Tarry Brae",
    //     location : { 
    //         zip : 12779,
    //         latitude : 41.7341691, 
    //         longitude : -74.642903, 
    //     },
    //     img: "../img/Tarry-Brae-Logo.jpg",
    //     isNine: false,
    //     isNineOnly: false,
    //     tees: [{
    //         color: 'Yellow',
    //         rating: 72.2,
    //         slope: 123,
    //     },
    //     {
    //         color: 'Gold',
    //         rating: 69,
    //         slope: 120,
    //     },
    //     {
    //         color: 'Green',
    //         rating: 71.6,
    //         slope: 126,
    //     },
    //     {
    //         color: 'Black',
    //         rating: 73.8,
    //         slope: 133,
    //     }],
    //     holes: [
    //         {
    //             number: 1,
    //             par: 4,
    //             handicap: 9,
    //             yardage: {
    //                 yellow: 306,
    //                 gold: 365,
    //                 green: 383,
    //                 black: 392
    //             }
    //         },
    //         {
    //             number: 2,
    //             par: 4,
    //             handicap: 3,
    //             yardage: {
    //                 yellow: 330,
    //                 gold: 340,
    //                 green: 360,
    //                 black: 402
    //             }
    //         },
    //         {
    //             number: 3,
    //             par: 4,
    //             handicap: 13,
    //             yardage: {
    //                 yellow: 348,
    //                 gold: 358,
    //                 green: 385,
    //                 black: 438
    //             }
    //         },
    //         {
    //             number: 4,
    //             par: 3,
    //             handicap: 5,
    //             yardage: {
    //                 yellow: 153,
    //                 gold: 160,
    //                 green: 192,
    //                 black: 209
    //             }
    //         },
    //         {
    //             number: 5,
    //             par: 4,
    //             handicap: 11,
    //             yardage: {
    //                 yellow: 291,
    //                 gold: 346,
    //                 green: 429,
    //                 black: 432
    //             }
    //         },
    //         {
    //             number: 6,
    //             par: 4,
    //             handicap: 7,
    //             yardage: {
    //                 yellow: 313,
    //                 gold: 320,
    //                 green: 360,
    //                 black: 408
    //             }
    //         },
    //         {
    //             number: 7,
    //             par: 3,
    //             handicap: 15,
    //             yardage: {
    //                 yellow: 135,
    //                 gold: 142,
    //                 green: 154,
    //                 black: 169
    //             }
    //         },
    //         {
    //             number: 8,
    //             par: 4,
    //             handicap: 1,
    //             yardage: {
    //                 yellow: 343,
    //                 gold: 353,
    //                 green: 387,
    //                 black: 417
    //             }
    //         },
    //         {
    //             number: 9,
    //             par: 5,
    //             handicap: 11,
    //             yardage: {
    //                 yellow: 444,
    //                 gold: 453,
    //                 green: 473,
    //                 black: 526
    //             }
    //         },
    //         {
    //             number: 10,
    //             par: 5,
    //             handicap: 18,
    //             yardage: {
    //                 yellow: 426,
    //                 gold: 446,
    //                 green: 451,
    //                 black: 543
    //             }
    //         },
    //         {
    //             number: 11,
    //             par: 3,
    //             handicap: 6,
    //             yardage: {
    //                 yellow: 141,
    //                 gold: 147,
    //                 green: 179,
    //                 black: 201
    //             }
    //         },
    //         {
    //             number: 12,
    //             par: 4,
    //             handicap: 14,
    //             yardage: {
    //                 yellow: 310,
    //                 gold: 319,
    //                 green: 355,
    //                 black: 365
    //             }
    //         },
    //         {
    //             number: 13,
    //             par: 4,
    //             handicap: 2,
    //             yardage: {
    //                 yellow: 372,
    //                 gold: 379,
    //                 green: 410,
    //                 black: 433
    //             }
    //         },
    //         {
    //             number: 14,
    //             par: 4,
    //             handicap: 8,
    //             yardage: {
    //                 yellow: 289,
    //                 gold: 298,
    //                 green: 384,
    //                 black: 408
    //             }
    //         },
    //         {
    //             number: 15,
    //             par: 4,
    //             handicap: 16,
    //             yardage: {
    //                 yellow: 330,
    //                 gold: 360,
    //                 green: 367,
    //                 black: 391
    //             }
    //         },
    //         {
    //             number: 16,
    //             par: 4,
    //             handicap: 4,
    //             yardage: {
    //                 yellow: 350,
    //                 gold: 360,
    //                 green: 397,
    //                 black: 425
    //             }
    //         },
    //         {
    //             number: 17,
    //             par: 3,
    //             handicap: 12,
    //             yardage: {
    //                 yellow: 131,
    //                 gold: 141,
    //                 green: 183,
    //                 black: 206
    //             }
    //         },
    //         {
    //             number: 18,
    //             par: 5,
    //             handicap: 10,
    //             yardage: {
    //                 yellow: 388,
    //                 gold: 398,
    //                 green: 511,
    //                 black: 541
    //             }
    //         },
    //     ]
    // },
    // {
    //     name: "Town of Oyster Bay",
    //     location : { 
    //         zip : 11797,
    //         latitude : 40.817220, 
    //         longitude : -73.482367, 
    //     },
    //     img: "../img/TOB-Logo.jpg",
    //     isNine: false,
    //     isNineOnly: false,
    //     tees: [{
    //         color: 'Red',
    //         rating: 69.4,
    //         slope: 114,
    //     },
    //     {
    //         color: 'White',
    //         rating: 67.8,
    //         slope: 128,
    //     },
    //     {
    //         color: 'Blue',
    //         rating: 70.9,
    //         slope: 137,
    //     }],
    //     holes: [
    //         {
    //             number: 1,
    //             par: 4,
    //             handicap: 13,
    //             yardage: {
    //                 red: 263,
    //                 white: 301,
    //                 blue: 348
    //             }
    //         },
    //         {
    //             number: 2,
    //             par: 5,
    //             handicap: 5,
    //             yardage: {
    //                 red: 504,
    //                 white: 531,
    //                 blue: 571
    //             }
    //         },
    //         {
    //             number: 3,
    //             par: 3,
    //             handicap: 17,
    //             yardage: {
    //                 red: 108,
    //                 white: 133,
    //                 blue: 152
    //             }
    //         },
    //         {
    //             number: 4,
    //             par: 4,
    //             handicap: 1,
    //             yardage: {
    //                 red: 313,
    //                 white: 380,
    //                 blue: 414
    //             }
    //         },
    //         {
    //             number: 5,
    //             par: 4,
    //             handicap: 7,
    //             yardage: {
    //                 red: 334,
    //                 white: 347,
    //                 blue: 374
    //             }
    //         },
    //         {
    //             number: 6,
    //             par: 3,
    //             handicap: 15,
    //             yardage: {
    //                 red: 111,
    //                 white: 150,
    //                 blue: 174
    //             }
    //         },
    //         {
    //             number: 7,
    //             par: 4,
    //             handicap: 3,
    //             yardage: {
    //                 red: 329,
    //                 white: 357,
    //                 blue: 387
    //             }
    //         },
    //         {
    //             number: 8,
    //             par: 3,
    //             handicap: 9,
    //             yardage: {
    //                 red: 160,
    //                 white: 212,
    //                 blue: 230
    //             }
    //         },
    //         {
    //             number: 9,
    //             par: 4,
    //             handicap: 11,
    //             yardage: {
    //                 red: 261,
    //                 white: 284,
    //                 blue: 320
    //             }
    //         },
    //         {
    //             number: 10,
    //             par: 4,
    //             handicap: 14,
    //             yardage: {
    //                 red: 304,
    //                 white: 337,
    //                 blue: 365
    //             }
    //         },
    //         {
    //             number: 11,
    //             par: 4,
    //             handicap: 16,
    //             yardage: {
    //                 red: 220,
    //                 white: 263,
    //                 blue: 295
    //             }
    //         },
    //         {
    //             number: 12,
    //             par: 3,
    //             handicap: 18,
    //             yardage: {
    //                 red: 100,
    //                 white: 117,
    //                 blue: 137
    //             }
    //         },
    //         {
    //             number: 13,
    //             par: 4,
    //             handicap: 8,
    //             yardage: {
    //                 red: 322,
    //                 white: 358,
    //                 blue: 394
    //             }
    //         },
    //         {
    //             number: 14,
    //             par: 5,
    //             handicap: 12,
    //             yardage: {
    //                 red: 421,
    //                 white: 476,
    //                 blue: 522
    //             }
    //         },
    //         {
    //             number: 15,
    //             par: 4,
    //             handicap: 10,
    //             yardage: {
    //                 red: 253,
    //                 white: 344,
    //                 blue: 366
    //             }
    //         },
    //         {
    //             number: 16,
    //             par: 4,
    //             handicap: 6,
    //             yardage: {
    //                 red: 337,
    //                 white: 412,
    //                 blue: 439
    //             }
    //         },
    //         {
    //             number: 17,
    //             par: 4,
    //             handicap: 2,
    //             yardage: {
    //                 red: 401,
    //                 white: 426,
    //                 blue: 445
    //             }
    //         },
    //         {
    //             number: 18,
    //             par: 4,
    //             handicap: 6,
    //             yardage: {
    //                 red: 360,
    //                 white: 391,
    //                 blue: 443
    //             }
    //         },
    //     ]
    // },
    {
        name: "Crab Meadow",
        location : { 
            zip : 11768,
            latitude : 40.919090,
            longitude : -73.326144, 
        },
        img: "../img/Crab-Meadow-Logo.png",
        isNine: true,
        isNineOnly: false,
        tees: [{
            color: 'Silver',
            rating: 66.9,
            slope: 120,
        },
        {
            color: 'White',
            rating: 69.9,
            slope: 125,
        },
        {
            color: 'Blue',
            rating: 71.8,
            slope: 128,
        }],
        holes: [
            {
                number: 1,
                par: 4,
                handicap: 8,
                yardage: {
                    silver: 318,
                    white: 357,
                    blue: 372
                }
            },
            {
                number: 2,
                par: 4,
                handicap: 10,
                yardage: {
                    silver: 302,
                    white: 360,
                    blue: 379
                }
            },
            {
                number: 3,
                par: 3,
                handicap: 14,
                yardage: {
                    silver: 128,
                    white: 198,
                    blue: 223
                }
            },
            {
                number: 4,
                par: 5,
                handicap: 12,
                yardage: {
                    silver: 392,
                    white: 500,
                    blue: 531
                }
            },
            {
                number: 5,
                par: 4,
                handicap: 4,
                yardage: {
                    silver: 327,
                    white: 369,
                    blue: 387
                }
            },
            {
                number: 6,
                par: 4,
                handicap: 18,
                yardage: {
                    silver: 301,
                    white: 311,
                    blue: 327
                }
            },
            {
                number: 7,
                par: 4,
                handicap: 6,
                yardage: {
                    silver: 323,
                    white: 333,
                    blue: 346
                }
            },
            {
                number: 8,
                par: 5,
                handicap: 2,
                yardage: {
                    silver: 428,
                    white: 453,
                    blue: 481
                }
            },
            {
                number: 9,
                par: 3,
                handicap: 16,
                yardage: {
                    silver: 132,
                    white: 146,
                    blue: 161
                }
            },
            {
                number: 10,
                par: 4,
                handicap: 15,
                yardage: {
                    silver: 326,
                    white: 337,
                    blue: 351
                }
            },
            {
                number: 11,
                par: 5,
                handicap: 9,
                yardage: {
                    silver: 400,
                    white: 475,
                    blue: 490
                }
            },
            {
                number: 12,
                par: 4,
                handicap: 3,
                yardage: {
                    silver: 365,
                    white: 385,
                    blue: 424
                }
            },
            {
                number: 13,
                par: 3,
                handicap: 13,
                yardage: {
                    silver: 138,
                    white: 157,
                    blue: 187
                }
            },
            {
                number: 14,
                par: 5,
                handicap: 1,
                yardage: {
                    silver: 461,
                    white: 493,
                    blue: 531
                }
            },
            {
                number: 15,
                par: 4,
                handicap: 7,
                yardage: {
                    silver: 363,
                    white: 394,
                    blue: 407
                }
            },
            {
                number: 16,
                par: 3,
                handicap: 17,
                yardage: {
                    silver: 116,
                    white: 145,
                    blue: 165
                }
            },
            {
                number: 17,
                par: 4,
                handicap: 5,
                yardage: {
                    silver: 383,
                    white: 397,
                    blue: 413
                }
            },
            {
                number: 18,
                par: 4,
                handicap: 11,
                yardage: {
                    silver: 365,
                    white: 406,
                    blue: 423
                }
            },
        ]
    },
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
// function seedDB(){
//     Course.remove({}, function(err){
//         if(err){
//             console.log(err);     
//         }
//         console.log("removed courses!");
//         //Add a few campgrounds
//         courseData.forEach(function(seed){
//             Course.create(seed, function(err, course){
//               if(err){
//                   console.log(err);
//               } else {
//                   console.log("Added a course");
                  
//                 }
//             });
//         });
//     });
// },
// {
    //     name: "Bethpage Blue",
    //     location : { 
    //         zip : 11735 ,
    //         latitude : 40.7415284, 
    //         longitude : -73.4674193, 
    //     },
    //     img: "../img/Bethpage-Blue-Logo.png",
    //     isNine: true,
    //     isNineOnly: false,
    //     tees: [{
    //         color: 'Red',
    //         rating: 72,
    //         slope: 118,
    //     },
    //     {
    //         color: 'White',
    //         rating: 70.9,
    //         slope: 122,
    //     },
    //     {
    //         color: 'Blue',
    //         rating: 71.7,
    //         slope: 124,
    //     }],
    //     holes: [
    //         {
    //             number: 1,
    //             par: 4,
    //             handicap: 7,
    //             yardage: {
    //                 red: 379,
    //                 white: 397,
    //                 blue: 417,
    //             }
    //         },
    //         {
    //             number: 2,
    //             par: 4,
    //             handicap: 3,
    //             yardage: {
    //                 red: 433,
    //                 white: 441,
    //                 blue: 451,
    //             }
    //         },
    //         {
    //             number: 3,
    //             par: 3,
    //             handicap: 15,
    //             yardage: {
    //                 red: 166,
    //                 white: 180,
    //                 blue: 195,
    //             }
    //         },
    //         {
    //             number: 4,
    //             par: 5,
    //             handicap: 13,
    //             yardage: {
    //                 red: 467,
    //                 white: 479,
    //                 blue: 493,
    //             }
    //         },
    //         {
    //             number: 5,
    //             par: 4,
    //             handicap: 17,
    //             yardage: {
    //                 red: 282,
    //                 white: 298,
    //                 blue: 306,
    //             }
    //         },
    //         {
    //             number: 6,
    //             par: 4,
    //             handicap: 1,
    //             yardage: {
    //                 red: 427,
    //                 white: 446,
    //                 blue: 462,
    //             }
    //         },
    //         {
    //             number: 7,
    //             par: 3,
    //             handicap: 9,
    //             yardage: {
    //                 red: 165,
    //                 white: 175,
    //                 blue: 186,
    //             }
    //         },
    //         {
    //             number: 8,
    //             par: 5,
    //             handicap: 5,
    //             yardage: {
    //                 red: 537,
    //                 white: 545,
    //                 blue: 555,
    //             }
    //         },
    //         {
    //             number: 9,
    //             par: 4,
    //             handicap: 11,
    //             yardage: {
    //                 red: 337,
    //                 white: 348,
    //                 blue: 360,
    //             }
    //         },
    //         {
    //             number: 10,
    //             par: 4,
    //             handicap: 16,
    //             yardage: {
    //                 red: 345,
    //                 white: 362,
    //                 blue: 381,
    //             }
    //         },
    //         {
    //             number: 11,
    //             par: 3,
    //             handicap: 14,
    //             yardage: {
    //                 red: 171,
    //                 white: 178,
    //                 blue: 187,
    //             }
    //         },
    //         {
    //             number: 12,
    //             par: 5,
    //             handicap: 10,
    //             yardage: {
    //                 red: 454,
    //                 white: 463,
    //                 blue: 473,
    //             }
    //         },
    //         {
    //             number: 13,
    //             par: 4,
    //             handicap: 18,
    //             yardage: {
    //                 red: 321,
    //                 white: 347,
    //                 blue: 362,
    //             }
    //         },
    //         {
    //             number: 14,
    //             par: 4,
    //             handicap: 8,
    //             yardage: {
    //                 red: 347,
    //                 white: 372,
    //                 blue: 383,
    //             }
    //         },
    //         {
    //             number: 15,
    //             par: 4,
    //             handicap: 2,
    //             yardage: {
    //                 red: 356,
    //                 white: 371,
    //                 blue: 387,
    //             }
    //         },
    //         {
    //             number: 16,
    //             par: 5,
    //             handicap: 4,
    //             yardage: {
    //                 red: 481,
    //                 white: 490,
    //                 blue: 501,
    //             }
    //         },
    //         {
    //             number: 17,
    //             par: 3,
    //             handicap: 6,
    //             yardage: {
    //                 red: 150,
    //                 white: 163,
    //                 blue: 175,
    //             }
    //         },
    //         {
    //             number: 18,
    //             par: 4,
    //             handicap: 12,
    //             yardage: {
    //                 red: 340,
    //                 white: 351,
    //                 blue: 364,
    //             }
    //         },
    //     ]
    // },
    // {
    //     name: "Bethpage Blue",
    //     location : { 
    //         zip : 11735 ,
    //         latitude : 40.7415284, 
    //         longitude : -73.4674193, 
    //     },
    //     img: "../img/Bethpage-Blue-Logo.png",
    //     isNine: true,
    //     isNineOnly: false,
    //     tees: [{
    //         color: 'Red',
    //         rating: 72,
    //         slope: 118,
    //     },
    //     {
    //         color: 'White',
    //         rating: 70.9,
    //         slope: 122,
    //     },
    //     {
    //         color: 'Blue',
    //         rating: 71.7,
    //         slope: 124,
    //     }],
    //     holes: [
    //         {
    //             number: 1,
    //             par: 4,
    //             handicap: 7,
    //             yardage: {
    //                 red: 379,
    //                 white: 397,
    //                 blue: 417,
    //             }
    //         },
    //         {
    //             number: 2,
    //             par: 4,
    //             handicap: 3,
    //             yardage: {
    //                 red: 433,
    //                 white: 441,
    //                 blue: 451,
    //             }
    //         },
    //         {
    //             number: 3,
    //             par: 3,
    //             handicap: 15,
    //             yardage: {
    //                 red: 166,
    //                 white: 180,
    //                 blue: 195,
    //             }
    //         },
    //         {
    //             number: 4,
    //             par: 5,
    //             handicap: 13,
    //             yardage: {
    //                 red: 467,
    //                 white: 479,
    //                 blue: 493,
    //             }
    //         },
    //         {
    //             number: 5,
    //             par: 4,
    //             handicap: 17,
    //             yardage: {
    //                 red: 282,
    //                 white: 298,
    //                 blue: 306,
    //             }
    //         },
    //         {
    //             number: 6,
    //             par: 4,
    //             handicap: 1,
    //             yardage: {
    //                 red: 427,
    //                 white: 446,
    //                 blue: 462,
    //             }
    //         },
    //         {
    //             number: 7,
    //             par: 3,
    //             handicap: 9,
    //             yardage: {
    //                 red: 165,
    //                 white: 175,
    //                 blue: 186,
    //             }
    //         },
    //         {
    //             number: 8,
    //             par: 5,
    //             handicap: 5,
    //             yardage: {
    //                 red: 537,
    //                 white: 545,
    //                 blue: 555,
    //             }
    //         },
    //         {
    //             number: 9,
    //             par: 4,
    //             handicap: 11,
    //             yardage: {
    //                 red: 337,
    //                 white: 348,
    //                 blue: 360,
    //             }
    //         },
    //         {
    //             number: 10,
    //             par: 4,
    //             handicap: 16,
    //             yardage: {
    //                 red: 345,
    //                 white: 362,
    //                 blue: 381,
    //             }
    //         },
    //         {
    //             number: 11,
    //             par: 3,
    //             handicap: 14,
    //             yardage: {
    //                 red: 171,
    //                 white: 178,
    //                 blue: 187,
    //             }
    //         },
    //         {
    //             number: 12,
    //             par: 5,
    //             handicap: 10,
    //             yardage: {
    //                 red: 454,
    //                 white: 463,
    //                 blue: 473,
    //             }
    //         },
    //         {
    //             number: 13,
    //             par: 4,
    //             handicap: 18,
    //             yardage: {
    //                 red: 321,
    //                 white: 347,
    //                 blue: 362,
    //             }
    //         },
    //         {
    //             number: 14,
    //             par: 4,
    //             handicap: 8,
    //             yardage: {
    //                 red: 347,
    //                 white: 372,
    //                 blue: 383,
    //             }
    //         },
    //         {
    //             number: 15,
    //             par: 4,
    //             handicap: 2,
    //             yardage: {
    //                 red: 356,
    //                 white: 371,
    //                 blue: 387,
    //             }
    //         },
    //         {
    //             number: 16,
    //             par: 5,
    //             handicap: 4,
    //             yardage: {
    //                 red: 481,
    //                 white: 490,
    //                 blue: 501,
    //             }
    //         },
    //         {
    //             number: 17,
    //             par: 3,
    //             handicap: 6,
    //             yardage: {
    //                 red: 150,
    //                 white: 163,
    //                 blue: 175,
    //             }
    //         },
    //         {
    //             number: 18,
    //             par: 4,
    //             handicap: 12,
    //             yardage: {
    //                 red: 340,
    //                 white: 351,
    //                 blue: 364,
    //             }
    //         },
    //     ]
    // }

function seedDB(){
    courseData.forEach(function(seed){
        Course.create(seed, function(err, course){
          if(err){
              console.log(err);
          } else {
              console.log("Added a course");
              
            }
        });
    });
}

module.exports = seedDB;