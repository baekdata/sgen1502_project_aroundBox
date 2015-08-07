
/**
 * Module dependencies.
 */

 var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , calender = require('./routes/calendar')
  , mail = require('./routes/mail');


//WWARRING!!!
//몽고  디비 설치필요
var db = require('mongoskin').db("mongodb://sgen:sgen@119.205.252.51:27017/bandbox", { w: 0});
    db.bind('event');
    db.bind('mail');
    db.bind('user_info');


var md5 = require('MD5');
var fs = require('fs');


// var async = require('async');
var favicon = require('serve-favicon');
// var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes');
var user = require('./routes/user')
var app = express();
var swig  = require('swig');
// 파일 다운로드 라이브러
var multer = require('multer');
var upload = multer({ dest: './uploads/' })
var session = require('express-session')

//세션관련;;

// var app = express();

// view engine setup
app.engine('ejs', swig.renderFile);  
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');  


// uncomment after placing your favicon in /public
// app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(express.logger('dev'));
// app.use(express.bodyParser()); 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'uploads')));


// var app = express();
var port = process.env.PORT || 3000;
var request = require('request');

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

////testLogic
// 60초 로그인 
app.use(session({ secret: 'keyboard cat', cookie: { maxAge: 60000000 }}))

app.get("/mTest",function(req,res){
   db.user_info.find({user_id: '123'}).toArray(function (err, result) {
    if (err) {
      console.log(err);
    } else if (result.length) {
        res.send({
          code:200,
          row:result
        });

    } else {
      console.log('No document(s) found with defined "find" criteria!');
    }
  });

});

app.post("/pTest",function(req,res){
	
	var title  = req.param('title');
	// var title1 [];
	console.log('title =='+title[0]);
	console.log('title =='+title[1]);
});

function checkTitleFileType(obj){ 

pathpoint = obj.lastIndexOf('.'); 
filepoint = obj.substring(pathpoint+1,obj.length); 
filetype = filepoint;
  console.log(filetype);
  // if (filetype == 'TXT'){
  //   console.log('return ' +0);
  //   return 0; 
  // }else if (filetype =='txt'){
  //   console.log('return ' +1);
  //   return 1; 
  // } else{
  //   console.log('return ' +2);
  //   return 2;
  // }
}

//메일 보낼경우 
app.post("/mail/uploadFile",upload.array('attach',12),function(req,res){
  	
		var title  = req.param('title');
	    var message  = req.param('message');
	    var sender = req.param('sender');
	    var receiveMember = req.param('receve_member');
	    var cc = req.param('cc');
	    var star = req.param('star');
	    var like = req.param('like');
        
        console.log(req.files);
        var files = new Array();
        var AttachID = new Array();
        var Attach = new Array();

        files = req.files;

        //파일의 갯수만큼 포맷팅을 예쁘게한다.
        for(var i =0 ;i<files.length;i++){
        	console.log(files[i]);
        	//첨부 고유값저장
        	AttachID.push(files[i].filename);
        	//첨부 실제 저장 언어
        	Attach.push(files[i].originalname);

	          fs.rename('./uploads/'+req.files[i].filename, './uploads/'+req.files[i].originalname, function (err) {
	            if (err) throw err;
	            console.log('renamed complete');
	          });
        }
       

		console.log('searching END');
		// console.log(arrName);
		// console.log(arrCC);

        var date = Math.round(+new Date()/1000);

		db.mail.insert({
	        title : title,
	        message :message,
	        sender : sender,
	        receiveMember :receiveMember,
	        cc:cc,
	        star:star,
	        like:like,
	        attachid:AttachID,
	        attach:Attach,
	        date:date,
	        isRead: 0
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
});


// app.get('/write', routes.write);

app.get('/', routes.index);
app.get('/home', routes.home);
app.get('/detail',routes.detail);
app.get('/mail', routes.mail);
app.get('/mailWrite', routes.mailWrite);
app.get('/calender',routes.calender);

//보여주기 내부 에서 수정해줘야됨..구찬으니 그대로쓰기로..
app.post('/data',calender.insert_data);
app.get('/data',calender.get_data);

//회원가입
app.post('/user/signin',user.signin);
app.post('/user/signup',user.signup);

//지금안씀 위에 업로드로 이용함
app.post('/mail/getAllMailData',mail.getAllMailData);
app.post('/mail/getReceiveMailData',mail.getReceiveMailData);
app.post('/mail/setLike',mail.setLike);
app.post('/mail/getLike',mail.getLike);
app.post('/mail/setFavorite',mail.setFavorite);
app.post('/mail/getFavorteMailData',mail.getFavorteMailData);
app.post('/mail/getFilterData',mail.getFilterData);
app.post('/mail/getMailCnt',mail.getMailCnt);
app.get('/mail/getMailLinking',mail.getMailLinking);

app.post('/mail/getMail',mail.getMail);

app.get('/Downlaod/:id',function(req,res){
	var name = req.params.id;
	console.log('down = name',name);
	var filepath = __dirname + "/uploads/" +name;
	res.download(filepath);
});

//메일 에서 원하는 날자 정보를 챙겨서 링크까지만들어줌.
//메일보낼때 실행하면됨!!!
app.get('/mail/MilLingking',function(req,res){
    var time = req.params.time;
    //date 타입으로 넣을수있
     // data.start_date = new Date(time);
});

//해당링크 누르면 저장.
app.get('/setCal',function(req,res){
  var date = req.query.date;
  var title = req.query.title;
  console.log('title ',title);
          console.log('date',date);

  // var data=[];
    // data["start_date"] = new Date(date);
    // data["end_date"] = new Date(date);
    //     db.event.insert({ 
    //     text:"One more test event", 
    //     start_date: new Date(2013,8,3),
    //     end_date:   new Date(2013,8,8),
    //     color: "#DD8616"
    // });
  db.event.insert({
         
    text:"One more test event", 
    start_date: new Date(date),
    end_date:   new Date(date),
    color: "#0083D2"

  }, function(err, result) {
      if (err) throw err;
      if (result) {
         res.send({
          code:200,
          result:result
         })

      }
  });
    // db.event.insert({
    //   start_date : new Date(date),
    //   end_date : new Date(date),
    //   text : "n"

    // });
     res.send({
      code:200,
      row:{dates:date}
     })
});


http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
