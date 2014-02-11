var fs = require('fs'),
    flash = require('connect-flash'),
    Iconv = require('iconv').Iconv,
    DatasetModel = require('../models/dataset').DatasetMongo,
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
  app.get('/admin', validAdmin, home);
  app.get('/admin/datasets', validAdmin, listDatasets);
  app.get('/admin/datasets/:datasetId', validAdmin, viewDataset);
  app.get('/admin/datasets/:datasetId/edit', validAdmin, editDataset);
  app.post('/admin/datasets/:datasetId/edit', validAdmin, updateDataset);
  app.get('/admin/datasets/:dataset/metrics', validAdmin, metrics);

  app.get('/admin/apps', validAdmin, listApps);
  app.get('/admin/apps/:appId', validAdmin, viewApp);
  app.post('/admin/apps/:appId/toggleBlock', validAdmin, toggleBlockApp);

  app.get('/admin/devs', validAdmin, listDevelopers);
  app.get('/admin/devs/:devId', validAdmin, viewDeveloper);
  app.post('/admin/devs/:devId/toggleVerify', validAdmin, toggleVerifyDeveloper);

  app.get('/admin/upload', validAdmin, uploadFileForm);
  app.post('/admin/upload', validAdmin, uploadFile);
};

var MENU_STATES = {
  HOME: {home: 'active'},
  DATASETS: {datasets: 'active'},
  DEVS: {devs: 'active'},
  APPS: {apps: 'active'},
}

//inicio para admin
var home = function(req, res){
  apps.ReportAppModel.find()
  .populate('app')
  .exec(function(err, reports){
    res.render('admin/home', {
      title:'Plataforma de openData',
      messages: req.flash(),
      reports: reports,
      menu: MENU_STATES.HOME
    });
  })
};

//lista todos los datasets
var listDatasets = function(req, res){
  DatasetModel.find({}, function(err, datasets){
    if(err){
      res.send(500, err);
      return;
    }
    res.render('admin/datasets', {
      datasets: datasets,
      menu: MENU_STATES.DATASETS
    });
  });
};

//ver dataset
var viewDataset = function(req, res){
  DatasetModel.findById(req.params.datasetId)
  .populate('tags')
  .exec(function(err, dataset){
    if(err){
      res.send(500, err);
      return;
    }
    if(!dataset){
      res.render(404, '404');
      return;
    }
    res.render('admin/viewDataset', {
      dataset: dataset,
      menu: MENU_STATES.DATASETS
    });
  });
};

//edit Dataset
var editDataset = function(req, res){
  DatasetModel.findById(req.params.datasetId)
  .populate('tags')
  .exec(function(err, dataset){
    if(err){
      res.send(500, err);
      return;
    }
    if(!dataset){
      res.render(404, '404');
      return;
    }
    res.render('admin/editDataset', {
      dataset: dataset,
      errors: {},
      menu: MENU_STATES.DATASETS
    });
  });
};

//update Dataset
var updateDataset = function(req, res){
  var model = {},
      errors = {};

  model.title = req.body.title || '';
  if(model.title.length < 4 || model.title.length > 60){
    errors.title = 'El título debe tener entre 5 y 60 caracteres';
  };

  model.name = req.body.name || '';
  if(model.name.length < 3 || model.name.length > 20 || model.name.indexOf(' ') != -1){
    errors.name = 'El código no debe tener espacios y debe tener desde 3 hasta 20 caracteres';
  };

  model.description = req.body.description || '';
  if(model.description.length < 10){
    errors.description = 'La descripción debe debe tener 10 caracteres como mínimo';
  };

  model.stringTags = req.body.stringTags;

  if(Object.keys(errors).length > 0){
    model.type = req.body.type;
    model.id = req.params.datasetId;
    res.render('admin/editDataset', {
      dataset: model,
      errors: errors,
      menu: MENU_STATES.DATASETS
    });
    return;
  }

  DatasetModel.findById(req.params.datasetId, function(err, dataset){
    if(err){
      res.send(500, err);
      return;
    }
    
    dataset.title = model.title;
    dataset.name = model.name;
    dataset.description = model.description;
    var tags = (model.stringTags || '').split(',');
    if(tags[0]!='' || tags.length>1){
      dataset.addTags(tags);
    }
    dataset.save(function(err, dataset){
      res.redirect('/admin/datasets/' + dataset.id);
    });
  });

};

//lista las metricas para un dataset
var metrics = function(req, res){
  res.send(200, {'message': 'not implemented yet, ' + req.params.dataset});
};


//lista todas las apps registradas
var listApps = function(req, res){
  apps.AppModel.find({})
  .populate('owner')
  .exec(function(err, applications){
    if(err){
      res.send(500, err);
      return;
    }
    res.render('admin/apps', {
      apps: applications,
      menu: MENU_STATES.APPS
    });
  });
};

//ver dataset
var viewApp = function(req, res){
  apps.AppModel.findById(req.params.appId)
  .populate('owner')
  .populate('tags')
  .exec(function(err, app){
    if(err){
      res.send(500, err);
      return;
    }
    if(!app){
      res.render(404, '404');
      return;
    }
    app.reportByUsers(function(err2, reports){
      console.log(err2);
      console.log(reports);
      res.render('admin/viewApp', {
        app: app,
        reports: reports,
        menu: MENU_STATES.APPS
      });
    });
  });
};
//bloquear/desbloquear app
var toggleBlockApp = function(req, res){
  apps.AppModel.findById(req.params.appId, function(err, app){
    app.allowed = !app.allowed;
    app.save(function(err, app){
      if(err){
        res.send(500, err);
        return;
      }
      if(req.xhr){
        res.send({message: 'ok'});
      }else{
        res.redirect('/admin/apps/');
      }
    });
  });
};

//lista los desarrolladores
var listDevelopers = function(req, res){
  UserModel.find({}, function(err, devs){
    if(err){
      res.send(500, err);
      return;
    }
    res.render('admin/devs', {
      devs: devs,
      menu: MENU_STATES.DEVS
    });
  });
};

//ver un dev
var viewDeveloper = function(req, res){
  UserModel.findById(req.params.devId)
  .populate('apps')
  .exec(function(err, dev){
    if(err){
      res.send(500, err);
      return;
    }
    if(!dev){
      res.render(404, '404');
      return;
    }
    res.render('admin/viewDeveloper', {
      dev: dev,
      menu: MENU_STATES.DEVS
    });
  });
};

//validar/desvalidar desarrollador
var toggleVerifyDeveloper = function(req, res){
  UserModel.findById(req.params.devId, function(err, dev){
    dev.verified = !dev.verified;
    dev.save(function(err, dev){
      if(err){
        res.send(500, err);
        return;
      }
      if(req.xhr){
        res.send({message: 'ok'});
      }else{
        res.redirect('/admin/devs/');
      }
    });
  });
};


var uploadFileForm = function(req, res){
  res.render('upload', {title:'Plataforma de openData', messages: req.flash()});
};

var uploadFile = function(req, res, next){
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
  var datasetDB = new DatasetModel(
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