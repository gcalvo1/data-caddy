var express = require("express");
var router = express.Router();
var Round = require("../models/round");
var Course = require("../models/course");
var middleware = require("../middleware");
var AWS = require('aws-sdk');

router.get("/", middleware.isLoggedIn, function (req, res) {
    Round.find({ "player.id": req.user._id }).populate("course").exec(function (err, rounds) {
        var numFullRounds = 0,
            numNineRounds = 0;
        if (err) {
            console.log(err);
        } else {
            //Dashboard data to be returned
            var roundTypes = [
                {
                    numHoles: '18 Holes',
                    found: false
                },
                {
                    numHoles: '9 Holes',
                    found: false
                }
            ];
            rounds.forEach(function (round) {
                if (round.isFull && round.isComplete) {
                    numFullRounds++;
                } else if (!round.isFull && round.isComplete) {
                    numNineRounds++;
                }
            });
            if (numFullRounds > 0) {
                roundTypes[0].found = true;
            }
            if (numNineRounds > 0) {
                roundTypes[1].found = true;
            }

            // AWS.config.loadFromPath('./s3_config.json');

            var s3Bucket = new AWS.S3({ params: { Bucket: 'data-caddy-profile-pics' } });
            var urlParams = { Bucket: 'data-caddy-profile-pics', Key: req.user.username + req.user.imgExt };
            s3Bucket.getSignedUrl('getObject', urlParams, function (err, url) {
                if (err) {
                    console.log(err);
                } else {
                    res.render("dashboard/index", {
                        user: req.user,
                        roundTypes: roundTypes,
                        userImg: url
                    });
                }
            });
        }
    });
});

