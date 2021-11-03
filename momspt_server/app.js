const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');

const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./swagger/swagger.yaml');


const indexRouter = require('./routes/index');
//var usersRouter = require('./routes/users');
const workoutRouter = require('./routes/workout');
//var planManageRouter = require('./routes/plan-manage');
const userRouter = require('./routes/user');
const dailyRouter = require('./routes/daily');
const mypageRouter = require('./routes/mypage');

const authMiddleware = require('./middlewares/auth');


const app = express();
const port = 3000;

const sequelize = require('./database/models').sequelize;
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
app.use(cors())

//const specs = swaggerJsdoc(options);
app.use("/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument, {explorer: true})
);


app.use('/', indexRouter);
app.use('/user', userRouter);
app.use('/workout',workoutRouter);
app.use('/daily', dailyRouter);
app.use('/mypage', mypageRouter);



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
