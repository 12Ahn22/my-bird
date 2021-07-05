const express = require('express');
const path = require('path');
// log
const morgan = require('morgan');
// .env
const dotenv = require('dotenv');
const exp = require('constants');
dotenv.config();

// app 생성
const app = express();

// app 설정
app.set('port', 5000);

// 미들웨어 사용
app.use(express.json()); // json 데이터 파서
app.use(express.urlencoded({ extended: false })); // 내부 url 파서 사용
app.use(express.static(path.join(__dirname + 'public'))); // 정적 파일 위치 설정
app.use(morgan('dev')); // 로그 확인 모듈

// 임시 / 라우터
app.get('/', (req, res) => {
  res.send('Hello Node!');
});

// 리슨
app.listen(app.get('port'), () => {
  console.log(app.get('port') + '번 포트에서 대기중');
});
