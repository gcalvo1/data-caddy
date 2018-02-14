function driveTracker(isFull, club) {
    $.get( 'dashboard/mostrecentround', isFull, function(data) {
        var driveStats = [];
        data.mostRecentRound[0].holes.forEach(function(hole){
            var holeScore = {},
                allClub = club;
            if(club === "All"){
                allClub = hole.teeShot.teeShotClub;
            }
            if(allClub === hole.teeShot.teeShotClub){
                if(hole.score - hole.par === 0){
                    holeScore = {
                        scoreName: 'Par',
                        scoreColor: 'blue',
                        sortVal: 4
                    }
                } else if(hole.score - hole.par === 1){
                    holeScore = {
                        scoreName: 'Bogey',
                        scoreColor: 'red',
                        sortVal: 5
                    }
                } else if(hole.score - hole.par === -1){
                    holeScore = {
                        scoreName: 'Birdie',
                        scoreColor: 'orange',
                        sortVal: 3
                    }
                } else if(hole.score - hole.par === 2){
                    holeScore = {
                        scoreName: 'Double Bogey',
                        scoreColor: 'black',
                        sortVal: 6
                    }
                } else if(hole.score - hole.par === -2){
                    nholeScore = {
                        scoreName: 'Eagle',
                        scoreColor: 'yellow',
                        sortVal: 2
                    }
                } else if(hole.score - hole.par > 2){
                    holeScore = {
                        scoreName: 'Worse Than Double Bogey',
                        scoreColor: 'gray',
                        sortVal: 7
                    }
                } else if(hole.score - hole.par < -2){
                    holeScore = {
                        scoreName: 'Better Than Eagle',
                        scoreColor: 'pink',
                        sortVal: 1
                    }
                }
                var holeStats = {
                    teeShotDirection: hole.teeShot.teeShotDirection,
                    teeShotResult: hole.teeShot.teeShotResult,
                    teeShotClub: hole.teeShot.teeShotClub,
                    holeScore: holeScore
                }
                if(hole.par != 3){
                    driveStats.push(holeStats);
                }
            }
        });
        
        var docCanvas = document.getElementById('driveTracker');
        var ctx = docCanvas.getContext('2d');
        
        var arrowStartPosY = 435;
        var arrowStartPosX = 410;
        
        var scoresFound = [];
        for(let i = 0; i < driveStats.length; i++){
            //Populate Legend
            if(scoresFound.length === 0){
                scoresFound.push(driveStats[i]);
            } else {
                var found = false;
                scoresFound.forEach(function(score){
                    if(score.holeScore.scoreName === driveStats[i].holeScore.scoreName){
                        found = true;
                    }
                });
                if(!found){
                    scoresFound.push(driveStats[i]);
                }
            }
            var arrowEndPosYOrig = 0;
        	var arrowEndPosXOrig = 0;
        	var middlePosYOrig = 0;
        	var randx = 0;
        	var randy = 0;
        	if(driveStats[i].teeShotDirection === 'Right' && driveStats[i].teeShotResult === 'Rough'){
        		arrowEndPosYOrig = 150;
        		arrowEndPosXOrig = 290;
        		middlePosYOrig = 150;
        		randx = Math.floor(Math.random() * 40);
        		randy = Math.floor(Math.random() * 40);
        	} else if(driveStats[i].teeShotDirection === 'Right' && driveStats[i].teeShotResult === 'Bunker') {
        		arrowEndPosYOrig = 75;
        		arrowEndPosXOrig = 310;
        		middlePosYOrig = 75;
        		randx = Math.floor(Math.random() * 40);
        		randy = Math.floor(Math.random() * 65);
        	} else if(driveStats[i].teeShotDirection === 'Right' && driveStats[i].teeShotResult === 'Fescue') {
        		arrowEndPosYOrig = 175;
        		arrowEndPosXOrig = 400;
        		middlePosYOrig = 175;
        		randx = Math.floor(Math.random() * 40);
        		randy = Math.floor(Math.random() * 30);
        	} else if(driveStats[i].teeShotDirection === 'Right' && driveStats[i].teeShotResult === 'Woods') {
        		arrowEndPosYOrig = 50;
        		arrowEndPosXOrig = 450;
        		middlePosYOrig = 50;
        		randx = Math.floor(Math.random() * 25);
        		randy = Math.floor(Math.random() * 75);
        	} else if(driveStats[i].teeShotDirection === 'Right' && driveStats[i].teeShotResult === 'Lost Ball') {
        		arrowEndPosYOrig = 75;
        		arrowEndPosXOrig = 500;
        		middlePosYOrig = 75;
        		randx = Math.floor(Math.random() * 1);
        		randy = Math.floor(Math.random() * 1);
        	} else if(driveStats[i].teeShotDirection === 'Left' && driveStats[i].teeShotResult === 'Rough') {
        		arrowEndPosYOrig = 118;
        		arrowEndPosXOrig = 135;
        		middlePosYOrig = 125;
        		randx = Math.floor(Math.random() * 30);
        		randy = Math.floor(Math.random() * 40);
        	} else if(driveStats[i].teeShotDirection === 'Left' && driveStats[i].teeShotResult === 'Bunker') {
        		arrowEndPosYOrig = 100;
        		arrowEndPosXOrig = 50;
        		middlePosYOrig = 100;
        		randx = Math.floor(Math.random() * 75);
        		randy = Math.floor(Math.random() * 150);
        	} else if(driveStats[i].teeShotDirection === 'Left' && driveStats[i].teeShotResult === 'Fescue') {
        		arrowEndPosYOrig = 142;
        		arrowEndPosXOrig = 25;
        		middlePosYOrig = 142;
        		randx = Math.floor(Math.random() * 50);
        		randy = Math.floor(Math.random() * 1);
        	} else if(driveStats[i].teeShotDirection === 'Left' && driveStats[i].teeShotResult === 'Woods') {
        		arrowEndPosYOrig = 30;
        		arrowEndPosXOrig = 10;
        		middlePosYOrig = 30;
        		randx = Math.floor(Math.random() * 30);
        		randy = Math.floor(Math.random() * 50);
        	} else if(driveStats[i].teeShotDirection === 'Left' && driveStats[i].teeShotResult === 'Lost Ball') {
        		arrowEndPosYOrig = 75;
        		arrowEndPosXOrig = 0;
        		middlePosYOrig = 75;
        		randx = Math.floor(Math.random() * 1);
        		randy = Math.floor(Math.random() * 1);
        	} else if(driveStats[i].teeShotDirection === 'Long' && (driveStats[i].teeShotResult === 'Rough' || driveStats[i].teeShotResult === 'Fescue')) {
        		arrowEndPosYOrig = 25;
        		arrowEndPosXOrig = 245;
        		middlePosYOrig = 25;
        		randx = Math.floor(Math.random() * 40);
        		randy = Math.floor(Math.random() * 10);
        	} else if(driveStats[i].teeShotDirection === 'Fairway') {
        		arrowEndPosYOrig = 100;
        		arrowEndPosXOrig = 180;
        		middlePosYOrig = -100;
        		randx = Math.floor(Math.random() * 75);
        		randy = Math.floor(Math.random() * 75);
        	}
        	
        	var arrowEndPosY = arrowEndPosYOrig;
        	var arrowEndPosX = arrowEndPosXOrig;
        	var middlePosY = middlePosYOrig;			
        	
        	arrowEndPosY = arrowEndPosYOrig + randy;
        	middlePosY = middlePosYOrig + randy;
        	arrowEndPosX = arrowEndPosXOrig + randx;

            // Clear canvas
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
            
            if(club === "All"){
                animatePathDrawing(ctx, arrowStartPosX, arrowStartPosY, 450, middlePosY, arrowEndPosX, arrowEndPosY, 5000, driveStats[i].holeScore.scoreColor);
            }
            else if(club === driveStats[i].teeShotClub) {
                animatePathDrawing(ctx, arrowStartPosX, arrowStartPosY, 450, middlePosY, arrowEndPosX, arrowEndPosY, 5000, driveStats[i].holeScore.scoreColor);
            }
        };
        var legendHtml = ''
        scoresFound.sort(function (a, b) {
            return a.holeScore.sortVal - b.holeScore.sortVal;
        });
        scoresFound.forEach(function(score){
            if(score.holeScore.scoreName === 'Double Bogey'){
                score.holeScore.scoreName = 'Double'
            }
            legendHtml += "<div><span id=legend-circle style='background-color: " + score.holeScore.scoreColor + ";'> </span><span>" + score.holeScore.scoreName + "</span></div>"
        });
        $('#legend-values').html(legendHtml);
    });
};

