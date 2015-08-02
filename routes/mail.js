var mongo = require('mongoskin');


var db = mongo.db("mongodb://sgen:sgen@119.205.252.51:27017/bandbox", { w: 0});
    db.bind('mail');
    db.bind('user_info');

var async = require('async');

    exports.getMail = function(req,res, err) {
        var sess = req.session;
        // var _id  = sess.userId;
        console.log('[session Data] id ===>' + _id);
        var _id = 'sgen';
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
              //reasult가 존재한다면
              //isRead를 1로 만들어준다.
               db.mail.update({_id:mail_id},{$set:{isRead:1}},function(err,result){
            if(err){
                // res.send({
                //   code:400,
                //   row:err
                // });
            }else{
                // res.send({
                //   code:200,
                //   row:result
                // });
            }

        });

                

            }
        });
    };

exports.setFavorite = function(req,res,err){
    //별표 추가하는 부분 star에 내 링크 끄러넣으며좋아
    var user_id = req.param('user_id'); 
    var idx = req.param('mail_id');
    
    var oId = mongo.helper.toObjectID(idx);

    //해당 메일아이디를 찾아서 like  추가해준다.
    db.mail.find({_id:oId}).toArray(function (err, result) {
        
        var arr = new Array();
        // console.log(result[0]['like']);
        arr = result[0]['star'];
        if(arr==null){
            arr= new Array();
        }
    
        arr.push(user_id);
        console.log(arr);

        var arr2 = new Array();
        
        db.mail.update({_id:oId},{$set:{star:arr}},function(err,result){
            if(err){
                res.send({
                  code:400,
                  row:err
                });
            }else{
                res.send({
                  code:200,
                  row:result
                });
            }

        });
        
    });

};


exports.getLike = function(req,res,err){
  
  var idx = req.param('mail_id');   
    var oId = mongo.helper.toObjectID(idx);
    // console.log('oid',oid);
  db.mail.find({_id:oId}).toArray(function (err, result) {
        var arr = new Array();
        // console.log(result[0]['like']);
        arr = result[0]['like']

        if(arr==null){
            res.send({
                code:200,
                row:'nonClicked'
            });
        }else{
            res.send({
                code:200,
                row:  result[0]['like']
            });
        }
     
  });
};

exports.setLike = function(req,res,err){
	//ObjtecId("asdfjadsklf"); 인형태야여야한다.
	//게시물의 아이디와, 사용자의 아이디를 알아야한다.
  var user_id = req.param('user_id');	
  var idx = req.param('mail_id');
  	// console.log(userId);
  	// console.log(idx);

  	var oId = mongo.helper.toObjectID(idx);
  	console.log(oId);

    db.mail.find({_id:oId}).toArray(function (err, result) {
        
        var arr = new Array();
        // console.log(result[0]['like']);
        arr = result[0]['like'];
        
        if(arr==null){
            arr= new Array();
        }else{
            var a = arr.indexOf(user_id);
            console.log('a====',a);
            //널이면 없으니까 ++
            if(a==-1){
                //푸시!
                arr.push(user_id);
            }
            //값이 있을경우 --
            else{
               var position = arr.indexOf(user_id);
               arr.splice(position,1);

            }
            console.log('arr===',arr);
        }
        

        var arr2 = new Array();
        
        db.mail.update({_id:oId},{$set:{like:arr}},function(err,result){
            if(err){
                res.send({
                  code:400,
                  row:err
                });
            }else{
                
                res.send({
                  code:200,
                  row:result
                });
            }

        });
        
    });
 		
};
	exports.getReceiveMailData = function(req,res,err){
		var sess;
		sess = req.session;
		var _id  = sess.userId;
		console.log('[session Data] id ===>' + _id);

      db.mail.find({$or:[{receiveMember:"sgen3"},{cc:_id}]}).toArray(function (err, result) {
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

      db.mail.find({sender:_id}).toArray(function (err, result) {
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

			          code:200,
			          row:send_data
			        });
        		// if(data) {
        			
        		// 	// console.log('senddata==>', data);
        		// 	res.send({
			       //    code:205,
			       //    row:data
			       //  });
        		// }  else {
        		// 	res.send({
			       //    code:201
			       //  });
        		// }

		          // code:2015,
		          // row:send_data
		        // });


        	});
       	    

        } else {
          console.log('No document(s) found with defined "find" criteria!');
        }
      });
    

	};

