
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
	    var tmpMessage  = req.param('message');
	    var sender = req.param('sender');
	    var receiveMember = req.param('receve_member');
	    var cc = req.param('cc');
	    var star = req.param('star');
	    var like = req.param('like');

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
		console.log('vakye - ',getMailLinking(tmpMessage));
		// console.log(arrCC);

        var date = Math.round(+new Date()/1000);

		db.mail.insert({
	        title : title,
	        message : getMailLinking(tmpMessage),
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
app.post('/mail/getNoReadCnt',mail.getNoReadCnt); 

app.get('/Download/:id',function(req,res){
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
         
    text:title, 
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
    
     res.send({
      code:200,
      row:{dates:date}
     })
});




//날자검색해서 링크걸어주는
  function insertWordMiddle (message,first,last,url,title){

    String.prototype.splice = function( idx, rem, s ) {
        return (this.slice(0,idx) + s + this.slice(idx + Math.abs(rem)));
    };
    var lastMsg = message.splice(last,0,"</a>");
    //앞에추가하고

    var strUrl=  "<a class=\"hrefCal\" href=\"http://localhost:3000/setCal?"+"date="+url+"&title="+title+"\">"
    var firstMsg = lastMsg.splice(first,0,strUrl);
    
    return firstMsg;
  }




  function getMailLinking (message) {

  // exports.getMailLinking = function(req,res,err){
                            var title = "이것 이즈 제목";
                             // message = "김팀장님 저희 개발 미팅은 다음주 화요일 07시에 뵙죠";
                            var lastDataPostion  = [];
                            var lastData = [];
                            var nextWeek = ["다음주","이번주"];
                            var day = ["월요일","화요일","수요일","목요일","금요일","토요일","일요일"];
                            var perid = ["오늘","내일","모레"];
                            var time = ["00시","01시","02시","03시","04시","05시","06시","07시","08시","09시","10시","11시","12시","13시","14시","15시","16시","17시","18시","19시","20시","21시","22시","23시","24시"];

                            // var message = "내일 13시에 보아요";


                            var calData = [];

                              console.log(output)
                            ///이번주다음주검색
                            for(var i=0;i<nextWeek.length;i++){
                              //해당값이 존재하면
                              var TFnextWeek =(message.search(nextWeek[i]) > -1) ? true :false ;
                              
                              //트루면 저장
                              if( TFnextWeek == true){
                                lastData.push({"nextWeek":nextWeek[i]});
                                calData.nextWeek =nextWeek[i];
                                lastDataPostion.push(message.search(nextWeek[i]));
                              }else{};
                            }
                              //금요
                            for(var i=0;i<day.length;i++){
                              //해당값이 존재하면
                              var TFDay =(message.search(day[i]) > -1) ? true :false ;
                              //트루면 저장
                              if( TFDay == true){
                                lastData.push({"day":day[i]});
                                calData.day =day[i];
                                lastDataPostion.push(message.search(day[i]));
                              }else{};
                            }

                            for(var i=0;i<perid.length;i++){
                              //해당값이 존재하면
                              var TFperid =(message.search(perid[i]) > -1) ? true :false ;
                              //트루면 저장
                              if( TFperid == true){
                                lastData.push({"perid":perid[i]});
                                calData.perid =perid[i];
                                lastDataPostion.push(message.search(perid[i]));
                              }else{};
                            }

                            for(var i=0;i<time.length;i++){
                              //해당값이 존재하면
                              var TFtime =(message.search(time[i]) > -1) ? true :false ;
                              // console.log(TFtime);
                              //트루면 저장
                              if( TFtime == true){
                                lastData.push({"time":time[i]});
                                calData.time =time[i];
                                lastDataPostion.push(message.search(time[i]));
                              }else{};
                            }
                            
                              var now = new Date();

                            if(typeof calData["nextWeek"]=="undefined"){}else{
                                console.log('week has');
                                if(calData["nextWeek"]=='이번주'){


                                }else{//다음주

                                }
                            }
                             if(typeof calData["day"]=="undefined"){}else{
                              
                                  //0 일요일...
                                  //1 월 2 화 3 수 4 목 5 금 6 토 7
                                  var reservDay ;
                                  if(calData["day"] =="일요일"){
                                    reservDay =0;
                                  }if(calData["day"] =="월요일"){
                                    reservDay =1;
                                  }if(calData["day"] =="화요일"){
                                    reservDay =2;
                                  }if(calData["day"] =="수요일"){
                                    reservDay =3;
                                  }if(calData["day"] =="목요일"){
                                    reservDay =4;
                                  }if(calData["day"] =="금요일"){
                                    reservDay =5;
                                  }if(calData["day"] =="토요일"){
                                    reservDay =6;
                                  }
                                  // console.log(now.setDay(2));
                                  var curDay =(now.getDate());
                                  console.log('curday',curDay);
                                  console.log('reservDay',reservDay);
                                  //다음주 같은날에서 +- 해준다

                                  var setDay;
                                  //이번주일경
                                  if(calData["nextWeek"]=='이번주'){
                                    setDay = (reservDay-now.getDay());
                                    //다음주일경우
                                  }else{
                                   setDay = 7 + (reservDay-now.getDay());
                                  }
                                  //setDay요일에 저장.

                                  //모든거에 데이트만 추가해서저장.
                                  now.setDate(now.getDate()+setDay);
                                  console.log(now);

                            }
                             if(typeof calData["perid"]=="undefined"){}else{
                              console.log('perid has');
                              // var now1 = new Date();
                              var perid;
                                if(calData["perid"]=='오늘'){perid =1};
                                if(calData["perid"]=='내일'){perid =2};
                                if(calData["perid"]=='모래'){perid =3};
                                now.setDate(now.getDate() + perid);
                                console.log('now1',now);
                            }
                             if(typeof calData["time"]=="undefined"){}else{
                               if(calData["time"] =="00시"){
                                    var realtime =0;
                                  }if(calData["time"] =="01시"){
                                    realtime =1;
                                  }if(calData["time"] =="02시"){
                                    realtime =2;
                                  }if(calData["time"] =="03시"){
                                    realtime =3;
                                  }if(calData["time"] =="04시"){
                                    realtime =4;
                                  }if(calData["time"] =="05시"){
                                    realtime =5;
                                  }if(calData["time"] =="06시"){
                                    realtime =6;
                                  }if(calData["time"] =="07시"){
                                    realtime =7;
                                  }if(calData["time"] =="08시"){
                                    realtime =8;
                                  }if(calData["time"] =="09시"){
                                    realtime =9;
                                  }if(calData["time"] =="10시"){
                                    realtime =10;
                                  }if(calData["time"] =="11시"){
                                    realtime =11;
                                  }if(calData["time"] =="12시"){
                                    realtime =12;
                                  }if(calData["time"] =="13시"){
                                    realtime =13;
                                  }if(calData["time"] =="14시"){
                                    realtime =14;
                                  }if(calData["time"] =="15시"){
                                    realtime =15;
                                  }if(calData["time"] =="16시"){
                                    realtime =16;
                                  }if(calData["time"] =="17시"){
                                    realtime =17;
                                  }if(calData["time"] =="18시"){
                                    realtime =18;
                                  }if(calData["time"] =="19시"){
                                    realtime =19;
                                  }if(calData["time"] =="20시"){
                                    realtime =20;
                                  }if(calData["time"] =="21시"){
                                    realtime =21;
                                  }if(calData["time"] =="22시"){
                                    realtime =22;
                                  }if(calData["time"] =="23시"){
                                    realtime =23;
                                  }if(calData["time"] =="24시"){
                                    realtime =24;
                                  }
                                  console.log('realtime===>',realtime);
                                    now.setHours(realtime);
                            }
                            console.log(now);
                            // 마지막 값의 포지션 
                            var lastValuePos= lastDataPostion[lastDataPostion.length-1];

                            //마지막값의 글자수.
                            var lastDataValue = lastData[lastData.length-1]; 

                            var lastDataValue = lastDataValue[Object.keys(lastDataValue)];

                            var lastCharPos = lastValuePos+lastDataValue.length;
                            //아웃풋최종 데이
                            var output = insertWordMiddle(message,lastDataPostion[0],lastCharPos,now,title);
                            
                            // console.log(output);
                            return output
      // res.writeHeader(200, {"Content-Type": "text/html"});  
      // res.end(output);                            
  }

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