function animatePathDrawing(ctx, x0, y0, x1, y1, x2, y2, duration, color) {
    var start = null;
    var step = function animatePathDrawingStep(timestamp) {
        if (start === null)
            start = timestamp;
        
        var delta = timestamp - start,
            progress = Math.min(delta / duration, 1);       
        
        // Draw curve
        drawBezierSplit(ctx, x0, y0, x1, y1, x2, y2, 0, progress, color);
        
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    
    window.requestAnimationFrame(step);
}
    
/**
 * Draws a splitted bezier-curve
 * 
 * @param ctx       The canvas context to draw to
 * @param x0        The x-coord of the start point
 * @param y0        The y-coord of the start point
 * @param x1        The x-coord of the control point
 * @param y1        The y-coord of the control point
 * @param x2        The x-coord of the end point
 * @param y2        The y-coord of the end point
 * @param t0        The start ratio of the splitted bezier from 0.0 to 1.0
 * @param t1        The start ratio of the splitted bezier from 0.0 to 1.0
 */
function drawBezierSplit(ctx, x0, y0, x1, y1, x2, y2, t0, t1, color) {
    ctx.beginPath();    
    if( 0.0 == t0 && t1 == 1.0 ) {
        ctx.moveTo( x0, y0 );
        ctx.quadraticCurveTo( x1, y1, x2, y2 );
    } else if( t0 != t1 ) {
        var t00 = t0 * t0,
            t01 = 1.0 - t0,
            t02 = t01 * t01,
            t03 = 2.0 * t0 * t01;
        
        var nx0 = t02 * x0 + t03 * x1 + t00 * x2,
            ny0 = t02 * y0 + t03 * y1 + t00 * y2;
        
        t00 = t1 * t1;
        t01 = 1.0 - t1;
        t02 = t01 * t01;
        t03 = 2.0 * t1 * t01;
        
        var nx2 = t02 * x0 + t03 * x1 + t00 * x2,
            ny2 = t02 * y0 + t03 * y1 + t00 * y2;
        
        var nx1 = lerp ( lerp ( x0 , x1 , t0 ) , lerp ( x1 , x2 , t0 ) , t1 ),
            ny1 = lerp ( lerp ( y0 , y1 , t0 ) , lerp ( y1 , y2 , t0 ) , t1 );
        
        ctx.moveTo( nx0, ny0 );
        ctx.quadraticCurveTo( nx1, ny1, nx2, ny2 );
    }
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.closePath();
}

/**Linearly interpolate between two numbers v0, v1 by t**/
function lerp(v0, v1, t) {
    return ( 1.0 - t ) * v0 + t * v1;
}