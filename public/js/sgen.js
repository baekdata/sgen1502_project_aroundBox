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
            $(".mail_left_content").unbind("click");
            $(".mail_left_content").bind("click", function() {
                var mail_id = $(this).attr('val');
            $.ajax({
                type: "POST",
                url: '/mail/getMail',
                data: { mail_id : mail_id }
            }).done(function(data) {
                $("#mail_right_view").empty();
                var like_on = (data.like_on == true )? 'right_star_y.png' : 'right_star.png';
                var star_on = (data.star_on == true) ? 'right_like_y.png' : 'right_like.png';
                data = data.row[0];

                var temp =    '<div id="mail_right_top">'
                    if(data.attach.length>0) {
                        temp +=    '<img src="./images/right_clip.png" id="right_clip_image"/>'    
                    }
                    temp +=    '<span class="right_clip_text"> '+moment.unix(data.date).format('YYYY-MM-DD dddd HH:mm:ss')+'</span>'
                    temp +=    '<from>'
                    temp +=        '<input type="image" src="./images/'+star_on+'" class="right_star_image"></input>'
                    temp +=    '</from>'
                    temp +=    '<from>'
                    temp +=        '<input type="image" src="./images/'+like_on+'" class="right_like_image"></input>'
                    temp +=    '</from>'
                    temp +=    '<from>'
                    temp +=        '<input type="image" src="./images/right_left.png" class="right_left_image" val="'+data.sender+'"></input>'
                    temp +=    '</from>'
                    temp +='</div>'
                    temp +='<div id="mail_right_content">'
                    temp +=    '<div id="mail_right_content_top">'
                    temp +=        '<div class="right_top_title">'
                    temp +=            '<span class="right_top_title_text">'+data.title+'</span>'
                    temp +=        '</div>'
                    temp +=        '<div class="right_top_people">'
                    temp +=            '<img src="./images/people/people1.png" class="right_top_people_img" />'
                    temp +=            '<span class="right_top_sender">'+data.sender.name + ' ' + data.sender.user_id+'@sgenclub.org</span>'
                    temp +=            '<span class="right_top_receiver">'
                    $.each(data.receiveMember, function(i2, v2) {
                        if(i2 >3) return false;
                        else {
                            temp += v2.name;
                            if(i2!= data.receiveMember.length-1 && i2!==2) {
                                temp += ", ";
                            }
                        }
                    });
                    
                    if(data.receiveMember.length >4) {
                        temp += "외 "+ (data.receiveMember.length-3) + "명";
                    }
                    temp += ' 에게</span>'
                    temp +=        '</div>'
                    temp +=    '</div>'
                    temp +=    '<hr class="mailview_hr">'
                    temp +=    '<div id="mail_right_content_middle">'
                    temp +=        '<div class="right_middle_text">'
                    temp +=            data.message
                    temp +=            '<div class="right_middle_files">'
                    $.each(data.attach, function(i, v) {
                        temp +=                '<div class="right_middle_file">'
                        temp +=                    '<div class="right_file_img">'
                        temp +=                        '<form>'
                        temp +=                            '<input type="image" class="right_file_img_btn" src="./images/file_download.png"/>'
                        temp +=                        '</form>'
                        temp +=                    '</div>'
                        temp +=                    '<div class="right_file_text">'
                        temp +=                        '<span class="right_file_text_value"><a href="./Download/'+v+'">'+( v.length>24? v.substr(0, 23)+"...": v)+'</a></span>'
                        temp +=                    '</div>'
                        temp +=                    '<div class="right_file_size">'
                        temp +=                        '<span class="right_file_size_value"></span>'
                        temp +=                    '</div>'
                        temp +=                '</div>'
                    });
                    

                    temp +=                '<div id="mail_right_content_bottom">'
                    temp +=                    '<hr class="mailview_hr2">'
                    temp +=                    '<div class="mail_right_reply_box">'
                    temp +=                        '<img src="./images/people/people1.png" class="right_top_people_img_2" />'
                    temp +=                        '<textarea class="reply_box_tt" rows=8 cols=88 placeholder="답장하실려면 클릭하세요 "></textarea>'
                    temp +=                        '<from>'
                    temp +=                            '<input type="image" class="reply_img_btn" src="./images/reply_sendBtn.png">'
                    temp +=                        '</from>'
                    temp +=                    '</div>'
                    temp +=                '</div>'
                    temp +=            '</div>'
                    temp +=        '</div>'
                    temp +=    '</div>'
                    temp +=' </div>'
                    
                $("#mail_right_view").append(temp);
                });
            });
        });

    });
        

    $("#writeBtn_image").click(function() {
        $(".mail_right").css('display', 'none');
        $("#mail_right_write").show();
    });
});