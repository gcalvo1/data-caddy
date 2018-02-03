//Set Active Menu
$('.menu_options li').removeClass('active');
$('#new_menu_option').addClass('active');

//Get selection from course dropdown
$("#course_dropdown").change(function() {
    $('.hole_desc').html('');
    var parameters = { course: $("#course_dropdown :selected").text() };
    
    //Set hidden values for form
    $('.hidden_course').val($("#course_dropdown :selected").text());
    
    //Get numHoles options
    $.get( '/coursedropdown',parameters, function(data) {
        $(function() {
            //Set Hole Data
            $.each(data.course.holes, function(i, item) {
                //Handle Par 3 Inputs
                if(item.par === 3) {
                    $('#tsc_' + item.number).prop("disabled", true);
                    $('#tsl_' + item.number).prop("disabled", true);
                    $('#tsd_' + item.number).prop("disabled", true);
                    $('#tsr_' + item.number).prop("disabled", true);
                    $('#atg_' + item.number).prop("disabled", true).prop('selectedIndex', 1);
                }
                else {
                    $('#tsc_' + item.number).prop("disabled", false);
                    $('#tsl_' + item.number).prop("disabled", false);
                    $('#tsd_' + item.number).prop("disabled", false);
                    $('#tsr_' + item.number).prop("disabled", false);
                    $('#atg_' + item.number).prop("disabled", false).prop('selectedIndex', 0);
                }
            });
        });
        
        //Set nine hole dropdown
        if(data.course.isNine && $('#hidden_edit_1').val() != 'edit'){
            $(function() {
                $('#holes_dropdown').prop("disabled", false);
                $('#holes_dropdown').html('<option value=""></option><option value="eighteen">18 Holes</option><option value="front">Front 9</option><option value="back">Back 9</option>');
            });    
        } else if(!data.course.isNine && $('#hidden_edit_1').val() != 'edit'){
            $('#holes_dropdown').html('<option value="eighteen">18 Holes</option>');
            $('#holes_dropdown').prop('selectedIndex', 0);
            $('#holes_dropdown').prop("disabled", true);
            
            fadeInHoles(1, 18);
            $('.hidden_num_holes').val('18 Holes');
        }
        
        //Set Tees Dropdown
        $(function() {
            if($('#tees_dropdown').val() == ''){
                $('#tees_dropdown').prop("disabled", false);
                var html = '<option value=""></option>';
                $.each(data.course.tees, function(i, item) {
                    html = html + '<option value="'+item+'">'+item+'</option>';
                });
                $('#tees_dropdown').html(html).prop('selectedIndex', 0);;
            }
        });
        
        //Set course img
        $('#input_img_div').html("");
        $('#input_img_div').html("<img id='input_img' src='"+ data.course.img + "' alt=''>");
        $('#input_img').addClass("thumb_img");
        
    });
});

//Set hole number and par
$("#course_dropdown").change(function() {
    var parameters = {course: $("#course_dropdown :selected").text()};
    $.get( '/coursedropdown',parameters, function(data) {
        $.each(data.course.holes, function(i, item) {
            $('#hole_' + item.number).html('<p><strong>' + item.number + '</strong></p><p>Par '+ item.par +'</p>');
            $('#hidden_par_' + item.number).val(item.par);
        });
    });
});

//Set hole yardages
$("#tees_dropdown").change(function() {
    var parameters = {course: $("#course_dropdown :selected").text()};
    var teeSelection = $("#tees_dropdown :selected").text().toLowerCase();
    $.get( '/coursedropdown',parameters, function(data) {
        $('.hole_desc_yardage').remove();
        $.each(data.course.holes, function(i, item) {
            $('#hole_' + item.number).html($('#hole_' + item.number).html() + '<p class="hole_desc_yardage">'+item.yardage[teeSelection]+' yds</p>');
            $('#hidden_par_' + item.number).val(item.par);
            $('#hidden_tees_' + item.number).val($("#tees_dropdown :selected").text());
            var teeColor = $('#hidden_tees_' + item.number).val();
            if(teeColor === 'White'){
                teeColor = 'gray';
            }
            $('.hole_desc_yardage').css("color", teeColor);
        });
    });
});

