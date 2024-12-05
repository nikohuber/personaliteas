const controllers = require('./controllers');
const mid = require('./middleware');

const router = (app) => {
  app.get('/p/:id', controllers.Personality.p);

  app.get('/getP', mid.requiresLogin, controllers.Personality.getP);

  app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);

  app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);

  app.get('/logout', mid.requiresLogin, controllers.Account.logout);

  app.get('/home', mid.requiresLogin, controllers.Personality.home);
  app.post('/home', mid.requiresLogin, controllers.Personality.makeP);
  app.delete('/home', mid.requiresLogin, controllers.Personality.deleteP);

  app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
};

module.exports = router;
