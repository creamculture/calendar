var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var multer  = require('multer');
var expressSession = require('express-session');
var multer  = require('multer');

var mongo = require('mongodb');
var monk = require('monk');

var db = monk('mongodb://admin:admin@ds053838.mongolab.com:53838/heroku_app33580717');


var routes = require('./routes/MainController');

var app = express();

var mkdirp = require('mkdirp');
mkdirp.mkdirp('./uploads');

mkdirp.mkdirp('./public/images/profile');
mkdirp.mkdirp('./public/images/events');
mkdirp.mkdirp('./public/images/events/cropped');


app.use(multer({ dest: './uploads/'}));
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//Cookies and sessions woohoo
app.use(cookieParser('yousecretcode'));
app.use(expressSession({secret: 'yourothersecretcode', saveUninitialized: true, resave: true}));

app.use(express.static(path.join(__dirname, 'public')));
app.use(function(req,res,next){
    req.db = db;
    next();
});

//PAGES&ROUTES
app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});


// error handlers
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = app;
