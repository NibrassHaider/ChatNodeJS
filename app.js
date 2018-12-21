require('dotenv').config();

var express = require('express');
let bodyParser = require('body-parser');
let cors = require('cors');
var path = require('path');
var mongoose = require('mongoose');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./server/routes/index');
var usersRouter = require('./server/routes/user');

var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// parse requests of content-type - application/json
app.use(bodyParser.json());

// static files permitted
app.use('/static', express.static('static'));

// URLs
app.use('/', indexRouter);
app.use('/user', usersRouter);

app.disable('etag');
app.get('*', function (req, res, next) {
    res.setHeader('Last-Modified', (new Date()).toUTCString());
    next()
});

// CROSS-ORIGIN RESOURCE SHARING
// Cors
var originsWhitelist = [
    'http://localhost',
    'http://localhost:3000',
];
var corsOptions = {
    origin: function (origin, callback) {
        var isWhitelisted = originsWhitelist.indexOf(origin) !== -1;
        callback(null, isWhitelisted)
    },
    credentials: true
};

// Here is the magic
app.use(cors(corsOptions));

// Connect to mongoDB.
mongoose.Promise = require('q').Promise;
mongoose.connect(process.env.DB_HOST, { useNewUrlParser: true });

// Server Listening
server.listen(process.env.PORT, function () {
    console.log('Server and listening on port ' + process.env.PORT);
});

module.exports = app;
