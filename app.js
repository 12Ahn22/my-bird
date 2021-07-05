const express = require('express');
const path = require('path');
// log
const morgan = require('morgan');
// .env
const dotenv = require('dotenv');
const exp = require('constants');
dotenv.config();
// db 객체 가져오기
const {sequelize} = require('./models'); // db 객체.sequelize
// session
const session = require('express-session');
// passport
const passport = require('passport');

// app 생성
const app = express();

// app 설정
app.set('port', 5000);
// ejs 설정
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// 미들웨어 사용
app.use(express.json()); // json 데이터 파서
app.use(express.urlencoded({ extended: false })); // 내부 url 파서 사용
app.use(express.static(path.join(__dirname + 'public'))); // 정적 파일 위치 설정
app.use(morgan('dev')); // 로그 확인 모듈
// passport를 사용하기 위해서 session이 꼭 필요하다
app.use(session({
  resave:false,
  saveUninitialized: false,
  secret: process.env.COOKIE_SECRET,
  cookie:{
    secure: false,
    httpOnly: true
  }
}))
// 데이터베이스 연결하기
sequelize.sync({ force:false})
  .then(()=>{
    console.log('데이터베이스 연결 완료');
  })
  .catch((error)=>{
    console.error(error);
  })
  
// passport 설정
const passportConfig = require('./passport');
passportConfig();

// passport
app.use(passport.initialize());
app.use(passport.session());


//  라우터 가져오기
const pageRoute = require('./routes/page');
const authRoute = require('./routes/auth');

// 라우터 사용하기
app.use('/',pageRoute);
app.use('/login',authRoute);



// 에러 처리 라우터
app.use((err, req, res, next) => {
  console.error(err);
  err.status = 500;
  // err.message = '에러 처리 라우터입니다';
  res.render('err', { error: err });
});

// 리슨
app.listen(app.get('port'), () => {
  console.log(app.get('port') + '번 포트에서 대기중');
});
