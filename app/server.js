var env = require('dotenv'); env.load();

var express = require('express'),
    path = require('path'),
    flash = require('connect-flash'),
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    schema = require('./models/user'),
    User_model = schema.User,
    registro = require('./routes/registro'),
    admin = require('./routes/admin'),
    admin2 = require('./routes/admin2'),
    login = require('./routes/login'),
    api = require('./routes/api'),
    dataset = require('./routes/dataset'),
    citizen = require('./routes/citizen'),
    developer = require('./routes/dev'),
    slashes = require('connect-slashes');

var app = express();

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.cookieParser('whatever'));
app.use(express.session({key: 'sid', cookie: {maxAge: 600000}}));
app.use(slashes());
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
  User_model.findOne({ email: username }, function(err, userx) {
    if (err) { 
      return done(err); 
    }
    if (!userx) {
      return done(null, false, { message: 'Incorrect email.' });
    }
    if (!userx.validPassword(password)) {
      return done(null, false, { message: 'Incorrect password.' });
    }
    return done(null, userx);
  });
}
));
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User_model.findById(id, function(err, user) {
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
  next();
});

// configurando las rutas
admin(app);
api(app);
developer(app);
citizen(app);

// temporal stuff
app.get('/admin/upload2/', admin2.uploadFileForm);
app.post('/admin/upload2/', admin2.uploadFile);
app.get('/datasets/:name/:format?', dataset.showDataset);

// login y registro
app.get('/registro', registro.formulario);
app.post('/registro', registro.registro);

app.post('/login', passport.authenticate('local', { successRedirect: '/',
  failureRedirect: '/login' }));
app.get('/login', login.login);

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});




app.listen(process.env.PORT || 3000);
console.log('Listening on port %s', process.env.PORT || 3000);
