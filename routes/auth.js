// 로그인 관련 라우터
const express = require('express');
const  router = express.Router();
const passport = require('passport');

// 로그인 페이지 라우터
// /login
router.get('/',(req,res)=>{
  res.render('login');
})

// 로그인을 실행하는 라우터
router.post('/',(req,res,next)=>{
  // 미들 웨어 안에서 미들웨어를 사용하기
  passport.authenticate('local',(authError,user,info)=>{
    if(authError){
      console.error(authError);
      return next(authError);
    }
    if(!user){
      return next(authError);
    }
    return req.login(user,(loginError)=>{
      if(loginError){
        console.error(loginError);
        return next(loginError);
      }
      return res.redirect('/');
    })
  })(req,res,next);
});



// 로그아웃
// login/out
router.get('/out',(req,res)=>{
  req.logout();
  req.session.destroy();
  res.redirect('/');
});

module.exports = router;