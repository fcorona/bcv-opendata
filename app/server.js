var express = require('express'),
    path = require('path'),
    fs = require('fs'),
    flash = require('connect-flash');

var app = express();

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.cookieParser('whatever'));
app.use(express.session({key: 'sid', cookie: { maxAge: 60000 }}));
app.use(flash());


app.get('/', function(req, res){
  res.render('index', {title:'Plataforma de openData'});
});

app.get('/admin/upload/', function(req, res){
  res.render('upload', {title:'Plataforma de openData', messages: req.flash()});
});

app.post('/admin/upload/', function(req, res){
  if(req.files.file.headers['content-type']!=='text/csv'){
    req.flash('error', req.files.file.name +' no es un archivo valido, por favor suba un archivo CSV.')
    res.redirect('/admin/upload/');
    return;
  }

  var originalHeaders= ['Dimensión', 'Categoría','Indicador','Descripción','Unidad de Medida','Fuente','Cobertura','Periodicidad'];
  var validateHeaders = function(headers){
    if(headers.length < originalHeaders.length){
      return false;
    }
    for(var i = 0; i < headers; i++){
      if(headers[i] != originalHeaders[i]){
        return false;
      }
    }
    return true;
  };

  var getYears = function(headers){
    var years = [];
    for (var i = originalHeaders.length; i < headers.length; i++) {
      years = parseInt(headers[i]);
    };
    return years;
  };

  var dimension = {
    name: '',
    categories: []
  };
  var category = {
    name: '',
    indicators: []
  };
  var indicator = {
      name: '',
      description: '',
      measureType: '',
      source: '',
      coverage: '',
      period: '',
      data:[]
  };
  var data = {
    year: 0,
    value: 0
  };

  var parseRowData = function(rows, years){
    var dimensions = [];
    var crudeData = function(){
      return {
        dimension: '',
        category: '',
        indicator: '',
        description: '',
        measureType: '',
        source: '',
        coverage: '',
        period: ''
      };
    };
    for(var i = 1; i < rows.length; i++){
      var row = rows[i].split(';');
      var crude = crudeData();
      if(row.length < 8+years.length){
        continue;
      }
      crude.dimension = row[0].trim();
      crude.category = row[1].trim();
      crude.indicator = row[2].trim();
      crude.description = row[3].trim();
      crude.measureType = row[4].trim();
      crude.source = row[5].trim();
      crude.coverage = row[6].trim();
      crude.period = row[7].trim();

      for (var j = 0; j < years.length; j++) {
        crude[years[j]] = row[8+j];
      };
      dimensions.push(crude);
    };
    return dimensions;
  }

  fs.readFile(req.files.file.path, {encoding: 'utf8'}, function (err, data) {
    var rows = data.split('\r\n');
    var headers = rows[0].split(';');
    var validated = validateHeaders(headers);
    if(!validated){
      req.flash('error', 'las cabeceras del archivo no son correctas.');
    }
    var years = getYears(headers);

    var parsedData = parseRowData(rows, years);
    console.log(parsedData);
  });

  req.flash('info', 'Procesando el archivo.');
  res.redirect('/admin/upload/');
});

app.listen(3000);
console.log('Listening on port 3000');