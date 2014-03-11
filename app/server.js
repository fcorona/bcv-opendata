var env = require('dotenv');
env.load();

require('newrelic');

var express = require('express'),
    path = require('path'),
    flash = require('connect-flash'),
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    schema = require('./models/user'),
    UserModel = schema.User,
    userRoutes = require('./routes/user'),
    registro = require('./routes/registro'),
    admin = require('./routes/admin'),
    admin2 = require('./routes/admin2'),
    login = require('./routes/login'),
    api = require('./routes/api'),
    citizen = require('./routes/citizen'),
    developer = require('./routes/dev'),
    apps = require('./models/apps');

var app = express();
app.use(express.compress());
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.cookieParser('whatever'));
app.use(express.session({key: 'sid', cookie: {maxAge: 600000}}));
app.use(flash());

//use of passport
app.configure(function() {
  app.use(passport.initialize());
  app.use(passport.session({key: 'sid', cookie: {maxAge: 600000}}));
  app.use(function (req, res, next) {
    res.locals.login = req.isAuthenticated();
    res.locals.user = req.user;
    next();
  });
  app.use(app.router);
});

passport.use(new LocalStrategy(function(username, password, done) {
  UserModel.findOne({ email: username })
  .populate('testKey')
  .exec(function(err, user) {
    if (err) { 
      return done(err); 
    }
    if (!user) {
      return done(null, false, { message: 'Incorrect email.' });
    }
    if (!user.validPassword(password)) {
      return done(null, false, { message: 'Incorrect password.' });
    }
    return done(null, user);
  });
}
));
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  UserModel.findById(id)
  .populate('testKey')
  .exec(function(err, user) {
    done(err, user);
  });
});

//end
/*
* routing
*/
app.all('*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  //carga apps populares en el home:
  apps.AppModel.listLast(4, function(err, apps){
    res.locals.popApps = apps;
    next();
  })
});

// configurando las rutas
userRoutes(app);
admin(app);
api(app);
developer(app);
citizen(app);

// temporal stuff
app.get('/admin/upload2', admin2.uploadFileForm);
app.post('/admin/upload2', admin2.uploadFile);

// login y registro
app.get('/registro', registro.formulario);
app.post('/registro', registro.registro);

app.post('/login', passport.authenticate('local', { failureRedirect: '/login' }),
  function(req, res){
    if(req.user.role == 'admin'){
      res.redirect('/admin');
    }else{
      res.redirect('/dev/apps');
    }
});

app.get('/login', login.login);

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});


app.listen(process.env.PORT || 3000);
console.log('Listening on port %s', process.env.PORT || 3000);
