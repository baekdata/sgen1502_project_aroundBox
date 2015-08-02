var mongo = require('mongoskin');
var db = mongo.db("mongodb://sgen:sgen@119.205.252.51:27017/bandbox", { w: 0});
    db.bind('mail');
    db.bind('user_info');

var async = require('async');

    exports.getMail = function(req,res, err) {
        var sess = req.session;
        var _id  = sess.userId;
        console.log('[session Data] id ===>' + _id);

        var mail_id = mongo.helper.toObjectID(req.body.mail_id);

        db.mail.find({_id:mail_id}).toArray(function (err, result) {
            console.log("--result", result);
            if(err) {

                console.log(err);
            } else if(result.length) {

                var like_on = (result[0].like &&  result[0].like.indexOf('sgen3')>-1 ) ? true  : false;
                var star_on = (result[0].star && result[0].star.indexOf('sgen3')>-1 ) ? true  : false;

                var send_data = result;

                var receiveMember_temp=[];
                var cc_temp=[];
                var sender_temp ='';

                async.waterfall([
                    function(callback2) {
                        async.each(result[0].receiveMember, function(receive_item, callback) {
                            db.user_info.find({user_id:receive_item},{user_id:'',name:''}).toArray(function (err, result) {

                                receiveMember_temp.push(result[0]);
                                callback();
                            });

                        }, function(err){
                            callback2(null);
                        });
                    }, 
                    function(callback2) {
                        async.each(result[0].cc, function(cc_item, callback) {
                            db.user_info.find({user_id:cc_item},{user_id:'',name:''}).toArray(function (err, result) {
                                cc_temp.push(result[0]);
                                callback();
                            });
                        }, function(err){
                            callback2(null);
                        });
                    }, 
                    function(callback2) {
                        db.user_info.find({user_id:result[0].sender},{user_id:'',name:''}).toArray(function (err, result) {
                            sender_temp = result[0];
                            callback2();
                        });
                    }
                ], function(err) {
                    send_data[0].receiveMember = receiveMember_temp;
                    send_data[0].cc = cc_temp;
                    send_data[0].sender = sender_temp;

                    res.send({
                          code:200,
                          row:send_data,
                          like_on:like_on,
                          star_on:star_on
                    });
                });    
            }
        });
    };

	exports.getReceiveMailData = function(req,res,err){
		var sess;
		sess = req.session;
		var _id  = sess.userId;
		console.log('[session Data] id ===>' + _id);

      db.mail.find({$or:[{receiveMember:'sgen3'},{cc:'sgen3'}]}).toArray(function (err, result) {
        if (err) {
          console.log(err);
        } else if (result.length) {
        	var send_data = result;
        	async.forEachOf(result, function(data, key, callback) {
        		var receiveMember = data.receiveMember;
        		var cc  = data.cc;

        		var receiveMember_temp=[];
        		var cc_temp=[];
        		async.waterfall([
        			function(callback2) {
		        		async.each(receiveMember, function(receive_item, callback3) {
		        			db.user_info.find({user_id:receive_item},{user_id:'',name:''}).toArray(function (err, result) {

								receiveMember_temp.push(result[0]);
								callback3();
							});

        				}, function(err){
        					callback2(null);
        				});
        			}, 
        			function(callback2) {
        				async.each(cc, function(cc_item, callback3) {
        					db.user_info.find({user_id:cc_item},{user_id:'',name:''}).toArray(function (err, result) {
								cc_temp.push(result[0]);
								callback3();
							});
        				}, function(err){
        					callback2(null);
        				});
        			}
    			], function(err) {
        			send_data[key].receiveMember = receiveMember_temp;
        			send_data[key].cc = cc_temp;
        			// console.log(send_data);
        			callback();
        		});
        	}, function() {
        		// console.log('lastdata=',data_temp);
        		res.send({
			          code:200,
			          row:send_data
		        });

        	});


        } else {
          console.log('No document(s) found with defined "find" criteria!');
        }
      });
    
	};


    //사용자에대한 모든데이터 가져오기
	exports.getAllMailData = function(req,res,err){
	    var sess;
		sess = req.session;
		var _id  = sess.userId;
		console.log('[session Data] id ===>' + _id);

      db.mail.find({sender:'sgen'}).toArray(function (err, result) {
        if (err) {
          console.log(err);
        } else if (result.length) {
        	var send_data = result;
        	async.forEachOf(result, function(data, key, callback) {
        		var receiveMember = data.receiveMember;
        		var cc  = data.cc;

        		var receiveMember_temp=[];
        		var cc_temp=[];
        		async.waterfall([
          			function(callback2) {
  		        		async.each(receiveMember, function(receive_item, callback) {
  		        			db.user_info.find({user_id:receive_item},{user_id:'',name:''}).toArray(function (err, result) {

  								receiveMember_temp.push(result[0]);
  								callback();
  							});

          				}, function(err){
          					callback2(null);
          				});
          			}, 
          			function(callback2) {
          				async.each(cc, function(cc_item, callback) {
          					db.user_info.find({user_id:cc_item},{user_id:'',name:''}).toArray(function (err, result) {
  								cc_temp.push(result[0]);
  								callback();
  							});
          				}, function(err){
          					callback2(null);
          				});
          			}
      			], function(err) {
          			send_data[key].receiveMember = receiveMember_temp;
          			send_data[key].cc = cc_temp;
                    callback();
          		});
        	}, function(err) {
        		// console.log('lastdata=',data_temp);
        		res.send({
		          code:2015,
		          row:send_data
		        });

        	});
       	    //리턴 사람 이름, 시간, 제목 , 머아웃결과값
       // 	    var obj =  new Object();
       // 	    var retData = new Array();

       // 	    var tmpRetData = new Array();

       // 	    var arrName = new Array();
       // 	    //Receved데이터 자체를 리턴
       // 	    var arrReceved = new Array();
       // 	    //리턴된사이즈만큼 포문돌리기
       // 	    for(var i =0; i<result.length;i++){
       // 	    		 //하나의 데이터의 받을사람들
	    		 
	    		//  arrReceved = result[i].receiveMember
	    		//  // console.log(arrReceved);
	    		//  //리시브데이터들을 모아놓음.
	    		//  tmpRetData.push(arrReceved);
       // 	    }
       // 	    console.log('arrReceved = ===>'+ tmpRetData);
       // 	    	//받을사람만큼 하나씩뺴와서 arrName에 저장

   	   //  	for(var j =0; j<tmpRetData.length;j++){
   	   //  			for(var k =0;k<tmpRetData[j].length;k++){
	   	  //   			var tmpId = tmpRetData[j][k];
	      //  	    		console.log('id ='+tmpId);

			  	 //    	db.user_info.find({user_id:tmpId}).toArray(function (err, result) {
							// console.log( 'value = ' +result[0]['name']);
							// arrName.push(result[0]['name']);
				   //        });
			  	 //    	sleep.usleep(500);
   	   //  			}
       // 	    	obj["receve_member"] = arrName;
   	   //  		retData.push(obj);
       // 	    }


       // 	    console.log('[name Data] searchEnd ===> ' + retData);


       //      res.send({
       //        code:200,
       //        row:result
       //      });
          

        } else {
          console.log('No document(s) found with defined "find" criteria!');
        }
      });
    

	};

