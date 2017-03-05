//Import configure.js for settings
var configure = require('./configure');

//call configure.defaults() to set global variables
configure.defaults();
//call configure.mongoose() to configure mongoose
configure.mongoose();

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var engine = require('ejs-mate');
var bodyParser = require('body-parser');
var config = require('config');
var passport = require('passport');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var flash = require('express-flash');
var formatResponse = require('./shared/format-response');
var multer  = require('multer');


var authRoutes = require('./routes/auth');
var routes = require('./routes/all');
var app = express();
require('./controllers/auth/passport')(passport); // pass passport for configuration

// view engine setup
app.engine('ejs', engine);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser('keyboard cat'));
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  store: new MongoStore({url : config.get('db.url'), autoReconnect: true }),
  secret: 'usermanual secret',
  resave: true,
  cookies: {maxAge:60000},
  saveUninitialized: false
}));

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

// set the logged in user global
app.use(function(req, res, next) {
  res.locals.user = req.user;
  next();
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // res.locals.user = req.user;

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

authRoutes(app, passport);
app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});


// production error handler
// no stack traces leaked to user
app.use(function(err, req, res, next) {
  if(req.xhr)
  {
    var meta = {};
    meta.statusCode = err.code || err.status || 500;
    meta.error = {code: meta.statusCode, message: err.message || "Error in server interaction"};
    if(err.messages)
      meta.error.messages = err.messages;
    return res.status(meta.statusCode).json(formatResponse.do(meta));
  }
  else
  {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: {}
    });
  }
});

module.exports = app;
