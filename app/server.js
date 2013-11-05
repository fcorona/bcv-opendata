var express = require('express'),
    path = require('path'),
    fs = require('fs'),
    flash = require('connect-flash'),
    Iconv = require('iconv').Iconv;

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
  console.log(req.files.file);
  var originalHeaders= ['Dimensión', 'Categoría','Indicador','Descripción','Unidad de Medida','Fuente','Cobertura','Periodicidad'];
  var validateHeaders = function(headers){
    if(headers.length < originalHeaders.length){
      return false;
    }
    for(var i = 0; i < originalHeaders.length; i++){
      console.log(headers[i], originalHeaders[i]);
      if(headers[i] != originalHeaders[i]){
        return false;
      }
    }
    return true;
  };

  var getYears = function(headers){
    var years = [];
    for (var i = originalHeaders.length; i < headers.length; i++) {
      years.push(parseInt(headers[i]));
    };
    return years;
  };

  var Dimension = function(){
    return {
      name: '',
      categories: []
    }
  };
  var Category = function(){
    return {
      name: '',
      indicators: []
    }
  };
  var Indicator = function(){
    return {
      name: '',
      description: '',
      measureType: '',
      source: '',
      coverage: '',
      period: '',
      datas:[]
    }
  };
  var Data = function(){
    return {
      year: 0,
      value: 0
    }
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
  };

  var processAlphaValue = function(value){
    if(value === 'N.D' || value === 'N.D.' || value === ''){
      return null;
    }
    return value;
  };

  //los valores nulos pueden ser N.D o N.D. o un espacio vacio
  var processNumericValue = function(value){
    var decimal = value.lastIndexOf('%');
    if(value === 'N.D' || value === 'N.D.' || value === ''){
      return null;
    }
    value = value.replace(/\./g,'').replace(',','.');
    if(decimal!=-1){
      value.replace('%','');
    }
    value = parseFloat(value);
    return decimal!=-1 ? value/100 : value;
  };
  var MEASURE_TYPES = {'Alfabético': processAlphaValue,
                       'Índice':processNumericValue,
                       'Numérico':processNumericValue,
                       'Numérico en Años':processNumericValue,
                       'Numérico en Kilómetros':processNumericValue,
                       'Numérico en Metros Cuadrados':processNumericValue,
                       'Numérico en Micras':processNumericValue,
                       'Numérico en Toneladas':processNumericValue,
                       'Porcentual':processNumericValue,
                       'Tasa':processNumericValue};

  /**
  * Recibe un arreglo de objetos con datos crudos cargados por el csv,
  */
  var processedData = function(){
    var inform = [];
    var categories = {};
    var dimensions = {};
    var getDimension = function(dimension){
      if(dimension in dimensions){
        return dimensions[dimension];
      }
      myDimension = Dimension()
      myDimension.name = dimension;
      
      inform.push(myDimension);
      dimensions[dimension] = myDimension;
      return myDimension;
    };

    var getCategory = function(dimension, category){
      var myDimension = getDimension(dimension);
      if(category in categories){
        return categories[category];
      }
      var myCategory = Category()
      myCategory.name = category;
      myDimension.categories.push(myCategory);
      categories[category] = myCategory;
      return myCategory;
    };

    function pushIndicator(dimension, category, indicator){
      var myCategory = getCategory(dimension, category);
      myCategory.indicators.push(indicator);

    };
    return {
      inform: inform,
      pushIndicator: pushIndicator
    }
  };

  var transformData = function(parsedData, years){
    var myProcessedData = processedData();
    for(var i=0; i<parsedData.length; i++){
      var crudeData = parsedData[i];
      var processFunction = MEASURE_TYPES[crudeData.measureType];
      var processedIndicator = Indicator();
      processedIndicator.name = crudeData.indicator;
      processedIndicator.description = crudeData.description;
      processedIndicator.source = crudeData.source;
      processedIndicator.coverage = crudeData.coverage;
      processedIndicator.period = crudeData.period;

      for(var j=0; j<years.length; j++){
        var year = years[j];
        var processedValue = Data();
        processedValue.year = year;
        processedValue.value = processFunction(crudeData[year]);
        processedIndicator.datas.push(processedValue);
      }
      myProcessedData.pushIndicator(crudeData.dimension,
                                    crudeData.category,
                                    processedIndicator);
    };
    return myProcessedData.inform;
  };

  /**
  * procesa el archivo
  */
  fs.readFile(req.files.file.path, function (err, data) {
    // node no soporta encoding iso-8859-1
    var iconv = new Iconv('ISO-8859-1', 'UTF-8');
    var buffer = iconv.convert(data);

    var rows = buffer.toString('utf8').split('\r\n');
    var headers = rows[0].split(';');
    var validated = validateHeaders(headers);
    if(!validated){
      req.flash('error', 'las cabeceras del archivo no son correctas.');
      return;
    }
    var years = getYears(headers);
    var parsedData = parseRowData(rows, years);
    
    var transformedData = transformData(parsedData, years);
    transformedData.forEach(function(dimension){
      console.log(dimension.name);
      dimension.categories.forEach(function(category){
        console.log('\t'+category.name);
        category.indicators.forEach(function(indicator){
          console.log('\t\t'+indicator.name);
          process.stdout.write('\t\t');
          indicator.datas.forEach(function(data){
            process.stdout.write(data.year+": "+data.value+" ");
          });
          console.log('');
        });
      });
    });
  });

  req.flash('info', 'Procesando el archivo.');
  res.redirect('/admin/upload/');
});

app.listen(3000);
console.log('Listening on port 3000');