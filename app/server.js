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
    baucis = require('baucis');

var app = express();

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.cookieParser('whatever'));
app.use(express.session({key: 'sid', cookie: {maxAge: 60000}}));
app.use(flash());

//use of passport
app.configure(function() {
    app.use(express.static('public'));
    app.use(express.cookieParser());
    app.use(express.bodyParser());
    app.use(express.session({ secret: 'keyboard cat' }));
    app.use(passport.initialize());
    app.use(passport.session());
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

app.get('/', function(req, res){
  res.render('index', {title:'Plataforma de openData'});
});

//admin views
app.get('/admin/upload/', admin.uploadFileForm);
app.post('/admin/upload/', admin.uploadFile);

//temporal stuff
app.get('/admin/upload2/', admin2.uploadFileForm);
app.post('/admin/upload2/', admin2.uploadFile);

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

//registro
app.get('/registro',registro.formulario);
app.post('/registro', registro.registro);

//login
app.post('/login', passport.authenticate('local', { successRedirect: '/',
                                                    failureRedirect: '/login' }));
app.get('/login', login.login);

app.listen(process.env.PORT || 3000);
console.log('Listening on port ' + process.env.PORT || 3000);
