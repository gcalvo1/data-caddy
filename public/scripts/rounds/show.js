var tee_color = 'black';
if($('#tee_color').text().toLowerCase() === 'white'){
    tee_color = 'gray';
} else {
    tee_color = $('#tee_color').text().toLowerCase();
}
$('.tee_color').css('color', tee_color);

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