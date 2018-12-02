// 로그인을 확인 할수 있는 모듈
module.exports = function needAuth(req, res, next) {
    if (req.isAuthenticated()) {
      next();
    } else {
      req.flash('danger', '로그인 후 가능한 페이지입니다!');
      res.redirect('/');
    }
  }