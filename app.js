
/**
 * Module dependencies.
 */

 var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path');
  
//WWARRING!!!
//몽고  디비 설치필요
// var db = require('mongoskin').db("localhost/testDB", { w: 0});
//     db.bind('event');


// var md5 = require('MD5');
var fs = require('fs');


// var async = require('async');
var favicon = require('serve-favicon');
// var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes');
var user = require('./routes/user')
// var users = require('./routes/users');

var app = express();
var swig  = require('swig');

// view engine setup
app.engine('ejs', swig.renderFile);  
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');  


// uncomment after placing your favicon in /public
// app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(express.logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// var app = express();
var port = process.env.PORT || 3000;
app.set('port', port);
// app.configure(function(){
//   app.set('port', port);
//   app.set('views', __dirname + '/views');
//   app.set('view engine', 'ejs');
//   app.use(express.favicon());
//   app.use(express.logger('dev'));
//   app.use(express.bodyParser());
//   app.use(express.methodOverride());
//   app.use(app.router);
//   app.use(require('stylus').middleware(__dirname + '/public'));
//   app.use(express.static(path.join(__dirname, 'public')));
// });

app.configure('development', function(){
  app.use(express.errorHandler());
});


// app.get('/write', routes.write);

app.get('/', routes.index);
app.get('/title', routes.title);
app.get('/mail', routes.mail);
app.get('/mailview', routes.mailview);
app.get('/calender',routes.calender);

// //데이터 추가해놓기.
// app.get('/init', function(req, res){
	
// 	//인설트 문 그대로 넣는다. 개쉬움.
// 	db.event.insert({ 
// 		text:"My test event A", 
// 		start_date: new Date(2013,8,1),
// 		end_date:	new Date(2013,8,5)
// 	});
// 	db.event.insert({ 
// 		text:"My test event B", 
// 		start_date: new Date(2013,8,19),
// 		end_date:	new Date(2013,8,24)
// 	});
// 	db.event.insert({ 
// 		text:"Morning event", 
// 		start_date: new Date(2013,8,4,4,0),
// 		end_date:	new Date(2013,8,4,14,0)
// 	});
// 	db.event.insert({ 
// 		text:"One more test event", 
// 		start_date: new Date(2013,8,3),
// 		end_date:	new Date(2013,8,8),
// 		color: "#DD8616"
// 	});

// 	res.send("Test events were added to the database")
// });





// //넣은 데이터를 조회한다.
// app.get('/data', function(req, res){
	
// 	db.event.find().toArray(function(err, data){
// 		//set id property for all records
// 		for (var i = 0; i < data.length; i++){
// 			data[i].id = data[i]._id;
// 		}
		
// 		//output response
// 		res.send(data);
// 	});
// });


// app.post('/data', function(req, res){
// 	console.log('/data post is Detected');

// 	var data = req.body;
// 	var mode = data["!nativeeditor_status"];
// 	var sid = data.id;
// 	var tid = sid;

// 	delete data.id;
// 	delete data.gr_id;
// 	delete data["!nativeeditor_status"];
	

// 	//결과를 리턴해주는 함수.
// 	function update_response(err, result){
// 		console.log('/data Update_response is Detected');
// 		if (err)
// 			mode = "error";
// 		else if (mode == "inserted")
// 			tid = data._id;

// 		res.setHeader("Content-Type","text/xml");
// 		res.send("<data><action type='"+mode+"' sid='"+sid+"' tid='"+tid+"'/></data>");
// 	}

// 	if (mode == "updated"){
// 		console.log('/data Update_response is Detected');

// 		db.event.updateById( sid, data, update_response);
// 	}
// 	else if (mode == "inserted"){
// 		console.log('/data insert is Detected');
// 		console.log('INSERT DATA IS ====> ' + data.start_date);
		
// 		data.start_date = new Date(data.start_date);
// 		data.end_date = new Date(data.end_date);

// 		db.event.insert(data, update_response);
// }
// 	else if (mode == "deleted"){
// 		db.event.removeById( sid, update_response);
// 	}
// 	else{
// 		res.send("Not supported operation");
// 	}
// });





http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
