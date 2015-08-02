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

        var html = $(this).html();
        var url = "";
        $("#maillist_in").empty();
        
        // $("#mail_left").find('.mail_left_content_list').css('display', 'none');
        // $("#mail_left").find('#maillist_'+).css('display','block');
        if( $(this).attr('val') === 'in') {
            url = './mail/getReceiveMailData';
        } if( $(this).attr('val') === 'out') {
            url = './mail/getAllMailData';
        } else {
            $(".dropdown-text").html(html+ "( 0 )");
        }

        $.ajax({
            type: "POST",
            url: url
        }).done(function(data) {
            data = data.row;
            $(".dropdown-text").html(html+ "( "+ data.length + " )");
            // $('.dropdown-text .in_count').html();

            $.each(data, function(i, v) {
    // overlay  
                var temp ='<div class="mail_left_content" val="'+ v._id +'">';
                    temp += '<div class="mail_left_list_attr ">';
                    temp +=     '<div class="list_attr_img">';
                    temp +=         '<div class="list_attr_img_r">';
                    temp +=             '<span class="list_attr_img_txt">'+v.receiveMember[0].name.slice(0,1) +'</span>';
                    temp +=         '</div>';
                    temp +=     '</div>';
                    temp +=     '<div class="list_attr_title">';
                    temp +=         '<span class="list_attr_title1">';

                    $.each(v.receiveMember, function(i2, v2) {
                        if(i2 >3) return false;
                        else {
                            temp += v2.name;
                            if(i2!= v.receiveMember.length-1 && i2!==2) {
                                temp += ", ";
                            }
                        }
                    });
                    temp += '</span>';
                    temp += '<span class="list_attr_title2">';

                    if(v.receiveMember.length >4) {
                        temp += "외 "+ (v.receiveMember.length-3) + "명";
                    }

                    temp += '</span>';
                    temp += '<span class="list_attr_time"> '+ moment.unix( v.date).format('YY-MM-DD hh:mm') + ' </span>';
                    temp +=     '</div>';
                    temp +=     '<div class="list_attr_text">';
                    temp +=         '<span class="list_attr_text1"> '+( v.title.length>15? v.title.substr(0, 14)+"...": v.title) + ' </span>';
                    temp +=     '</div>';
                    temp +=     '<div class="list_attr_time">';
                    temp +=     '</div>';
                    temp += '</div>';
                    temp += '</div>';

                $("#maillist_in").append(temp);

            });
          
        });
    });
        

    $("#writeBtn_image").click(function() {
        $(".mail_right").css('display', 'none');
        $("#mail_right_write").show();
    });
});