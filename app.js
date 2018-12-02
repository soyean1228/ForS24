var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var expressSession = require('express-session');
var passport = require('passport');
var bodyParser_post = require('body-parser');  
var flash    = require('connect-flash');

var indexRouter = require('./routes/index');
var eventRouter = require('./routes/event');
var priceRouter = require('./routes/price');
var searchRouter = require('./routes/search');
var explainRouter = require('./routes/explain');
var locateResultRouter = require('./routes/locateResult');
var joinRouter = require('./routes/join');
var cartRouter = require('./routes/cart');

var passportConfig = require('./lib/passport-config');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');


// // mongodb connect
mongoose.Promise = global.Promise; // ES6 Native Promise를 mongoose에서 사용한다.
const connStr = 'mongodb://localhost:27017/fors';
mongoose.connect(connStr, { useNewUrlParser: true });
mongoose.connection.on('error', console.error);


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(expressSession({
  name: 'mjoverflow',
  resave: true,
  saveUninitialized: true,
  secret: 'long-longlonglong123asdasdaszxcasdq1123123sdasdlkjlkjaflkvna;ls123'
}));

app.use(bodyParser_post.urlencoded({ extended: false })); 
app.use(flash()); // flash message를 사용할 수 있도록

//=======================================================
// Passport 초기화
//=======================================================
app.use(passport.initialize());
app.use(passport.session());
passportConfig(passport);

// pug의 local에 현재 사용자 정보와 flash 메시지를 전달하자.
app.use(function(req, res, next) {
  res.locals.currentUser = req.user;  // passport는 req.user로 user정보 전달
  res.locals.flashMessages = req.flash();
  next();
});

app.use('/', indexRouter);
app.use('/event', eventRouter);
app.use('/price',priceRouter);
app.use('/search',searchRouter);
app.use('/explain', explainRouter);
app.use('/locateResult', locateResultRouter);
app.use('/join', joinRouter);
app.use('/cart', cartRouter);
require('./routes/auth')(app, passport);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
        
 
//쿠키와 세션을 미들웨어로 등록한다
app.use(cookieParser());
 

module.exports = app;
