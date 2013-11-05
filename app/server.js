var express = require('express'),
    path = require('path');
    fs = require('fs');

var app = express();

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res){
  res.render('index', {title:'Plataforma de openData'});
});

app.get('/admin/upload/', function(req, res){
  console.log(req);
  res.render('upload', {title:'Plataforma de openData'});
});

app.post('/admin/upload/', function(req, res){
  
  fs.readFile(req.files.file.path, {encoding:'utf8'}, function (err, data) {
    console.log(data);
  });
  res.redirect('/admin/upload/');
});

app.listen(3000);
console.log('Listening on port 3000');