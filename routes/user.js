var db = require('mongoskin').db("mongodb://localhost:27017/bandbox", { w: 0});
    db.bind('user_info');

/*
 * GET users listing.
 */

exports.list = function(req, res){
  res.send("respond with a resource");
};

exports.signup = function(req,res,err){

    var userId  = req.param('user_id');
    var userPw  = req.param('user_pw');
    var userName = req.param('user_name')
	db.user_info.insert({
        user_id : userId,
        userpw : userPw,
        name : userName	
	}, function(err, result) {
	    if (err) throw err;
	    if (result) {
	    	console.log('Added!');
	    	 res.send({
	    	 	code:200,
	    	 	result:result
	    	 })

	    }
	});

};


exports.signin = function(req,res,err){

    var userId  = req.param('user_id');
    var userPw  = req.param('user_pw');
    var sess;
    sess = req.session;
    
    //userId가 존재한다면 바로 redirect
    
      db.user_info.find({user_id: '123'}).toArray(function (err, result) {
        if (err) {
          console.log(err);
        } else if (result.length) {
            var rUserId = result[0]['user_id'];
          // console.log(rUserId);
          
            
            console.log('[session] ===> add userId to Session!');
            //아이디가 없다면 해당 아이디를 세션에 저
            sess.userId = userId;
            console.log(sess);
            //200이 떨어지면  로그인 처리
            res.send({
              code:200,
              row:result
            });
          

        } else {
          console.log('No document(s) found with defined "find" criteria!');
        }
      });
    



};