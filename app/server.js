var express = require('express'),
    path = require('path'),
    flash = require('connect-flash'),
    admin = require('./routes/admin'),
    admin2 = require('./routes/admin2'),
    api = require('./routes/api'),
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategyi,
    registro = require('./routes/registro')
    dataset = require('./routes/dataset');

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
app.get('/api/datasets/', api.listDataset);
app.get('/api/datasets/:name', api.readDataset);
app.get('/api/dimensions/:dimension', api.readDatasetDimension);
app.get('/api/categories/:category', api.readDatasetCategory);
app.get('/api/datas/:indicator', api.readDatasetIndicator);
app.get('/api/datasets/:name/:dimension/:category/:indicator/:year', api.notImplemented);

//registro
app.get('/registro',registro.formulario);
app.post('/registro', registro.registro);

app.listen(3000);
console.log('Listening on port 3000');