router.get("/roundsdata", middleware.isLoggedIn, function (req, res) {
    Round.find({ "player.id": req.user._id, isFull: req.query.isFull, date: { $gte: req.query.dateFrom, $lte: req.query.dateTo }, isComplete: true }).populate("course").exec(function (err, rounds) {
        if (err) {
            console.log(err);
        } else {
            //Dashboard data to be returned
            var numRounds = 0,
                totalScore = 0,
                totalScoreToPar = 0,
                numScoreNames = {
                    par: 0,
                    bogey: 0,
                    birdie: 0,
                    doubleBogey: 0,
                    eagle: 0,
                    bogeyWorse: 0,
                    eagleBetter: 0
                },
                scoreByDate = [],
                scoreByCourse = [],
                allClubs = [
                    {
                        clubName: 'Driver',
                        teeFound: false,
                        approachFound: false
                    },
                    {
                        clubName: '3W',
                        teeFound: false,
                        approachFound: false
                    },
                    {
                        clubName: '5W',
                        teeFound: false,
                        approachFound: false
                    },
                    {
                        clubName: 'Rescue',
                        teeFound: false
                    },
                    {
                        clubName: '3I',
                        teeFound: false,
                        approachFound: false
                    },
                    {
                        clubName: '4I',
                        teeFound: false,
                        approachFound: false
                    },
                    {
                        clubName: '5I',
                        teeFound: false,
                        approachFound: false
                    },
                    {
                        clubName: '6I',
                        teeFound: false,
                        approachFound: false
                    },
                    {
                        clubName: '7I',
                        teeFound: false,
                        approachFound: false
                    },
                    {
                        clubName: '8I',
                        teeFound: false,
                        approachFound: false
                    },
                    {
                        clubName: '9I',
                        teeFound: false,
                        approachFound: false
                    },
                    {
                        clubName: 'PW',
                        teeFound: false,
                        approachFound: false
                    },
                    {
                        clubName: 'GW',
                        teeFound: false,
                        approachFound: false
                    },
                    {
                        clubName: 'SW',
                        teeFound: false,
                        approachFound: false
                    },
                    {
                        clubName: 'LW',
                        teeFound: false,
                        approachFound: false
                    }
                ],
                totalScoreByHolePar = {
                    parThree: {
                        score: 0,
                        numHoles: 0
                    },
                    parFour: {
                        score: 0,
                        numHoles: 0
                    },
                    parFive: {
                        score: 0,
                        numHoles: 0
                    }
                },
                scoreNames = [],
                weatherIcons = [],
                windSpeed = [],
                temperature = [];
            rounds.forEach(function (round) {
                var roundScore = 0,
                    roundPar = 0,
                    roundData = [],
                    roundFirs = 0,
                    roundTeeShots = 0,
                    roundGirs = 0,
                    roundApproaches = 0;
                numRounds++;
                roundData.push(round.date);
                round.holes.forEach(function (hole) {
                    totalScore += hole.score;
                    roundScore += hole.score;
                    roundPar += hole.par;
                    //Set Score Names
                    if (hole.score - hole.par === 0) {
                        numScoreNames.par++;
                    } else if (hole.score - hole.par === 1) {
                        numScoreNames.bogey++;
                    } else if (hole.score - hole.par === -1) {
                        numScoreNames.birdie++;
                    } else if (hole.score - hole.par === 2) {
                        numScoreNames.doubleBogey++;
                    } else if (hole.score - hole.par === -2) {
                        numScoreNames.eagle++;
                    } else if (hole.score - hole.par > 2) {
                        numScoreNames.bogeyWorse++;
                    } else if (hole.score - hole.par < -2) {
                        numScoreNames.eagleBetter++;
                    }
                    if (hole.par === 3) {
                        totalScoreByHolePar.parThree.score += hole.score;
                        totalScoreByHolePar.parThree.numHoles++;
                        roundApproaches++;
                        if (hole.approach.approachResult === "GIR" || hole.approach.approachResult === "Under GIR") {
                            roundGirs++;
                        }
                    } else if (hole.par === 4) {
                        totalScoreByHolePar.parFour.score += hole.score;
                        totalScoreByHolePar.parFour.numHoles++;
                        //Found tee club
                        allClubs.forEach(function (club) {
                            if (club.clubName === hole.teeShot.teeShotClub) {
                                club.teeFound = true;
                            }
                            if (club.clubName === hole.approach.approachClub) {
                                club.approachFound = true;
                            }
                        });
                        roundTeeShots++;
                        roundApproaches++;
                        if (hole.teeShot.teeShotResult === "FIR") {
                            roundFirs++;
                        }
                        if (hole.approach.approachResult === "GIR" || hole.approach.approachResult === "Under GIR") {
                            roundGirs++;
                        }
                    } else {
                        totalScoreByHolePar.parFive.score += hole.score;
                        totalScoreByHolePar.parFive.numHoles++;
                        //Found tee club
                        allClubs.forEach(function (club) {
                            if (club.clubName === hole.teeShot.teeShotClub) {
                                club.teeFound = true;
                            }
                            if (club.clubName === hole.approach.approachClub) {
                                club.approachFound = true;
                            }
                        });
                        roundTeeShots++;
                        roundApproaches++;
                        if (hole.teeShot.teeShotResult === "FIR") {
                            roundFirs++;
                        }
                        if (hole.approach.approachResult === "GIR" || hole.approach.approachResult === "Under GIR") {
                            roundGirs++;
                        }
                    }
                });
                //weather
                if (round.weather.icon) {
                    if (weatherIcons.length === 0) {
                        weatherIcons.push(
                            {
                                icon: round.weather.icon,
                                score: roundScore,
                                scoreToPar: roundScore - roundPar,
                                rounds: 1
                            }
                        );
                    } else {
                        var found = false;
                        weatherIcons.forEach(function (icon) {
                            if (icon.icon === round.weather.icon) {
                                found = true;
                                icon.score += roundScore;
                                icon.scoreToPar += roundScore - roundPar;
                                icon.rounds++;
                            }
                        });
                        if (!found) {
                            weatherIcons.push(
                                {
                                    icon: round.weather.icon,
                                    score: roundScore,
                                    scoreToPar: roundScore - roundPar,
                                    rounds: 1
                                }
                            );
                        }
                    }
                }
                var windCategory = "";
                if (round.weather.windSpeed) {
                    if (round.weather.windSpeed < 10) {
                        windCategory = "0 - 10 mph";
                    } else if (round.weather.windSpeed >= 10 && round.weather.windSpeed < 20) {
                        windCategory = "10 - 20 mph";
                    } else if (round.weather.windSpeed >= 20 && round.weather.windSpeed < 30) {
                        windCategory = "20 - 30 mph";
                    } else if (round.weather.windSpeed >= 30 && round.weather.windSpeed < 40) {
                        windCategory = "30 - 40 mph";
                    } else {
                        windCategory = "40+ mph";
                    }
                    if (windSpeed.length === 0) {
                        windSpeed.push(
                            {
                                category: windCategory,
                                score: roundScore,
                                scoreToPar: roundScore - roundPar,
                                roundTeeShots: roundTeeShots,
                                roundFirs: roundFirs,
                                roundApproaches: roundApproaches,
                                roundGirs: roundGirs,
                                rounds: 1
                            }
                        );
                    } else {
                        var windFound = false;
                        windSpeed.forEach(function (speed) {
                            if (speed.category === windCategory) {
                                windFound = true;
                                speed.score += roundScore;
                                speed.scoreToPar += roundScore - roundPar;
                                speed.roundTeeShots += roundTeeShots;
                                speed.roundFirs += roundFirs;
                                speed.roundApproaches += roundApproaches;
                                speed.roundGirs += roundGirs;
                                speed.rounds++;
                            }
                        });
                        if (!windFound) {
                            windSpeed.push(
                                {
                                    category: windCategory,
                                    score: roundScore,
                                    scoreToPar: roundScore - roundPar,
                                    roundTeeShots: roundTeeShots,
                                    roundFirs: roundFirs,
                                    roundApproaches: roundApproaches,
                                    roundGirs: roundGirs,
                                    rounds: 1
                                }
                            );
                        }
                    }
                }
                //Temperature
                var tempCategory = "";
                if (round.weather.temperature) {
                    if (round.weather.temperature < 50) {
                        tempCategory = "0 - 50 Degrees";
                    } else if (round.weather.temperature >= 50 && round.weather.temperature < 60) {
                        tempCategory = "50 - 60 Degrees";
                    } else if (round.weather.temperature >= 60 && round.weather.temperature < 70) {
                        tempCategory = "60 - 70 Degrees";
                    } else if (round.weather.temperature >= 70 && round.weather.temperature < 80) {
                        tempCategory = "70 - 80 Degrees";
                    } else if (round.weather.temperature >= 80 && round.weather.temperature < 90) {
                        tempCategory = "80 - 90 Degrees";
                    } else {
                        tempCategory = "90+ Degrees";
                    }
                    if (temperature.length === 0) {
                        temperature.push(
                            {
                                category: tempCategory,
                                score: roundScore,
                                scoreToPar: roundScore - roundPar,
                                roundTeeShots: roundTeeShots,
                                roundFirs: roundFirs,
                                roundApproaches: roundApproaches,
                                roundGirs: roundGirs,
                                rounds: 1
                            }
                        );
                    } else {
                        var tempFound = false;
                        temperature.forEach(function (temp) {
                            if (temp.category === tempCategory) {
                                tempFound = true;
                                temp.score += roundScore;
                                temp.scoreToPar += roundScore - roundPar;
                                temp.roundTeeShots += roundTeeShots;
                                temp.roundFirs += roundFirs;
                                temp.roundApproaches += roundApproaches;
                                temp.roundGirs += roundGirs;
                                temp.rounds++;
                            }
                        });
                        if (!tempFound) {
                            temperature.push(
                                {
                                    category: tempCategory,
                                    score: roundScore,
                                    scoreToPar: roundScore - roundPar,
                                    roundTeeShots: roundTeeShots,
                                    roundFirs: roundFirs,
                                    roundApproaches: roundApproaches,
                                    roundGirs: roundGirs,
                                    rounds: 1
                                }
                            );
                        }
                    }
                }
                roundData.push(roundScore);
                scoreByDate.push(roundData);
                scoreByCourse.push(
                    {
                        name: round.courseName,
                        latitude: round.course[0].location.latitude,
                        longitude: round.course[0].location.longitude,
                        score: roundScore,
                        rounds: 1
                    });
                totalScoreToPar += (roundScore - roundPar);
            });
            if (numScoreNames.par > 0) {
                scoreNames.push({ name: "Par", y: numScoreNames.par });
            }
            if (numScoreNames.bogey > 0) {
                scoreNames.push({ name: "Bogey", y: numScoreNames.bogey });
            }
            if (numScoreNames.birdie > 0) {
                scoreNames.push({ name: "Birdie", y: numScoreNames.birdie });
            }
            if (numScoreNames.doubleBogey > 0) {
                scoreNames.push({ name: "Double Bogey", y: numScoreNames.doubleBogey });
            }
            if (numScoreNames.eagle > 0) {
                scoreNames.push({ name: "Eagle", y: numScoreNames.eagle });
            }
            if (numScoreNames.bogeyWorse > 0) {
                scoreNames.push({ name: "Bogey Worse", y: numScoreNames.bogeyWorse });
            }
            if (numScoreNames.eagleBetter > 0) {
                scoreNames.push({ name: "Eagle Better", y: numScoreNames.eagleBetter });
            }
        }
        var avgScore =
        {
            avgScore: totalScore / numRounds,
            avgScoreToPar: totalScoreToPar / numRounds,
            scoreByDate: scoreByDate,
            avgScoreByHolePar: {
                parThree: totalScoreByHolePar.parThree.score / totalScoreByHolePar.parThree.numHoles,
                parFour: totalScoreByHolePar.parFour.score / totalScoreByHolePar.parFour.numHoles,
                parFive: totalScoreByHolePar.parFive.score / totalScoreByHolePar.parFive.numHoles
            }
        };
        var dataToSend =
        {
            rounds: rounds,
            avgScore,
            user: req.user,
            numScoreNames,
            scoreNames: scoreNames,
            scoreByCourse: scoreByCourse,
            allClubs: allClubs,
            weatherIcons: weatherIcons,
            windSpeed: windSpeed,
            temperature: temperature
        };
        res.send(dataToSend);
    });
});

