$(document).ready(function(){
    $("#title_home").mouseover(function(){
        $("#title_home").css("background-color", "#002654");
    });
    $("#title_home").mouseout(function(){
        $("#title_home").css("background-color", "#0098d8");
    });
});
$(document).ready(function(){
    $("#title_mail").mouseover(function(){
        $("#title_mail").css("background-color", "#002654");
    });
    $("#title_mail").mouseout(function(){
        $("#title_mail").css("background-color", "#0098d8");
    });
});
$(document).ready(function(){
    $("#title_calender").mouseover(function(){
        $("#title_calender").css("background-color", "#002654");
    });
    $("#title_calender").mouseout(function(){
        $("#title_calender").css("background-color", "#0098d8");
    });
});
$(document).ready(function(){
    $("#title_me").mouseover(function(){
        $("#title_me").css("background-color", "#002654");
    });
    $("#title_me").mouseout(function(){
        $("#title_me").css("background-color", "#0098d8");
    });
});
$(document).ready(function(){
    $("#title_setting").mouseover(function(){
        $("#title_setting").css("background-color", "#002654");
    });
    $("#title_setting").mouseout(function(){
        $("#title_setting").css("background-color", "#0098d8");
    });
});

$(document).ready(function(){
    $("#btn_login").mouseover(function(){
        $("#btn_login").css("background-color", "#002654");
    });
    $("#btn_login").mouseout(function(){
        $("#btn_login").css("background-color", "#0098d8");
    });
});
$(document).ready(function(){
    $("#btn_login").mouseover(function(){
        $("#btn_login").css("background-color", "#002654");
    });
    $("#btn_login").mouseout(function(){
        $("#btn_login").css("background-color", "#0098d8");
    });



    $(".round_icons_p").hover(function() {
        $(this).find(".tooltip_menu").show();
    },function() {
        $(this).find(".tooltip_menu").hide();
    });

    $("#dropdown-mailbox").click(function() {
        if($(this).find('.dropdown-list').css('display') === 'none' ) {
            $(this).find('.dropdown-list').show();    
        } else {
            $(this).find('.dropdown-list').hide();
        }
    });

    $("#dropdown-mailbox .items").click(function() {
        $("#dropdown-mailbox .items").removeClass('active');
        $(this).addClass("active");

        $(".dropdown-text").html($(this).html());

        $("#mail_left").find('.mail_left_content_list').css('display', 'none');
        $("#mail_left").find('#maillist_'+$(this).attr('val')).css('display','block');
    });
        

    $("#writeBtn_image").click(function() {
        $(".mail_right").css('display', 'none');
        $("#mail_right_write").show();
    });
});