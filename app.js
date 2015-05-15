
/**
 * Module dependencies.
 */

 var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path');


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




http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