router.get("/mostrecentround", middleware.isLoggedIn, function (req, res) {
    Round.find({ "player.id": req.user._id, isFull: req.query.isFull, date: { $gte: req.query.dtDateFrom, $lte: req.query.dtDateTo }, isComplete: true }).populate("course").exec(function (err, mostRecentRound) {
        if (err) {
            console.log(err);
        } else {
            res.send({ mostRecentRound: mostRecentRound });
        }
    });
});

router.get("/getcourses", middleware.isLoggedIn, function (req, res) {
    Round.find({ "player.id": req.user._id, date: { $gte: req.query.dateFrom, $lte: req.query.dateTo }, isComplete: true }).populate("course").exec(function (err, rounds) {
        if (err) {
            console.log(err);
        } else {
            var courseList = [];
            rounds.forEach(function (round) {
                if (courseList.length == 0) {
                    var courseName = round.courseName,
                        holes = [];
                    round.course[0].holes.forEach(function (hole) {
                        holes.push(hole.number);
                    });
                    holes.sort(function (a, b) { return a - b });
                    courseList.push({
                        name: courseName,
                        holes: holes
                    });
                } else {
                    rounds.forEach(function (round) {
                        var found = false;
                        for (let i = 0; i < courseList.length; i++) {
                            if (round.courseName === courseList[i].name) {
                                if (round.course[0].holes.length > courseList[i].holes.length) {
                                    courseList.splice(i, 1);
                                } else {
                                    found = true;
                                }
                            }
                        }
                        if (!found) {
                            var courseName = round.courseName,
                                holes = [];
                            round.course[0].holes.forEach(function (hole) {
                                holes.push(hole.number);
                            });
                            holes.sort(function (a, b) { return a - b });
                            courseList.push({
                                name: courseName,
                                holes: holes
                            });
                        }
                    });
                }
            });
            function compare(a, b) {
                if (a.name < b.name)
                    return -1;
                if (a.name > b.name)
                    return 1;
                return 0;
            }
            courseList.sort(compare);
            res.send({ courses: courseList });
        }
    });
});

