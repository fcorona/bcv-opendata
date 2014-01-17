var fs = require('fs'),
    flash = require('connect-flash'),
    Iconv = require('iconv').Iconv,
    dataset = require('../models/dataset'),
    apps = require('../models/apps'),
    UserModel = require('../models/user').User;

var validAdmin = function(req, res, next){
  if(!req.isAuthenticated()){
    res.redirect('/');
    return;
  }
  if(req.user.role != 'admin'){
    res.status(401);
    res.render('unauthorized');
    return;
  }
  next();
};

module.exports = function(app){
  app.get('/admin/', validAdmin, home);
  app.get('/admin/datasets/', validAdmin, listDatasets);
  app.get('/admin/datasets/:datasetId', validAdmin, viewDataset);
  app.get('/admin/datasets/:datasetId/edit', validAdmin, editDataset);
  app.post('/admin/datasets/:datasetId/edit', validAdmin, updateDataset);
  app.get('/admin/datasets/:dataset/metrics', validAdmin, metrics);

  app.get('/admin/apps/', validAdmin, listApps);
  app.get('/admin/apps/:appId', validAdmin, viewApp);
  app.post('/admin/apps/:appId', validAdmin, updateApp);

  app.get('/admin/devs/', validAdmin, listDevelopers);
  app.get('/admin/devs/:devId', validAdmin, viewDeveloper);
  app.post('/admin/devs/:devId', validAdmin, updateDeveloper);

  app.get('/admin/upload/', validAdmin, uploadFileForm);
  app.post('/admin/upload/', validAdmin, uploadFile);
};


//inicio para admin
home = function(req, res){
  res.render('admin/home', {
    title:'Plataforma de openData',
    messages: req.flash(),
    menu: {home: 'active'}
  });
};

//lista todos los datasets
listDatasets = function(req, res){
  dataset.DatasetMongo.find({}, function(err, datasets){
    if(err){
      res.send(500, err);
      return;
    }
    res.render('admin/datasets', {
      datasets: datasets,
      menu: {datasets: 'active'}
    });
  });
};

//ver dataset
viewDataset = function(req, res){
  res.send(200, {'message': 'not implemented yet.'});
};

//edit Dataset
editDataset = function(req, res){
  res.send(200, {'message': 'not implemented yet.'});
};

//update Dataset
updateDataset = function(req, res){
  res.send(200, {'message': 'not implemented yet.'});
};

//lista las metricas para un dataset
metrics = function(req, res){
  res.send(200, {'message': 'not implemented yet, ' + req.params.dataset});
};


//lista todas las apps registradas
listApps = function(req, res){
  apps.AppModel.find({})
  .populate('owner')
  .exec(function(err, applications){
    if(err){
      res.send(500, err);
      return;
    }
    res.render('admin/apps', {
      apps: applications,
      menu: {apps: 'active'}
    });
  });
};

//ver app
viewApp = function(req, res){
  res.send(200, {'message': 'not implemented yet. ' + req.params.appId});
};

//bloquear/desbloquear app
updateApp = function(req, res){
  res.send(200, {'message': 'not implemented yet.'});
};

//lista los desarrolladores
listDevelopers = function(req, res){
  UserModel.find({}, function(err, devs){
    if(err){
      res.send(500, err);
      return;
    }
    res.render('admin/devs', {
      devs: devs,
      menu: {devs: 'active'}
    });
  });
};

//ver desarrollador
viewDeveloper = function(req, res){
  res.send(200, {'message': 'not implemented yet. ' + req.params.devId});
};

//validar/desvalidar desarrollador
updateDeveloper = function(req, res){
  res.send(200, {'message': 'not implemented yet.'});
};

uploadFileForm = function(req, res){
  res.render('upload', {title:'Plataforma de openData', messages: req.flash()});
};

uploadFile = function(req, res, next){
  if(req.files.file.headers['content-type']!=='text/csv'){
    req.flash('error', req.files.file.name +' no es un archivo valido, por favor suba un archivo CSV.')
    res.redirect('/admin/upload/');
    return;
  }

  fs.readFile(req.files.file.path, processFile);

  req.flash('info', 'Procesando el archivo.');
  res.redirect('/admin/upload/');
};

