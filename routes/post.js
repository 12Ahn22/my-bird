const express = require('express');
const { isLoggedIn } = require('./middlewares');
const router = express.Router();
const multer = require('multer');
const path = require('path');

// db
const Post = require('../models').Post;
const { Hashtag } = require('../models');

// 포스트 작성 페이지 라우터
router.get('/',isLoggedIn,(req,res)=>{
  // 디시리얼라이저 메서드에서 유저정보를 가져온다.
  // console.log('=========req.user.id==========');
  // console.log(req.user.id); // undefined
  console.log('===========req.user.user.id=============');
  console.log(req.user.user.id);
  const user = req.user.user;
  // console.log(user);
  const data = {
    id: user.id,
    nick: user.nick
  }
  // ejs로 데이터를 넘길때, 객체로 감싸서 넘겨야한다.
  res.render('post.ejs', {data} );
});

// // multer 설정
const upload = multer({
  // 저장할 장소
  storage: multer.diskStorage({
    destination(req,file,cb){
      cb(null, 'public/uploads'); // 
    },
    // 저장할 파일의 이름 설정
    filename(req,file,cb){
      const ext = path.extname(file.originalname);
      cb(null,path.basename(file.originalname, ext) + Date.now()+ ext);
    }
  }),
  limits:{fileSize:5*1024*1024} // 파일 크기 제한
});

// // multer 설정하기
// const upload = multer({
//   destination(req, file, cb) {
//     cb(null, 'public/uploads');
//   },
//   filename(req, file, cb) {
//     cb(null, `${Date.now()}__${file.originalname}`);
//   },
// })


// 이미지 업로드를 위한 multer 라우터
// 하나의 이미지만 받는다. img는 뷰에서 name이 img인 input file 요소
// 이 라우터는 input file에 change 이벤트가 발생했을 때,
// 사용된다 = 이미지를 변경하면 그 이미지를 서버에 저장하고
// url을 반환해서 input의 히든태그에 넣어준다(클라이언트단에서)
router.post('/img', isLoggedIn, upload.single('img') , (req,res)=>{
  console.log(req.file);
  res.json({url:`uploads/${req.file.filename}`});
})

// const uploads2 = multer();
// 포스트 작성을 위한 라우터
// 받는 데이터 형식이 이미지가 아니라 그냥 url만 받기 때문에 none
router.post('/',isLoggedIn, async(req,res,next)=>{
  // req에서 가져온 값으로 post를 만든다.
  // Post 생성하기
  console.log('----------req.body.url-----------', req.body);
  try {
    const post = await Post.create({
      contents: req.body.contents,
      userId:req.body.id,
      img:req.body.url, // 실제 이미지가 아닌 그 이미지가 저장되는 url을 저장
    })
  // 해시태그 생성하기
  // content에 있는 #들을 쪼개서 가져온다
  const hashtags = req.body.contents.match(/#[^\s#]+/g);
  // 해시태그들이 여러개라면 여러개가 선택됨 /g 니까
  if(hashtags){
    const result = await Promise.all(
      hashtags.map(tag=>{
        // tag가 없으면 생성
        return Hashtag.findOrCreate({
          // 앞에 #자르기 tag.slice(1) 소문자화 .tolowerCase()
          where:{ title:tag.slice(1).toLowerCase()},
        })
      }),
    );
    // result는 db에서 찾아온 tag들 데이터가 들어있다.
    // 그 태그의 id값을 새 글(post)와 관계를 지어준다.
    // Foo.hasMany(Bar); Associations를 참고
    await post.addHashtags(result.map(r=>r[0]));
  }
  } catch (error) {
    console.error(error);
    res.json(error)
  }
  res.redirect('/');
});


module.exports = router;