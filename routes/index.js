// var mysql = require('../config/mysql');
// var config = require('../config/config');
// var moment = require('moment');
// var passport = require('passport');

/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', {});
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