var originalHeaders= ['Dimensión', 'Categoría','Indicador','Descripción','Unidad de Medida','Fuente','Cobertura','Periodicidad'];
var validateHeaders = function(headers){
  if(headers.length < originalHeaders.length){
    return false;
  }
  for(var i = 0; i < originalHeaders.length; i++){
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
    datas: {}
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

var nonValueValues = ['N.D', 'N.D.', 'N.A', 'por confirmar', 'ND', ''];
var processAlphaValue = function(value){
  if(nonValueValues.lastIndexOf(value)!=-1){
    return null;
  }
  return value;
};

//los valores nulos pueden ser N.D o N.D. o un espacio vacio
var processNumericValue = function(value){
  var decimal = value.lastIndexOf('%');
  if(nonValueValues.lastIndexOf(value)!=-1){
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
                     'Índice': processNumericValue,
                     'Numérico': processNumericValue,
                     'Numérico en Años': processNumericValue,
                     'Numérico en Kilómetros': processNumericValue,
                     'Numérico en Metros Cuadrados': processNumericValue,
                     'Numérico en Micras': processNumericValue,
                     'Numérico en Toneladas': processNumericValue,
                     'Porcentual': processNumericValue,
                     'Tasa': processNumericValue};

/**
* Recibe un arreglo de objetos con datos crudos cargados por el csv,
*/
var processedData = function(){
  var categories = {};
  var dimensions = {};

  var getDimension = function(datasetId, dimension){
    if(dimension in dimensions){
      return dimensions[dimension];
    }
    myDimension = Dimension()
    myDimension.name = dimension;

    //mongo creation 
    var dimensionDb = new dataset.DimensionMongo(myDimension);
    dimensionDb.dataset = datasetId;
    dimensionDb.save();

    dimensions[dimension] = dimensionDb;


    return dimensionDb;
  };

  var getCategory = function(datasetId, dimension, category){
    var myDimension = getDimension(datasetId, dimension);
    if(category in categories){
      return categories[category];
    }
    var myCategory = Category()
    myCategory.name = category;

    //mongo creation
    var categoryDb = new dataset.CategoryMongo(myCategory);
    categoryDb.dataset = datasetId;
    categoryDb.dimension = myDimension['_id'];
    categoryDb.save();
    
    //myDimension.categories.push(myCategory);
    categories[category] = categoryDb;
    return categoryDb;
  };

  function pushIndicator(datasetId, dimension, category, indicator, crudeData, processFunction, callback){
    var myCategory = getCategory(datasetId, dimension, category);

    var indicatorDb = new dataset.DataMongo(indicator);
    indicatorDb.category = myCategory['_id'];
    indicatorDb.dimension = myCategory.dimension;
    indicatorDb.dataset = myCategory.dataset;
    indicatorDb.save(function(err, instance){
      callback(instance, crudeData, processFunction);
    });

    return indicatorDb;
  };

  return {
    pushIndicator: pushIndicator
  }
};

var transformData = function(parsedData, years){
  var myProcessedData = processedData();
  dataset.DimensionMongo.remove(function (err, dimension) {
    if (err) return handleError(err);
  });

  var docYears = [];
  var datasetDB = new dataset.DatasetMongo(
    {name: 'iicv', type: 1, dimensions: []});
  datasetDB.save();
  var remainingIndicators = parsedData.length;

  for(var i = 0; i<years.length; i++){
    var docYear = {year: years[i]};
    docYears.push(docYear);
  };

  var persistYear = function(){
    for(var i = 0; i<docYears.length; i++){
      var docYear = docYears[i];
      docYear.dataset = datasetDB;
      (new dataset.ValuesMongo(docYear)).save();
    };
  };



  for(var i=0; i<parsedData.length; i++){
    var crudeData = parsedData[i];
    var processFunction = MEASURE_TYPES[crudeData.measureType];
    var processedIndicator = Indicator();
    processedIndicator.name = crudeData.indicator;
    processedIndicator.description = crudeData.description;
    processedIndicator.measureType = crudeData.measureType;
    processedIndicator.source = crudeData.source;
    processedIndicator.coverage = crudeData.coverage;
    processedIndicator.period = crudeData.period;

    myProcessedData.pushIndicator(datasetDB['_id'], crudeData.dimension,
      crudeData.category,
      processedIndicator,
      crudeData,
      processFunction,
      function(instance, crudeYears, processFunction){
        for(var j=0; j<years.length; j++){
          var year = years[j];
          var docYear = docYears[j];
          docYear[instance['_id']] = processFunction(crudeYears[year].trim());
        }
        if(--remainingIndicators==0){
          persistYear();
        }; 
      });

    
  };

  
};

var processFile = function (err, data) {
  // node no soporta encoding iso-8859-1
  var iconv = new Iconv('ISO-8859-1', 'UTF-8');
  var buffer = iconv.convert(data);

  var rows = buffer.toString('utf8').split('\r\n');
  var headers = rows[0].split(';');
  var validated = validateHeaders(headers);
  if(!validated){
    //req.flash('error', 'las cabeceras del archivo no son correctas.');
    return;
  }
  var years = getYears(headers);
  var parsedData = parseRowData(rows, years);
  
  transformData(parsedData, years);
};

exports.validateHeaders = validateHeaders;