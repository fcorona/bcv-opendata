var env = require('dotenv'); env.load();
var express = require('express'),
    path = require('path'),
    flash = require('connect-flash'),
    admin = require('./routes/admin'),
    admin2 = require('./routes/admin2'),
    api = require('./routes/api'),
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    registro = require('./routes/registro'),
    login = require('./routes/login'),
    schema = require('./models/user'),
    User_model = schema.User,
    dataset = require('./routes/dataset'),
    citizen = require('./routes/citizen'),
    dev = require('./routes/dev'),
    slashes = require('connect-slashes'),
    baucis = require('baucis');

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


//admin routes
app.get('/admin/', admin.home);
app.get('/admin/datasets/', admin.datasets);
app.get('/admin/datasets/:dataset/metrics', admin.metrics);

app.get('/admin/apps/', admin.apps);
app.get('/admin/apps/:appId', admin.viewApp);
app.post('/admin/apps/:appId', admin.updateApp);

app.get('/admin/devs/', admin.developers);
app.get('/admin/devs/:devId', admin.viewDeveloper);
app.post('/admin/devs/:devId', admin.updateDeveloper);

app.get('/admin/upload/', admin.uploadFileForm);
app.post('/admin/upload/', admin.uploadFile);

  //temporal stuff
app.get('/admin/upload2/', admin2.uploadFileForm);
app.post('/admin/upload2/', admin2.uploadFile);


//citizen routes
app.get('/', citizen.home);
app.get('/datasets/', citizen.datasets);
app.get('/apps/', citizen.apps);
app.get('/apps/:appId', citizen.viewApp);

//registro
app.get('/registro', registro.formulario);
app.post('/registro', registro.registro);

//view datasets
app.get('/datasets/:name/:format?', dataset.showDataset);

//api routes
var datasetController = baucis.rest({singular: 'Dataset', plural: 'datasets', select: 'name type', findBy:'name'});
var dimensionController = baucis.rest({singular: 'Dimension', plural: 'dimensions', select: '-__v -_id'});
var categoryController = baucis.rest({singular: 'Category', plural: 'categories', selects: '-__v -__id'});
var dataController = baucis.rest({singular: 'Data', plural: 'datas', selects: '-__v -__id'});
var valuesController = baucis.rest({singular: 'Values', plural: 'values', selects: '-__v -__id'});
app.use('/api/v1', baucis({swagger:true}));

app.get('/api/datasets/', api.listDataset);
app.get('/api/datasets/:name', api.readDataset);
app.get('/api/dimensions/:dimension', api.readDatasetDimension);
app.get('/api/categories/:category', api.readDatasetCategory);
app.get('/api/datas/:indicator', api.readDatasetIndicator);
app.get('/api/datasets/:name/:dimension/:category/:indicator/:year', api.notImplemented);


//login
app.post('/login', passport.authenticate('local', { successRedirect: '/',
  failureRedirect: '/login' }));
app.get('/login', login.login);

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});


//developer
app.get('/dev/apps', dev.apps);
app.get('/dev/apps/create', dev.formApp);
app.post('/dev/apps/create', dev.createApp);
app.get('/dev/apps/:id', dev.viewApp);
app.get('/dev/apps/:id/edit', dev.editApp);
app.post('/dev/apps/:id/edit', dev.updateApp);
app.post('/dev/keys/generate', dev.generateKey);


app.listen(process.env.PORT || 3000);
console.log('Listening on port %s', process.env.PORT || 3000);
