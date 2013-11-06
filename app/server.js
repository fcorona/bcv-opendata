var express = require('express'),
    path = require('path'),
    flash = require('connect-flash'),
    admin = require('./routes/admin');

var app = express();

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.cookieParser('whatever'));
app.use(express.session({key: 'sid', cookie: {maxAge: 60000}}));
app.use(flash());

/*
* routing
*/
app.get('/', function(req, res){
  res.render('index', {title:'Plataforma de openData'});
});
app.get('/admin/upload/', admin.uploadFileForm);
app.post('/admin/upload/', admin.uploadFile);


app.listen(3000);
console.log('Listening on port 3000');