'use strict';
const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
// 시퀄라이저의 설정을 가져오기 - [현재 어플리케이션의 상태]에 따라 다른 설정을 가져온다.
const config = require('../config/config.json')[env];

// db데이터 제어 객체이다.
const db = {}; // 데이터베이스(스키마)와 매핑됨

// config에 있는 설정으로 시퀄라이즈 객체 생성
const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

//DB객체에 시퀄라이즈 객체를 속성에 바인딩한다.
db.sequelize = sequelize; // sequelize는 생성자와 config로 생성한 시퀄라이져 객체
db.Sequelize = Sequelize; // Sequelize는 Sequelize 모듈
db.Config = config; // 설정도 db 객체에 프로퍼티로 추가

// 만든 모델들 가져오기
// sequelize.define 함수를 실행한 걸 리턴함. => 모델 객체
db.User = require('./user.js')(sequelize, Sequelize);
db.Post = require('./post.js')(sequelize, Sequelize);
db.Hashtag = require('./hashtag.js')(sequelize, Sequelize);

// 모델들의 관계 설립하기
// DB들의 관계를 설립하기

// 유저에 대한 관계 설립하기
// User는 많은 Post를 가진다.
db.User.hasMany(db.Post);
// User는 많은 User에 속해 있다. - 팔로우/팔로워 관계
// N:M의 관계다.
db.User.belongsToMany(db.User, {
  foreignKey: 'followingId',
  as: 'Followers',
  through: 'Follow',
});
db.User.belongsToMany(db.User, {
  foreignKey: 'followerId',
  as: 'Followings',
  through: 'Follow',
});

// 모듈 내보내기
module.exports = db;
