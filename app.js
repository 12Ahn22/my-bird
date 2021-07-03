const express = require('express');

const morgan = require('morgan');
const dotenv = require('dotenv');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');

// app 생성
const app = express();
// app 설정
app.set('port', process.env.PORT || 8500); // 포트설정
// ejs를 사용하기 위한 설정
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
// ejs 레이아웃 사용하기
// app.set(expressLayouts);

// 미들웨어 사용
// static 폴더 경로 설정 /public으로
app.use(express.static(path.join(__dirname, 'public')));
// body-parser
app.use(express.json()); // json 파일을 파서
app.use(express.urlencoded({extended:false})); // url을 해석- 내장모듈 사용
// morgan - 로그
app.use(morgan('dev'));

app.get('/', (req, res) => {
  res.render('main.ejs');
})

app.listen(app.get('port'), () => {
  console.log(app.get('port'),'번 포트에서 대기중!');
})