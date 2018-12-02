const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/members');

module.exports = function(passport) {
  
  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser((id, done) =>  {
    User.findById(id, done);
  });

  // local login auth
  passport.use('local-signin', new LocalStrategy({
      usernameField : 'uid',
      passwordField : 'password',
      passReqToCallback : true
    }, async (req, uid, password, done) => {
    try {
      console.log("try login");
      const user = await User.findOne({uid: uid});
      
      if(!user){
        return done(null, false,req.flash('danger', '아이디가 틀렸습니다 다시 로그인 해주세요~!'));
      }

      if (user.password == password) {
        return done(null, user, req.flash('success', '로그인 성공~'));
      }
      else{
        return done(null, false,req.flash('danger', '비밀번호가 틀렸습니다 다시 로그인 해주세요~!'));
      }
    } catch(err) {
      done(err);
    }
  }));

};