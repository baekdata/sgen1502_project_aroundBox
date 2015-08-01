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
      res.redirect('/mail');
    }else{
	  res.render('index', {});
	}
};
exports.home = function(req, res){
  res.render('home', {});
};
exports.detail = function(req, res){
  res.render('detail', {});
};
exports.mail = function(req, res){
  res.render('mail', {});
};
exports.calender = function(req, res){
  res.render('calender',{});
};