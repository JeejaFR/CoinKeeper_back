require('dotenv').config();
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var db = require('./db');
const cors = require('cors');


var usersRouter = require('./routes/users');
var transactionsRouter = require('./routes/transactions');
var notificationsRouter = require('./routes/notifications');
var categoriesRouter = require('./routes/categories');



var app = express();

const corsOptions = {
  origin: 'http://localhost:3000', 
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
};

app.use(cors(corsOptions));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('', usersRouter);
app.use('/transactions', transactionsRouter);
app.use('/notifications', notificationsRouter);
app.use('/categories', categoriesRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // send error details only in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // return the error as JSON
  res.status(err.status || 500);
  res.json({ error: err.message });
});

app.listen(2000, () => {
  console.log('Server running on http://localhost:2000');
});

module.exports = app;
