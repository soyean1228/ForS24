module.exports = (app, passport) => {
    
    // local login
    app.post('/signin', passport.authenticate('local-signin', {
      successRedirect : '/',
      failureRedirect : '/',
    }));
  
    // logout
    app.get('/signout', (req, res) => {
      req.logout();
      res.redirect('/');
    });
  };