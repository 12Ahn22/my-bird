// 카카오톡 로그인을 위한 전략
// http://www.passportjs.org/packages/passport-kakao/
const passport = require('passport');
const KakaoStrategy = require('passport-kakao').Strategy;
// db
const User = require('../models').User;

module.exports = () => {
  passport.use(
    new KakaoStrategy(
      {
        clientID: process.env.KAKAO_ID,
        clientSecret: '', // clientSecret을 사용하지 않는다면 넘기지 말거나 빈 스트링을 넘길 것
        // http://localhost:5000/auth/kakao/callback
        callbackURL: '/auth/kakao/callback',
      },
      async (accessToken, refreshToken, profile, done) => {
        // 사용자의 정보가 profile에 담겨있다.
        // profile에 넘길 데이터는 카카오 디벨로퍼에서 설정한다. = 동의 항목
        // 내가 동의를 한 항목의 데이터만 넘긴다.
        // console.log('kakako profile', profile);
        try {
          // db에서 이전에 카카오로 로그인을 시도해 db에 저장된 적이 있는지 확인
          const exUser = await User.findOne({
            // snsId가 profile에서 넘긴 카카오 계정의 id인 데이터 찾기
            // provider도 kakao여야한다.
            where: { snsId: profile.id, provider: 'kakao' },
          });
          // exUser가 있다면 이미 카카오로 로그인을 한 적이 있는 유저
          if (exUser) {
            // verify Callback-authenticate로 감
            done(null, exUser); // 에러는 없고 user데이터는 보냄
          } else {
            // 만약 db에 카카오로 로그인한적 없는 신규 유저라면
            // db에 해당 snsId와 저장한다

            console.log('===profile에 뭐가있나요?===');
            console.log(profile._json.kakao_account.email);
            console.log(profile.id);
            console.log(profile.displayName);

            // 새 유저 생성하기
            // email과 snsId와 닉네임 저장하기
            const newUser = await User.create({
              email: profile._json.kakao_account.email,
              nick: profile.displayName,
              snsId: profile.id,
              password: '',
              provider: 'kakao',
            });
            done(null, newUser);
          }
        } catch (err) {
          console.error(err);
          done(err);
        }
      }
    )
  );
};