//Calculate score when possible
$(".putts").change(function() {
    var hole_changed = this.id.split('_').pop();
    var putts = parseInt($(this).val());
    var gir = $('#ar_' + hole_changed).val();
    var par = parseInt($("#hidden_par_" + hole_changed).val());
    if(gir === 'GIR'){
        $('#score_' + hole_changed).val(putts + (par - 2));
    }
});

//Set Tee Result when possible
$(".tsd").change(function() {
    var hole_changed = this.id.split('_').pop();
    if($(this).val() === 'Fairway'){
        $('#tsr_' + hole_changed).prop('selectedIndex', 1);
    } else {
        $('#tsr_' + hole_changed).prop('selectedIndex', 0);
    }
});

//Disable approach inputs when approach is not to the green
$(".atg").change(function() {
    var hole_changed = this.id.split('_').pop();
    var atg = $('#atg_' + hole_changed + " :selected").text();
    if(atg === 'No'){
        $('#ac_' + hole_changed).prop('selectedIndex', 0);
        $('#ad_' + hole_changed).prop('selectedIndex', 0);
        $("#al_" + hole_changed).val(null);
        $('#ar_' + hole_changed).prop('selectedIndex', 0);
        $("#ac_" + hole_changed).prop("disabled", true);
        $("#al_" + hole_changed).prop("disabled", true);
        $("#ad_" + hole_changed).prop("disabled", true);
        $("#ar_" + hole_changed).prop("disabled", true);
    } else {
        $("#ac_" + hole_changed).prop("disabled", false);
        $("#al_" + hole_changed).prop("disabled", false);
        $("#ad_" + hole_changed).prop("disabled", false);
        $("#ar_" + hole_changed).prop("disabled", false);
    }
});

//Set Appr. Result when possible
$(".ad").change(function() {
    var hole_changed = this.id.split('_').pop();
    if($(this).val() === 'Green'){
        $('#ar_' + hole_changed).prop('selectedIndex', 1);
    } else {
        $('#ar_' + hole_changed).prop('selectedIndex', 0);
    }
});


//Modify hole options based on selction in number of holes dropdown
$('#holes_dropdown').change(function(){
    var numHoles = $('#holes_dropdown :selected').text();
    
    if (numHoles === '18 Holes') {
        fadeInHoles(1, 18);
        for(let i=1; i<=18; i++){
            $('#hr_' + i).show();
        }
    } else if (numHoles === 'Front 9') {
        fadeInHoles(1, 9);
        fadeOutHoles(10, 18);
        for(let i=1; i<=18; i++){
            if(i >= 10 && $('#hr_' + i).length == 1){
                $('#hr_' + i).hide();
            } else {
                $('#hr_' + i).show();
            }
        }
    } else if (numHoles === 'Back 9') {
        fadeInHoles(10, 18);
        fadeOutHoles(1, 9);
        for(let i=1; i<=18; i++){
            if(i <= 9 && $('#hr_' + i).length == 1){
                $('#hr_' + i).hide();
            } else {
                $('#hr_' + i).show();
            }
        }
    }
    
    $('.hidden_num_holes').val(numHoles);
});

//Save
$(function() {
    $(".save_btn").click(function() {
        var hole_submitted = this.id.split('_').pop(),
            putts = $("input#putts_" + hole_submitted).val(),
            score = $("input#score_" + hole_submitted).val(),
            numHoles = $("#hidden_num_holes_" + hole_submitted).val(),
            course = $("#hidden_course_" + hole_submitted).val(),
            datetime = new Date($("#hidden_datetime_" + hole_submitted).val()),
            holeNumber = hole_submitted,
            par = $("#hidden_par_" + hole_submitted).val(),
            tees = $("#hidden_tees_" + hole_submitted).val(),
            teeShotClub = $("#tsc_" + hole_submitted).val(),
            teeShotLength = $("#tsl_" + hole_submitted).val(),
            teeShotDirection = $("#tsd_" + hole_submitted).val(),
            teeShotResult = $("#tsr_" + hole_submitted).val(),
            approachToGreen = $("#atg_" + hole_submitted).val(),
            approachClub = $("#ac_" + hole_submitted).val(),
            approachLength = $("#al_" + hole_submitted).val(),
            approachDirection = $("#ad_" + hole_submitted).val(),
            approachResult = $("#ar_" + hole_submitted).val()
      
        var data = {
            putts: putts,
            score: score,
            numHoles: numHoles,
            course: course,
            datetime: datetime,
            holeNumber: holeNumber,
            par: par,
            tees: tees,
            teeShotClub: teeShotClub,
            teeShotLength: teeShotLength,
            teeShotDirection: teeShotDirection,
            teeShotResult: teeShotResult,
            approachToGreen: approachToGreen,
            approachClub: approachClub,
            approachLength: approachLength,
            approachDirection: approachDirection,
            approachResult: approachResult
        };
      
        $.ajax({
            url: '/rounds', 
            type: 'POST', 
            data: {round: data},
        });
        
        toggleInputs(hole_submitted,true);
        
        return false;       
    });
});

 //Clear
