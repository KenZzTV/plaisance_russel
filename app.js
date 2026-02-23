var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const mongodb = require('./db/mongo');
const catwaysRouter = require('./routes/catways');
const reservationRoutes = require('./routes/reservations');

mongodb.initClientDbConnection();

var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(cors({
    exposedHeaders: ['Authorization'],
    origin: '*'
}));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/catways', catwaysRouter);
app.use('/catways/:id/reservations', reservationRoutes);

app.use(function(req, res, next) {
  res.status(404).json({name: 'PORT RUSSELL', version: '1.0', status: 404, message: 'Not found'});
});

module.exports = app;
