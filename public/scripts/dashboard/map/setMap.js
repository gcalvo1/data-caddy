function setMap(parameters) {
    $.get( '/dashboard/roundsdata', parameters, function(data) {
        var courseList = [];
        data.scoreByCourse.forEach(function(round){
            if (courseList.lenth === 0){
                courseList.push(round.course);
            } else {
                var found = false;
                courseList.forEach(function(course){
                    if(course[0] === round.name) {
                        found = true;
                        course[3] += Math.round(round.score * 10);
                        course[4] ++;
                    }
                });
                if(!found) {
                    courseList.push(
                        [
                            round.name,
                            round.latitude,
                            round.longitude,
                            round.score,
                            round.rounds
                        ]
                    );
                }
            }
        });
        
        var map = new google.maps.Map(document.getElementById('map-api'), {
          zoom: 7,
          center: new google.maps.LatLng(39.909736, -98.522109)
        });
    
        var infowindow = new google.maps.InfoWindow();
    
        var marker, i;
        var bound = new google.maps.LatLngBounds();
    
        for (i = 0; i < courseList.length; i++) {  
          marker = new google.maps.Marker({
            position: new google.maps.LatLng(courseList[i][1], courseList[i][2]),
            map: map
          });
          
          //Fit map to screen based on points
          bound.extend( new google.maps.LatLng(courseList[i][1], courseList[i][2]) );
          
          google.maps.event.addListener(marker, 'click', (function(marker, i) {
            return function() {
              infowindow.setContent("<span style='margin-left:5%;margin-right:5%;'><strong>" + courseList[i][0] + "</strong></span><hr> Average Score: <strong>" + courseList[i][3] / courseList[i][4] +"</strong><br/> # of Rounds: <strong>" + courseList[i][4] + "</strong>");
              infowindow.open(map, marker);
            }
          })(marker, i));
        }
        map.fitBounds(bound);
    });
}