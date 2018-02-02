//Set Dropdowns
var courseName = $('#hidden_course_1').val(),
    numHoles = $('#hidden_num_holes_1').val(),
    tees = $('#hidden_tees_1').val(),
    date = new Date($('#hidden_datetime_1').val()),
    formattedDate = formatDate(date);

setOption(document.getElementById('course_dropdown'), courseName);
$("#course_dropdown").trigger("change");
setOption(document.getElementById('holes_dropdown'), numHoles);
$("#holes_dropdown").trigger("change");
setOption(document.getElementById('tees_dropdown'), tees);
$("#tees_dropdown").trigger("change");
$('#datetimepicker1').find("input").val(formattedDate);

//Disable Round Key Inputs
$('#course_dropdown').prop("disabled", true);
$('#holes_dropdown').prop("disabled", true);
$('#tees_dropdown').prop("disabled", true);
$('#datetimepicker1  > .form-control').prop("disabled", true);

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

function setOption(selectElement, value) {
    var options = selectElement.options;
    for (var i = 0; i < options.length; i++)  {
        if (options[i].value == value) {
            selectElement.selectedIndex = i;
            return true;
        }
    }
    return false;
}

function toggleInputs(hole_submitted, bool){
    $('#fir_' + hole_submitted).prop("disabled", bool);
    $('#gir_' + hole_submitted).prop("disabled", bool);
    $("input#score_" + hole_submitted).prop("disabled", bool);
    $("input#putts_" + hole_submitted).prop("disabled", bool);
    $("#tsc_" + hole_submitted).prop("disabled", bool);
    $("#tsl_" + hole_submitted).prop("disabled", bool);
    $("#tsd_" + hole_submitted).prop("disabled", bool);
    $("#tsr_" + hole_submitted).prop("disabled", bool);
    $("#atg_" + hole_submitted).prop("disabled", bool);
    $("#ac_" + hole_submitted).prop("disabled", bool);
    $("#al_" + hole_submitted).prop("disabled", bool);
    $("#ad_" + hole_submitted).prop("disabled", bool);
    $("#ar_" + hole_submitted).prop("disabled", bool);
    $('#submit_' + hole_submitted).prop("disabled", bool);
    
    if(bool){
        $('#submit_' + hole_submitted).html('Saved');
    } else {
        $('#submit_' + hole_submitted).html('Save');
    }
}
