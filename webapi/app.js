let createError = require('http-errors');
let express = require('express');
let cookieParser = require('cookie-parser');
let cors = require('cors');

let apiLoginRouter = require('./api/login');
let apiGameRouter = require('./api/game');
let apiLeaderboardRouter = require('./api/leaderboard');

let app = express();

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/api/login', apiLoginRouter);
app.use('/api/game', apiGameRouter);
app.use('/api/leaderboard', apiLeaderboardRouter);

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
  res.json(err);
});

module.exports = app;
