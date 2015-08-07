var mongo = require('mongoskin');


var db = mongo.db("mongodb://sgen:sgen@119.205.252.51:27017/bandbox", { w: 0});
db.bind('mail');
db.bind('user_info');
    
var async = require('async');

  //날자검색해서 링크걸어주는
  function insertWordMiddle (message,first,last,url,title){

    String.prototype.splice = function( idx, rem, s ) {
        return (this.slice(0,idx) + s + this.slice(idx + Math.abs(rem)));
    };
    var lastMsg = message.splice(last,0,"</a>");
    //앞에추가하고

    var strUrl=  "<a href=\"http://localhost:3000/setCal?"+"date="+url+"&title="+title+"\">"
    var firstMsg = lastMsg.splice(first,0,strUrl);
    
    return firstMsg;
  }

  exports.getMailLinking = function(req,res,err){
  ///테스트코드                

                            var title = "이것 이즈 제목";
                            var message = "김팀장님 저희 개발 미팅은 다음주 화요일 07시에 뵙죠";
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
                            
                            console.log(output);
                            
      res.writeHeader(200, {"Content-Type": "text/html"});  
      res.end(output);                            
  }


  exports.getMailCnt = function(req,res,err){
    
    var arrSum = [];
    var sum =0;
      //하드코딩이 뭔지 보여주겟다.
    db.mail.find({$and:[{sender:"sgen"},{receiveMember:"sgen1"}]}).count(function(err,result){
            console.log('sgen1')
          arrSum.push({"name":"김동억","cnt":result});
          sum+=result;
          db.mail.find({$and:[{sender:"sgen"},{receiveMember:"sgen2"}]}).count(function(err,result){
                console.log('sgen2')
                arrSum.push({"name":"백종수","cnt":result});
                sum+=result;
                db.mail.find({$and:[{sender:"sgen"},{receiveMember:"sgen3"}]}).count(function(err,result){
                    console.log('sgen3')
                   arrSum.push({"name":"남현진","cnt":result});
                    sum+=result;
                    db.mail.find({$and:[{sender:"sgen"},{receiveMember:"sgen4"}]}).count(function(err,result){
                        console.log('sgen4')
                       arrSum.push({"name":"이아영","cnt":result});
                        sum+=result;
                        db.mail.find({$and:[{sender:"sgen"},{receiveMember:"sgen5"}]}).count(function(err,result){
                          console.log('sgen5')
                             db.user_info.find()
                            
                            arrSum.push({"name":"김도윤","cnt":result});
                            sum+=result;  

                            res.send({
                              code:200,
                              row:arrSum
                            });


                        });
                      
                    });
                  
                });
          });
    });
  };
                

    exports.getFilterData = function(req,res,err){
      var otherUser = req.param('other_id'); 
      var filterWord = req.param('filter_word'); 
      var indexing = req.param('indexing');
      
        console.log(otherUser);
        console.log(filterWord);

        // ====> Default 가 받은메세지  ==> 받은메세지라는 이야기는 sender가 other_id이고 리시브에 내가있고
      //검색어 검색
      if(otherUser==null && filterWord!=null){

        db.mail.find({'message':{'$regex':filterWord}}).toArray(function (err, result) {
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

        });
      
      }
      //유저로 검색 받거나 cc 에 있는사람들
      if(otherUser!=null && filterWord==null){
        db.mail.find({$and:[{sender:"sgen"},{receiveMember:"sgen3"}]}).toArray(function (err, result) {
              
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

          });  

      }
      //검색 유저 동시.
      if(otherUser!=null && filterWord !=null){
      }
    };


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
        }else{
          var a = arr.indexOf(user_id);
          
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
         }
         
         console.log('user_id=', user_id);
         console.log('arr=', arr);

         var arr2 = new Array();
         
         db.mail.update({_id:oId},{$set:{star:arr}},function(err,result){
          if(err){
            res.send({
              code:400,
              row:err,
              arr_length:arr.length
            });
          }else{
            res.send({
              code:200,
              row:result,
              arr_length:arr.length
            });
          }
          console.log(">>>>>>>>>>>result: ", result);
          console.log(">>>>>>>>>>>arr.length:",arr.length);
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
  console.log(user_id);
  console.log(idx);

  var oId = mongo.helper.toObjectID(idx);
  console.log(oId);

  db.mail.find({_id:oId}).toArray(function (err, result) {
    
    var arr = new Array();
    console.log(result[0]);
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
              row:a
            });
          }

        });
         
       });
  
};
exports.getFavorteMailData = function(req,res,err){
  var sess;
  sess = req.session;
  var _id  = sess.userId;
  // console.log('[session Data] id ===>' + _id);
  // db.mail.find({$or:[{star:"sgen3"}]}).toArray(function (err, result) {
  //   if (err) {
  //     console.log(err);
  //   } else if (result.length) {
  //     console.log('[starData] ==> ',result);

  //     res.send({
  //       code:200,
  //       row:result
  //     });
  //   } else {
  //     console.log('No document(s) found with defined "find" criteria!');
  //   }
  // });


  db.mail.find({$or:[{star:"sgen3"}]}).toArray(function (err, result) {
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
// <<<<<<< HEAD
//                 res.send({
//                   code:200,
//                   row:result
//                 });
//             } else {
//               console.log('No document(s) found with defined "find" criteria!');
//             }
//           });
// =======


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

     db.mail.find({sender:"sgen"}).toArray(function (err, result) {

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

        	});


} else {
  console.log('No document(s) found with defined "find" criteria!');
}
});


};

