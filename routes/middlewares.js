// 로그인 여부를 판단하는 미들웨어
// 미들웨어를 하나하나 따로 내보낸다
exports.isLoggedIn = (req, res, next) => {
  // passport 내장 메서드 isAuthenticated()
  // req.isAuthentacated()는 로그인이 된 경우 true 반환
  if (req.isAuthenticated()) {
    // 로그인이 된 경우 next() 가능
    //
    next();
  } else {
    res.status(403).send('로그인이 필요합니다');
  }
};

exports.isNotLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    // 로그인이 되지 않은 경우 next() 가능
    next();
  } else {
    // 그냥 바로 메인으로 보내버리기
    res.redirect('/');
  }
};
