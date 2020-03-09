var createError = require('http-errors');//处理错误路由
var express = require('express');
var path = require('path');
const fs = require("fs");
var cookieParser = require('cookie-parser');//解析cookie
var logger = require('morgan');//写日志
const session = require('express-session');
const redisStore = require('connect-redis')(session);

// var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');
const blogRouter = require('./routes/blog');
const userRouter = require('./routes/user');

var app = express();//每次请求都生成实例

// view engine setup//注册视图引擎
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

const env = process.env.NODE_ENV;
if(env == "dev"){
  //开发环境
  app.use(logger('dev'));
}else{
  //生产环境
  const logFileName = path.join(__dirname, 'logs', 'access.log');
  const writeStream = fs.createWriteStream(logFileName, {
    flags:"a"
  })
  app.use(logger('combined',{
    stream:writeStream
  }));
}

app.use(express.json());//处理content-type是json的post传过来的数据
app.use(express.urlencoded({ extended: false }));//处理content-type是urlencoded的post传过来的数据
app.use(cookieParser());//解析cookie
// app.use(express.static(path.join(__dirname, 'public')));//可以返回静态文件

const redisClient = require('./db/redis');
const sessionStore = new redisStore({
  client: redisClient
})
app.use(session({
  secret: "Gx_3445dfa",
  cookie: {
    // path: "/",//默认配置
    // httpOnly: true,//默认配置
    maxAge: 24*60*60*1000
  },
  store: sessionStore
}))

//是否登录  这样用的话登录也会进行这个
// app.use(loginResult);

//处理路由
// app.use('/', indexRouter);
// app.use('/users', usersRouter);//users是父路径，usersRouter里面有子路径
app.use('/api/blog', blogRouter);//users是父路径，usersRouter里面有子路径
app.use('/api/user', userRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'dev' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
