// 로그인 관련 라우터
const express = require('express');
const router = express.Router();
const passport = require('passport');
const { isNotLoggedIn } = require('../routes/middlewares');

// 로그인 페이지 라우터
// /auth/login
router.get('/login', isNotLoggedIn, (req, res) => {
  res.render('login');
});

// 로그인을 실행하는 라우터
router.post('/login', (req, res, next) => {
  // 미들 웨어 안에서 미들웨어를 사용하기
  passport.authenticate('local', (authError, user, info) => {
    if (authError) {
      console.error(authError);
      return next(authError);
    }
    if (!user) {
      return next(authError);
    }
    return req.login(user, (loginError) => {
      if (loginError) {
        console.error(loginError);
        return next(loginError);
      }
      return res.redirect('/');
    });
  })(req, res, next);
});

// 로그아웃
// auth/logout
router.get('/logout', (req, res) => {
  // res.locals.user.provider 이게 카카오면.. 카카오 로그인을 하기?

  req.logout();
  req.session.destroy();
  res.redirect('/');
});

// 카카오 로그인 테스트
// auth/kakao
router.get('/kakao', passport.authenticate('kakao'));
router.get(
  '/auth/kakao/callback',
  passport.authenticate('kakao', {
    failureRedirect: '/',
  }),
  (req, res) => {
    res.redirect('/');
  }
);


// 카카오 계정 로그아웃 하기

module.exports = router;
