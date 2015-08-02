var mongo = require('mongoskin');

var db = require('mongoskin').db("mongodb://sgen:sgen@119.205.252.51:27017/bandbox", { w: 0});
    db.bind('mail');
    db.bind('user_info');

var async = require('async');
var sleep = require('sleep');

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
        			function(callback) {
		        		async.each(receiveMember, function(receive_item, callback) {
		        			db.user_info.find({user_id:receive_item},{user_id:'',name:''}).toArray(function (err, result) {

								receiveMember_temp.push(result[0]);
								callback();
							});

        				}, function(err){
        					callback(null);
        				});
        			}, 
        			function(callback) {
        				async.each(cc, function(cc_item, callback) {
        					db.user_info.find({user_id:cc_item},{user_id:'',name:''}).toArray(function (err, result) {
								cc_temp.push(result[0]);
								callback();
							});
        				}, function(err){
        					callback(null);
        				});
        			}
    			], function(err) {
        			send_data[key].receiveMember = receiveMember_temp;
        			send_data[key].cc = cc_temp;
        			// console.log(send_data);
        			callback(send_data);
        		});
        	}, function(data_temp) {
        		console.log('lastdata=',data_temp);
        		res.send({
			          code:200,
			          row:data_temp
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
        	});
       	    //리턴 사람 이름, 시간, 제목 , 머아웃결과값

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
        			function(callback) {
		        		async.each(receiveMember, function(receive_item, callback) {
		        			db.user_info.find({user_id:receive_item},{user_id:'',name:''}).toArray(function (err, result) {

								receiveMember_temp.push(result[0]);
								callback();
							});

        				}, function(err){
        					callback(null);
        				});
        			}, 
        			function(callback) {
        				async.each(cc, function(cc_item, callback) {
        					db.user_info.find({user_id:cc_item},{user_id:'',name:''}).toArray(function (err, result) {
								cc_temp.push(result[0]);
								callback();
							});
        				}, function(err){
        					callback(null);
        				});
        			}
    			], function(err) {
        			send_data[key].receiveMember = receiveMember_temp;
        			send_data[key].cc = cc_temp;
        			// console.log(send_data);
        			callback(send_data);
        		});
        	}, function(data_temp) {
        		console.log('lastdata=',data_temp);
        		res.send({
			          code:200,
			          row:data_temp
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
        	});
       	    

        } else {
          console.log('No document(s) found with defined "find" criteria!');
        }
      });
    

	};


    //사용안함
// exports.insert_mailinfo = function(req,res,err){

//     var title  = req.param('title');
//     var message  = req.param('message');
//     var sender = req.param('sender');
//     var receiveMember = req.param('receve_member');
//     var cc = req.param('cc');
//     var star = req.param('star');
//     var like = req.param('like');
//     var attach =req.param('attach');


// 	db.mail.insert({
//         title : title,
//         message :message,
//         sender : sender,
//         receiveMember :receiveMember,
//         cc:cc,
//         star:star,
//         like:like,
//         attach:attach
// 	}, function(err, result) {
// 	    if (err) throw err;
// 	    if (result) {
// 	    	console.log('Added!');
// 	    	 res.send({
// 	    	 	code:200,
// 	    	 	result:result
// 	    	 })

// 	    }
// 	});
	
// };

