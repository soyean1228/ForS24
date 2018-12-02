var express = require('express');
var router = express.Router();

const Member = require('../models/members');

/* GET home page. */
router.get('/', async(req, res, next)=> {
  res.render('join');
});

function validateSignupform (form){
    var id = form.id || "";
    var email = form.email || "";
    var password = form.pwd || "";
 
    if( !id ){
      return "유효한 이름을 입력하세요";
    }
  
    if( !email ){
      return "유효한 이메일을 입력하세요";
    }
  
    if( !password ){
      return "유효한 비밀번호를 입력하세요";
    }
  
    return null;
  }
  
  
  // signup
  router.post('/signup' , async( req , res , next) => {
    // 데이터가 잘넘어오는지 확인을 위해서
    console.log(req.body);
    // 회원 가입 폼 검사하고 req.body로 넘어옴
    var err = validateSignupform(req.body);
    if(err){
      return res.redirect('back');
    }
  
    // 가입된 유저인지 환인
    var member = await Member.findOne({email:req.body.email});
    // 에러처리는 알아서 잘하자
    if(member){
      return res.redirect('back');
    }
  
    // 스키마에 저장하고
    member = new Member({
      email:req.body.email,
      uid:req.body.id,
      password:req.body.pwd
    });
    
    // 새로운 디비를 저장하자
    await member.save();
    // 홈화면으로 리다이렉션 해주자.
    return res.redirect('/');
  
  });
module.exports = router;