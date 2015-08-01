// var mysql = require('../config/mysql');
// var config = require('../config/config');
// var moment = require('moment');
// var passport = require('passport');

/*
 * GET home page.
 */

exports.index = function(req, res){
    var sess;
    sess = req.session;
    
    //userId가 존재한다면 바로 redirect
    if(sess.userId){
      console.log('[session] ===> session Alive!');
      res.redirect('/title');
    }else{
	  res.render('index', {});
	}
};
exports.title = function(req, res){
  res.render('title', {});
};
exports.mail = function(req, res){
  res.render('mail', {});
};
exports.mailview = function(req, res){
  res.render('mailview', {});
};
exports.calender = function(req, res){
  res.render('calender',{});
};