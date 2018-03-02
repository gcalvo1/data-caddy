var tee_color = 'black';
if($('#tee_color').text().trim().toLowerCase() === 'white'){
    tee_color = 'gray';
} else {
    tee_color = $('#tee_color').text().toLowerCase();
}
$('.tee_color').css('color', tee_color);

//Set score indicator
var par_list = [];
var parameters = {course: $('#course_name').text()};
$.get( '/coursedropdown',parameters, function(data) {
    $.each(data.course.holes, function(i, hole) {
        par_list.push(hole.par);
    });

    var score_list = [];
    for(let i=1; i<=18; i++){
      score_list.push(parseInt($('#score_' + i).text())); 
    }
    
    for(let i=1; i<=18; i++){
        var scoreToPar = score_list[i - 1] - par_list[i - 1];
        if(scoreToPar == 1){
            $('#score_' + i).addClass('bogey');
        } else if(scoreToPar == -1){
            $('#score_' + i).addClass('birdie');
        } else if(scoreToPar == 2){
            $('#score_' + i).addClass('double_bogey');
        } else if(scoreToPar == -2){
            $('#score_' + i).addClass('eagle');
        } else if(scoreToPar > 2){
            $('#score_' + i).addClass('bogey_plus');
        } else if(scoreToPar < -2){
            $('#score_' + i).addClass('birdie_minus');
        }
    }
});

var rawDate = new Date($('#round_date').text());
var formattedDate = formatDate(rawDate);
$('#round_date').text(formattedDate);

function formatDate(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0'+minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return date.getMonth()+1 + "/" + date.getDate() + "/" + date.getFullYear() + "  " + strTime;
}