router.get("/byhole", middleware.isLoggedIn, function (req, res) {
    Round.find({ "player.id": req.user._id, date: { $gte: req.query.dateFrom, $lte: req.query.dateTo }, courseName: req.query.course, isComplete: true }).populate("course").exec(function (err, rounds) {
        if (err) {
            console.log(err);
        } else {
            var timesPlayed = 0,
                totalScore = 0,
                totalStrokesToPar = 0,
                totalParThreeDistance = 0,
                totalDrivingDistance = 0,
                totalDrivesWithDistance = 0,
                totalFirs = 0,
                totalDriveMiss = {
                    right: 0,
                    left: 0,
                    short: 0,
                    long: 0
                },
                firByDate = [],
                teeClubs = [],
                totalGirs = 0,
                totalApproaches = 0,
                totalNonApproches = 0,
                totalApproachDistance = 0,
                totalApproachMiss = {
                    right: 0,
                    left: 0,
                    short: 0,
                    long: 0,
                    gir: 0,
                },
                girByDate = [],
                scoreByApproachDistance = [],
                totalScrambleAttempts = 0,
                totalScrambles = 0,
                totalSandSaveAttempts = 0,
                totalSandSaves = 0,
                totalPutts = 0,
                totalThreePutts = 0,
                totalOnePutts = 0,
                course;
            rounds.forEach(function (round) {
                course = round.course;
                round.holes.forEach(function (hole) {
                    if (hole.holeNumber == req.query.hole) {
                        timesPlayed++;
                        totalScore += hole.score;
                        totalStrokesToPar += hole.score - hole.par;

                        //Par 3's
                        if (hole.par == 3) {
                            totalParThreeDistance += hole.approach.approachLength;
                        } else {
                            //Par 4's & 5's   
                            //Driving
                            var holeFirData = [];
                            holeFirData.push(round.date);
                            if (hole.teeShot.teeShotLength) {
                                totalDrivesWithDistance++;
                                totalDrivingDistance += hole.teeShot.teeShotLength;
                            }
                            if (hole.teeShot.teeShotResult === "FIR") {
                                totalFirs++;
                                holeFirData.push(1);
                            } else {
                                holeFirData.push(0);
                            }
                            if (hole.teeShot.teeShotDirection === "Right") {
                                totalDriveMiss.right++;
                            } else if (hole.teeShot.teeShotDirection === "Left") {
                                totalDriveMiss.left++;
                            } else if (hole.teeShot.teeShotDirection === "Long") {
                                totalDriveMiss.long++;
                            } else if (hole.teeShot.teeShotDirection === "Short") {
                                totalDriveMiss.short++;
                            }
                            var scoreName;
                            //Set Score Names
                            if (hole.score - hole.par === 0) {
                                scoreName = "Par";
                            } else if (hole.score - hole.par === 1) {
                                scoreName = "Bogey";
                            } else if (hole.score - hole.par === -1) {
                                scoreName = "Birdie";
                            } else if (hole.score - hole.par === 2) {
                                scoreName = "Double Bogey";
                            } else if (hole.score - hole.par === -2) {
                                scoreName = "Eagle";
                            } else if (hole.score - hole.par > 2) {
                                scoreName = "Bogey Worse";
                            } else if (hole.score - hole.par < -2) {
                                scoreName = "Eagle Better";
                            }

                            var teeObj = {
                                name: hole.teeShot.teeShotClub
                            };
                            teeObj[scoreName] = 1;

                            //Set Tee Club Array
                            if (teeClubs.length == 0) {
                                teeClubs.push(teeObj);
                            } else {
                                var found = false;
                                teeClubs.forEach(function (club) {
                                    if (club.name == hole.teeShot.teeShotClub) {
                                        found = true;
                                        var scoreFound = false;
                                        for (var score in club) {
                                            if (score == scoreName) {
                                                club[score]++;
                                                scoreFound = true;
                                            }
                                        }
                                        if (!scoreFound) {
                                            club[scoreName] = 1;
                                        }
                                    }
                                });
                                if (!found) {
                                    teeClubs.push(teeObj);
                                }
                            }
                            firByDate.push(holeFirData);
                        }
                        //Approach
                        var holeGirData = [];
                        holeGirData.push(round.date);
                        if (hole.approach.approachToGreen) {
                            totalApproaches++;
                            totalApproachDistance += hole.approach.approachLength;
                            scoreByApproachDistance.push([hole.approach.approachLength, hole.score]);
                        } else {
                            totalNonApproches++;
                        }
                        //Set directional miss
                        if (hole.approach.approachResult === "GIR" || hole.approach.approachResult === "Under GIR") {
                            totalGirs++;
                            totalApproachMiss.gir++;
                            holeGirData.push(1);
                        } else {
                            holeGirData.push(0);
                        }
                        if (hole.approach.approachDirection === "Right") {
                            totalApproachMiss.right++;
                        } else if (hole.approach.approachDirection === "Left") {
                            totalApproachMiss.left++;
                        } else if (hole.approach.approachDirection === "Long") {
                            totalApproachMiss.long++;
                        } else if (hole.approach.approachDirection === "Short") {
                            totalApproachMiss.short++;
                        }
                        girByDate.push(holeGirData);
                        //Scrambling
                        if (!hole.approach.approachResult || (hole.approach.approachResult != "GIR" && hole.approach.approachResult != "Under GIR")) {
                            totalScrambleAttempts++;
                            if (hole.score <= hole.par) {
                                totalScrambles++;
                            }
                        }
                        if (hole.approach.approachResult === "Bunker") {
                            totalSandSaveAttempts++;
                            if (hole.score <= hole.par) {
                                totalSandSaves++;
                            }
                        }
                        totalPutts += hole.putts;
                        if (hole.putts == 1) {
                            totalOnePutts++;
                        } else if (hole.putts >= 3) {
                            totalThreePutts++;
                        }
                    }
                });
            });

            var scoringAvg = (Math.round((totalScore / timesPlayed) * 10) / 10),
                strokesToParAvg = (Math.round((totalStrokesToPar / timesPlayed) * 10) / 10),
                avgParThreeDistance = (Math.round((totalParThreeDistance / timesPlayed) * 10) / 10),
                avgApproachDistance = (Math.round((totalApproachDistance / totalApproaches) * 10) / 10),
                avgPutts = (Math.round((totalPutts / timesPlayed) * 10) / 10),
                firPercent = (Math.round(((totalFirs / timesPlayed) * 100) * 10) / 10 + "%"),
                girPercent = (Math.round(((totalGirs / timesPlayed) * 100) * 10) / 10 + "%"),
                driveMissPercent = {
                    right: (Math.round(((totalDriveMiss.right / timesPlayed) * 100) * 10) / 10 + "%"),
                    left: (Math.round(((totalDriveMiss.left / timesPlayed) * 100) * 10) / 10 + "%"),
                    long: (Math.round(((totalDriveMiss.long / timesPlayed) * 100) * 10) / 10 + "%"),
                    short: (Math.round(((totalDriveMiss.short / timesPlayed) * 100) * 10) / 10 + "%")
                },
                approachMissPercent = {
                    right: (Math.round(((totalApproachMiss.right / timesPlayed) * 100) * 10) / 10 + "%"),
                    left: (Math.round(((totalApproachMiss.left / timesPlayed) * 100) * 10) / 10 + "%"),
                    long: (Math.round(((totalApproachMiss.long / timesPlayed) * 100) * 10) / 10 + "%"),
                    short: (Math.round(((totalApproachMiss.short / timesPlayed) * 100) * 10) / 10 + "%")
                },
                scramblePercent,
                sandSavePercent;

            if (strokesToParAvg > 0) {
                strokesToParAvg = "+" + strokesToParAvg;
            }
            var avgDrivingDistance;
            if (totalDrivesWithDistance == 0) {
                avgDrivingDistance = "N/A";
            } else {
                avgDrivingDistance = (Math.round((totalDrivingDistance / totalDrivesWithDistance) * 10) / 10) + " yds";
            }
            if (totalScrambleAttempts == 0) {
                scramblePercent = "N/A";
            } else {
                scramblePercent = (Math.round(((totalScrambles / totalScrambleAttempts) * 100) * 10) / 10 + "%");
            }
            if (totalSandSaveAttempts == 0) {
                sandSavePercent = "N/A";
            } else {
                sandSavePercent = (Math.round(((totalSandSaves / totalSandSaveAttempts) * 100) * 10) / 10 + "%");
            }
            res.send(
                {
                    course: course,
                    timesPlayed: timesPlayed,
                    scoringAvg: scoringAvg,
                    strokesToParAvg: strokesToParAvg,
                    driving: {
                        avgDrivingDistance: avgDrivingDistance,
                        driveMissPercent: driveMissPercent,
                        firPercent: firPercent,
                        firByDate: firByDate,
                        teeClubs: teeClubs
                    },
                    approach: {
                        avgApproachDistance: avgApproachDistance,
                        girPercent: girPercent,
                        approachMissPercent: approachMissPercent,
                        totalNoApproches: totalNonApproches,
                        scoreByApproachDistance: scoreByApproachDistance,
                        girByDate: girByDate
                    },
                    shortgame: {
                        avgPutts: avgPutts,
                        scramblePercent: scramblePercent,
                        totalThreePutts: totalThreePutts,
                        totalOnePutts: totalOnePutts,
                        sandSavePercent: sandSavePercent
                    },
                    avgParThreeDistance: avgParThreeDistance,
                }
            );
        }
    });
});


module.exports = router;