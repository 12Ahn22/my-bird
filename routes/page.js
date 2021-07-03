// 기본 루트 페이지 관련 라우터
const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();

const User = require('../models/index.js').User;

router.get('/',(req,res)=>{
  res.render('main.ejs');
})

// 회원가입 페이지 라우터 
router.get('/join',(req,res)=>{
  res.render('join');
})

// 회원 가입 기능 라우터
router.post('/join',async (req,res,next)=>{
  // 비밀번호를 해시암호로 변경한다
  const {email, nick, password} = req.body;
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


// 로그인 페이지 라우터
router.get('/login',(req,res)=>{
  res.render('login');
})



module.exports = router;