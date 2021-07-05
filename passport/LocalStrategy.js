// 로컬 전략
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

const User = require('../models').User;

module.exports = ()=>{
  passport.use(new LocalStrategy({
    // passport는 기본적으로 id와 password를 req에서 가져와 비교한다.
    // 그 설정을 바꾸기 위해서 new LocalStrategy의 첫번째 인자로
    // {
    //  usernameField: '아이디로 원하는 이름',
    //  passwordField: '비밀번호로 원하는 이름'
    // }
    usernameField: 'email',
    passwordField: 'password'
  },
  // done은 passport.authenticate('전략', 여기가 done이다 )
  async (email, password , done)=>{
    try {
      // 로그인에서 email을 받아와 DB USER 테이블에 있는지 확인한다.
      const exUser = await User.findOne({where: {email}});
      // DB에서 유저 정보를 찾아온다면
      if(exUser){
        // 비밀번호를 비교한다.
        const result = await bcrypt.compare(password, exUser.password);
        // 비밀번호가 맞을 경우
        if(result){
          done(null,exUser); // 콜백 함수에 err는 null이고 구한 유저정보를 넘긴다.
        }else{
          done(null, false, {message : '비밀번호가 일치하지 않습니다.'});
        }
        done(null,false,{message : '가입되지 않았습니다.'});
      }
    } catch (err) {
      console.error(err);
      done(err);
    }
  
  }))
}