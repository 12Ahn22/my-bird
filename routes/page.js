// 기본 루트 페이지 관련 라우터
const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();

const User = require('../models/index.js').User;

// 로그인 확인 여부 미들웨어를 사용해 보기
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const passport = require('passport');
const { session } = require('passport');

// 매 요청마다 실행되는 미들웨어
router.use((req, res, next) => {
  // locals에 저장해 사용한다.
  // console.log(`=========req.user====`, req.user);
  // console.log(`=========res.locals.user====${res.locals.user}=========`);
  // console.log(`=============session========`,res.session);
  // console.log('디시얼라이즈는 되는데 왜 저장이 안대?',req.user);
  res.locals.user = req.user || ''; // 근데 값을 저장을 못해;
  console.log('res.locals.user========================', res.locals.user); // 할당도 안해놓고 콘솔을 찍으니..안나오지...
  console.log('req.user에 있는 정보값들', req.user);
  if(req.user){
    console.log('==========토큰============');
    console.log(req.user.accessToken);
    console.log(res.locals.user.accessToken);
  }
  res.locals.followerCount = 0;
  res.locals.followingCount = 0;
  res.locals.followrIdList = [];

  next();
});

router.get('/', (req, res) => {
  console.log('GET 라우터입니다====');
  // console.log(req.locals.user);
  // const data = res.locals.user;
  res.render('main.ejs');
});

// 회원가입 페이지 라우터
router.get('/join', isNotLoggedIn, (req, res) => {
  res.render('join');
});

// 회원 가입 기능 라우터
router.post('/join', async (req, res, next) => {
  // 비밀번호를 해시암호로 변경한다
  const { email, nick, password } = req.body;
  // 데이터베이스에 회원 가입 정보를 저장한다
  try {
    const hash = await bcrypt.hash(password, 12);
    await User.create({
      email,
      nick,
      password: hash,
    });
    res.redirect('/');
  } catch (error) {
    next(error);
  }
});



// 세션 확인 라우터
// 로그인 된 경우만 세션 라우터에 접근가능
router.get('/session', isLoggedIn, (req, res) => {
  console.log('=========세션 라우터==========');
  console.log(req.session);
  res.json(req.session);
});

module.exports = router;
