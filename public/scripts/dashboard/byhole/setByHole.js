function setByHole(parameters) {
    if(!parameters.course){
        $('#no-course').removeClass("hidden");
        $('#no-hole').addClass("hidden");
        $('#hole-data').addClass("hidden");
        $('#by-hole-accordion').addClass("hidden");
    } else if(!parameters.hole) {
        $('#no-course').addClass("hidden");
        $('#no-hole').removeClass("hidden");
        $('#hole-data').addClass("hidden");
        $('#by-hole-accordion').addClass("hidden");
    } else {
        $('#no-hole').addClass("hidden");
        $('#hole-data').removeClass("hidden");
        $('#by-hole-accordion').removeClass("hidden");
        $.get( '/dashboard/byhole', parameters, function(data) {
            var course = data.course[0],
                arrayHole = parameters.hole - 1;
            
            //Set course img
            $('#course_img_div').html("");
            $('#course_img_div').html("<img id='input_img' src='../"+ course.img + "' alt=''>");
            $('#input_img').addClass("banner_img");
            //Set hole number
            $('#hole-number').html("<strong>Hole " + parameters.hole + "</strong>");
            $('#hole-par').html("Par " + course.holes[arrayHole].par);
            //Set tees
            var teesHtml = "";
            for(var teeColor in course.holes[arrayHole].yardage) {
                var length = course.holes[arrayHole].yardage[teeColor];
                teesHtml += "<div class='row tee-row'><span id='legend-circle' style='background-color:"+teeColor+";'> </span><span id='tee-length'>"+length+"</span></div>";
            }
            $('#hole-tees').html(teesHtml);
            //Times Played
            $('#hole-times-played').html(data.timesPlayed);
            //Scoring Avg
            $('#hole-scoring-avg').html(data.scoringAvg);
            //Strokes to Par Avg
            var strokesToParAvg = "";
            if(data.strokesToParAvg == 0){
                strokesToParAvg = "E";
            } else {
                strokesToParAvg = data.strokesToParAvg;
            }
            $('#hole-strokes-to-par-avg').html(strokesToParAvg);
            
            if(course.holes[arrayHole].par == 3){
                $('#approach-panel').addClass("hidden");
                $('#non-par-three-panel').addClass("hidden");
                $('#par-three-panel').removeClass("hidden");
                $('#by-hole-gir-percent').html(data.approach.girPercent);
                $('#by-hole-avg-approach-shot-distance').html(data.approach.avgApproachDistance);
                $('#by-hole-approach-left-percent').html(data.approach.approachMissPercent.left);
                $('#by-hole-approach-right-percent').html(data.approach.approachMissPercent.right);
                $('#by-hole-approach-short-percent').html(data.approach.approachMissPercent.short);
                $('#by-hole-approach-long-percent').html(data.approach.approachMissPercent.long);
                highChartsApproachScatter('score-by-approach-distance','Score by Tee Shot Disctance','Score',data.approach.scoreByApproachDistance);
                highChartsGirByRound('by-hole-gir-line',315,data.approach.girByDate);
            } else {
                $('#approach-panel').removeClass("hidden");
                $('#par-three-panel').addClass("hidden");
                $('#non-par-three-panel').removeClass("hidden");
                //Driving
                $('#by-hole-fir-percent').html(data.driving.firPercent);
                $('#by-hole-avg-tee-shot-distance').html(data.driving.avgDrivingDistance);
                $('#by-hole-tee-left-percent').html(data.driving.driveMissPercent.left);
                $('#by-hole-tee-right-percent').html(data.driving.driveMissPercent.right);
                $('#by-hole-tee-short-percent').html(data.driving.driveMissPercent.short);
                $('#by-hole-tee-long-percent').html(data.driving.driveMissPercent.long);
                highChartsScoreByTeeClub(data.driving.teeClubs);
                highChartsFirByRound('by-hole-fir-line',315,data.driving.firByDate);
                //approach
                $('#by-hole-gir-percent-approach').html(data.approach.girPercent);
                $('#by-hole-avg-approach-shot-distance-approach').html(data.approach.avgApproachDistance);
                $('#by-hole-approach-left-percent-approach').html(data.approach.approachMissPercent.left);
                $('#by-hole-approach-right-percent-approach').html(data.approach.approachMissPercent.right);
                $('#by-hole-approach-short-percent-approach').html(data.approach.approachMissPercent.short);
                $('#by-hole-approach-long-percent-approach').html(data.approach.approachMissPercent.long);
                highChartsApproachScatter('score-by-approach-distance-approach','Score by Approach Disctance','Score',data.approach.scoreByApproachDistance);
                highChartsGirByRound('by-hole-gir-line-approach',315,data.approach.girByDate);
            }
            //scrambling
            $('#by-hole-scramble-percent').html(data.shortgame.scramblePercent);
            $('#by-hole-scramble-sand-save-percent').html(data.shortgame.sandSavePercent);
            $('#by-hole-scramble-putts-per-round').html(data.shortgame.avgPutts);
            $('#by-hole-scramble-three-putts').html(data.shortgame.totalThreePutts);
        });
    }
}