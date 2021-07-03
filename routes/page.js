const express = require('express');

const router = express.Router();
// 기본 루트 페이지 관련 라우터

router.get('/',(req,res)=>{
  res.render('main.ejs');
})

// 회원가입 페이지 라우터 
router.get('/join',(req,res)=>{
  res.render('join');
})

// 로그인 페이지 라우터
router.get('/login',(req,res)=>{
  res.render('login');
})



module.exports = router;