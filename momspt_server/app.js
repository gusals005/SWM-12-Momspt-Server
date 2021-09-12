var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
//var usersRouter = require('./routes/users');
var workoutRouter = require('./routes/workout');
//var planManageRouter = require('./routes/plan-manage');
var userRouter = require('./routes/user');
var dailyRouter = require('./routes/daily');
var mypageRouter = require('./routes/mypage');

const authMiddleware = require('./middlewares/auth');


var app = express();
var port = 3000;

var sequelize = require('./database/models').sequelize;
sequelize.sync();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('jwt-secret', process.env.SECRET)

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/user', userRouter);

app.use('/', authMiddleware)
app.use('/', indexRouter);
//app.use('/users', usersRouter);
app.use('/workout',workoutRouter);
app.use('/daily', dailyRouter);
app.use('/mypage', mypageRouter);
//app.use('/planmanage',planManageRouter);


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

app.listen(port, () => {
  

  console.log(`Server start at ${port}`);
})

module.exports = app;