$(function() {
    $(".clear_btn").click(function() {
        var hole_cleared = this.id.split('_').pop();
        
        resetInputs(hole_cleared);
        toggleInputs(hole_cleared,false);
        
        return false;
    });
});

//Edit
$(function() {
    $(".edit_btn").click(function() {
        var hole_edited = this.id.split('_').pop();
        
        toggleInputs(hole_edited,false);
        
        return false;
    });
});

$('#datetimepicker1').on('dp.change', function() {
    var dateInput = $("#datetimepicker1").find("input").val();
    dateInput = new Date(dateInput);
    $('.hidden_datetime').val(dateInput);
    
    var parameters = { 
        course: $("#course_dropdown :selected").text(),
        numHoles: $('#holes_dropdown :selected').text(),
        date: dateInput
    }
    
    //Set values for pre-submitted rounds
    $.get( '/roundkey',parameters, function(data) {
        $(function() {
            //Set Hole Data
            if(data.round.length > 0){
                var roundObj = data.round[0];
                $.each(roundObj.holes, function(i, hole) {
                    var holeNumber = hole.holeNumber;
                    var approachToGreen = 'No'
                    if(hole.approachToGreen){
                        approachToGreen = 'Yes';
                    }
                    
                    $("input#putts_" + holeNumber).val(hole.putts),
                    $("input#score_" + holeNumber).val(hole.score),
                    teeShotClub = $("#tsc_" + holeNumber).val(hole.teeShotClub),
                    teeShotLength = $("#tsl_" + holeNumber).val(hole.teeShotLength),
                    teeShotDirection = $("#tsd_" + holeNumber).val(hole.teeShotDirection),
                    teeShotResult = $("#tsr_" + holeNumber).val(hole.teeShotResult),
                    approachToGreen = $("#atg_" + holeNumber).val(approachToGreen),
                    approachClub = $("#ac_" + holeNumber).val(hole.approachClub),
                    approachLength = $("#al_" + holeNumber).val(hole.approachLength),
                    approachDirection = $("#ad_" + holeNumber).val(hole.approachDirection),
                    approachResult = $("#ar_" + holeNumber).val(hole.approachResult)
                    
                    $(".atg").trigger("change");
                    
                    if($('#hidden_edit_1').val() != 'edit'){
                        toggleInputs(holeNumber,true);
                    }
                });
            } else {
                for(let i=1; i<=1; i++){
                    resetInputs(i);
                    toggleInputs(i,false);
                };
            }
        });
    });
});


//Datetime picker
$(function () {
    $('#datetimepicker1').datetimepicker();
});

function fadeInHoles(startHole, endHole) {
    for(var i = startHole; i <= endHole; i++){
        if (!$('#form_hole_' + i).is(":visible")) {
            $('#form_hole_' + i).fadeIn();
        }
    }
}

function fadeOutHoles(startHole, endHole) {
    for(var i = startHole; i <= endHole; i++){
        $('#form_hole_' + i).fadeOut();
    }
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

function resetInputs(hole_cleared){
    $("input#putts_" + hole_cleared).val("");
        $("input#score_" + hole_cleared).val("");
        $("#tsc_" + hole_cleared).prop('selectedIndex', 0);
        $("#tsl_" + hole_cleared).val("");
        $("#tsd_" + hole_cleared).prop('selectedIndex', 0);
        $("#tsr_" + hole_cleared).prop('selectedIndex', 0);
        $("#atg_" + hole_cleared).prop('selectedIndex', 0);
        $("#ac_" + hole_cleared).prop('selectedIndex', 0);
        $("#al_" + hole_cleared).val("");
        $("#ad_" + hole_cleared).prop('selectedIndex', 0);
        $("#ar_" + hole_cleared).prop('selectedIndex', 0);
}