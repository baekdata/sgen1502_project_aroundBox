var db = require('mongoskin').db("mongodb://localhost:27017/bandbox", { w: 0});
    db.bind('mail');

    
exports.insert_mailinfo = function(req,res,err){

    var title  = req.param('title');
    var message  = req.param('message');
    var sender = req.param('sender');
    var receiveMember = req.param('receve_member');
    var cc = req.param('cc');
    var star = req.param('star');
    var like = req.param('like');
    var attach =req.param('attach');


	db.mail.insert({
        title : title,
        message :message,
        sender : sender,
        receiveMember :receiveMember,
        cc:cc,
        star:star,
        like:like,
        attach:attach
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

