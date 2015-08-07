var db = require('mongoskin').db("mongodb://sgen:sgen@119.205.252.51:27017/bandbox", { w: 0});
    db.bind('event');

exports.init_cal = function(req,res,err){
    //인설트 문 그대로 넣는다. 개쉬움.
    // db.event.insert({ 
    //     text:"My test event A", 
    //     start_date: new Date(2013,8,1),
    //     end_date:   new Date(2013,8,5)
    // });
    // db.event.insert({ 
    //     text:"My test event B", 
    //     start_date: new Date(2013,8,19),
    //     end_date:   new Date(2013,8,24)
    // });
    // db.event.insert({ 
    //     text:"Morning event", 
    //     start_date: new Date(2013,8,4,4,0),
    //     end_date:   new Date(2013,8,4,14,0)
    // });
    // db.event.insert({ 
    //     text:"One more test event", 
    //     start_date: new Date(2013,8,3),
    //     end_date:   new Date(2013,8,8),
    //     color: "#DD8616"
    // });

    res.send("some Data Adding")
};

exports.get_data = function(req,res,err){
    db.event.find().toArray(function(err, data){
        //set id property for all records
        for (var i = 0; i < data.length; i++){
            data[i].id = data[i]._id;
        }
        //output response
        res.send(data);
    });
};
exports.insert_data = function(req,res,err){

    var data = req.body;
    var mode = data["!nativeeditor_status"];
    var sid = data.id;
    var tid = sid;

    delete data.id;
    delete data.gr_id;
    delete data["!nativeeditor_status"];
    

    //결과를 리턴해주는 함수.
    function update_response(err, result){
        console.log('/data Update_response is Detected');
        if (err)
            mode = "error";
        else if (mode == "inserted")
            tid = data._id;

        res.setHeader("Content-Type","text/xml");
        res.send("<data><action type='"+mode+"' sid='"+sid+"' tid='"+tid+"'/></data>");
    }
    //모드의 여부에따라 업데이트 혹은 인설
    if (mode == "updated"){
        console.log('/data Update_response is Detected');

        db.event.updateById( sid, data, update_response);
    }
    else if (mode == "inserted"){
        console.log('/data insert is Detected');
        console.log('INSERT DATA IS ====> ' + data.start_date);
        data.start_date = new Date(data.start_date);
        data.end_date = new Date(data.end_date);
        db.event.insert(data, update_response);
}
    else if (mode == "deleted"){
        db.event.removeById( sid, update_response);
    }
    else{
        res.send("Not supported operation");
    }


};



