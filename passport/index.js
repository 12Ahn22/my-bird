// 모든 전략들을 관리하는 파일
const passport = require('passport');
const local = require('./LocalStrategy'); // 로컬 인증 전략 가져오기

const User = require('../models/index').User;

// 시리얼라이즈유저와 데시리얼라이즈유저 메서드
module.exports = () => {
  // 세션에 정보를 기억하는 메서드
  // 로그인 시,  실행된다.
  // req.session에 어떤 데이터를 저장할지 정한다
  // req.session은 express-session이 만드는 객체이다.
  passport.serializeUser((user, done) => {
    console.log('시리얼라이즈 유저', user);
    // 로그인 시, 사용자 데이터를 세션에 저장하는데
    done(null, user.id); // user전부를 기억하면 용량이 커지기때문에 id만 저장
  });

  // 매 요청마다 발생한다. id는 시리얼라이즈의 user.id다.
  // passport.session 미들웨어가 이 메서드를 실행한다.
  passport.deserializeUser((id, done) => {
    console.log('디시리얼라이즈 유저', id);
    User.findOne({ where: { id } })
      .then((user) => {
        // console.log('디시리얼라이즈에서 찍히는 유저',user);
        done(null, user); // req.user 에 저장된다.
      }) // 조회한 정보를 req.user에 저장한다.
      .catch((error) => done(error));
  });

  local();
};
