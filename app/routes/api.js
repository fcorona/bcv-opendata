var dataset = require('../models/dataset'),
    MetricModel = require('../models/metric').MetricModel,
    METRIC_VIAS = require('../models/metric').METRIC_VIAS,
    subjective = require('../models/subjectiveData');

module.exports = function(app){
  app.get('/api/datasets', listDataset);
  app.get('/api/datasets/:name', readDataset);
  app.get('/api/dimensions/:dimension', readDatasetDimension);
  app.get('/api/categories/:category', readDatasetCategory);
  app.get('/api/datas/:indicator', readDatasetIndicator);
  app.get('/api/datasets/:name/:dimension/:category/:indicator/:year', notImplemented);
};


var validateKey = function(key){
  if(key==='not-valid-key'){
    return {
      valid: false,
      message: 'no es una llave valida'
    };
  }
  return {valid: true};
};

var parseKey = function(key, res){
  
  if(key === undefined){  
    res.json({message: 'No se ha enviado un <key> para validar la transacción.'});
    return;
  }
  var validatedKey = validateKey(key);
  if(!validatedKey.valid){
    res.json({message: validatedKey.message});
    return;
  }
  return true;
}

var getFullURL = function(req){
  return req.protocol + '://' + req.get('host');
}


var notImplemented = function(req, res, next){
  res.json({message: 'not implemented yet'});
};

var listDataset = function(req, res, next){
  if(!parseKey(req.query.key, res)) return;

  dataset.DatasetMongo.find({}, {'__v': 0, '_id': 0}, function (err, data){
    if(err){
      res.json(500, {message: 'Un error ha ocurrido'});
      return;
    }
    var jsonResponse = data;
    for(var i = 0; i < jsonResponse.length; i++){
      jsonResponse[i] = jsonResponse[i].toJSON();
      jsonResponse[i].href = getFullURL(req) + '/api/datasets/' + jsonResponse[i].name + '?key=' + req.query.key;
    }
    res.json(jsonResponse);
  });
}

var readDataset = function(req, res, next){
  if(!parseKey(req.query.key, res)) return;

  dataset.DatasetMongo.findOne({name: req.params.name}, {'__v': 0}, function (err, data){
    if(err){
      res.json(500, {message: 'Un error ha ocurrido'});
      return;
    }
    if(!data){
      res.json(404, {message: 'no existe el dataset '+ req.params.name});
      return;
    }
    dataset.DimensionMongo.find({dataset:data}, {'dimensionId':1, '_id': 0, 'name': 1}, {sort: {dimensionId: 1}}, function(err, dimensions){
      var jsonResponse = data.toJSON();
      for(var i = 0; i < dimensions.length; i++){
        dimensions[i] = dimensions[i].toJSON();
        dimensions[i].href = getFullURL(req) + '/api/dimensions/' + dimensions[i].dimensionId + '?key=' + req.query.key;
      }
      jsonResponse.dimensions = dimensions;
      delete jsonResponse['_id'];
      res.json(jsonResponse);
      return;
    });
  });

};

var readDatasetDimension = function(req, res, next){
  if(!parseKey(req.query.key, res)) return;

  dataset.DimensionMongo.findOne({dimensionId:req.params.dimension}, {'__v': 0}, function (err, dimension){
    if(err){
      console.log(err);
      res.json(500, {message: 'Un error ha ocurrido'});
      return;
    }
    if(!dimension){
      res.json(404, {message: 'no existe la dimensión '+ req.params.dimension});
      return;
    }

    dataset.CategoryMongo.find({dimension: dimension['_id']}, {'categoryId':1, '_id': 0, 'name': 1}, {sort: {categoryId: 1}}, function(err, categories){
      var jsonResponse = dimension.toJSON();
      for(var i = 0; i < categories.length; i++){
        categories[i] = categories[i].toJSON();
        categories[i].href = getFullURL(req) + '/api/categories/' + categories[i].categoryId + '?key=' + req.query.key;
      }
      jsonResponse.categories = categories;
      delete jsonResponse['_id'];
      res.json(jsonResponse);
      return;
    });
  });

};


var readDatasetCategory = function(req, res, next){
  if(!parseKey(req.query.key, res)) return;

  dataset.CategoryMongo.findOne({categoryId: req.params.category})
  .select({'__v': 0})
  .exec(function (err, category){
    if(err){
      console.log(err);
      res.json(500, {message: 'Un error ha ocurrido'});
      return;
    }
    if(!category){
      res.json(404, {message: 'no existe la categoria '+ req.params.category});
      return;
    }

    dataset.DimensionMongo.findById(category.dimension, function(err, dimension){
      if(err){
        console.log(err);
        res.json(500, {message: 'Un error ha ocurrido'});
        return;   
      }
      dataset.DataMongo.find({category: category}, {'_id': 1, 'name': 1}, {sort: {'_id':1}}, function(err, datas){
        var jsonResponse = category.toJSON();
        jsonResponse['dimensionId'] = dimension.dimensionId;
        delete jsonResponse['dimension'];
        for(var i = 0; i < datas.length; i++){
          datas[i] = datas[i].toJSON();
          datas[i].href = getFullURL(req) + '/api/datas/' + datas[i]['_id'] + '?key=' + req.query.key;
        }
        jsonResponse.datas = datas;
        delete jsonResponse['_id'];
        res.json(jsonResponse);
        return;
      });

    });

  });

};


var simpleValueStrategy = function(res, data, filter){
  var constraints = {year: 1, '_id': 0};
  constraints[data['_id']] = 1;

  dataset.ValuesMongo.find(filter, constraints, {sort: {year: 1}}, function(err, values){
    if(err){
      console.log(err);
      return;
    }
    var jsonResponse = data.toJSON();
    jsonResponse['dimensionId'] = jsonResponse.dimension.dimensionId;
    delete jsonResponse['dimension'];
    jsonResponse['categoryId'] = jsonResponse.category.categoryId;
    delete jsonResponse['category'];
    jsonResponse.datas = {};
    for (var i = 0; i < values.length; i++) {
      var value = values[i];
      jsonResponse.datas[value.year] = value.getValue(''+data['_id']);
    };
    res.json(jsonResponse);
    return;
  });
}

var multipleValueStrategy = function(res, data, filter){
  var name= data.name.toLowerCase();
  subjective.retrieveDataFrom(name, filter,
    function(err, results){
      if (err) console.log(err);
      var jsonResponse = data.toJSON();
      var datasByYear = {};
      for(var i=0; i<results.length; i++){
        var result = results[i];
        var valuesByYear = {};
        for(var j=0; j<result.values.length; j++){
          var values = result.values[j];
          if(!values.option || values.option===''){
            valuesByYear['empty'] = values.total + (valuesByYear['empty']||0);
          }
          if(values.option.indexOf('|')!=-1){
            var multipleValues = values.option.split('|');
            for(var k=0; k<multipleValues.length; k++){
              valuesByYear[multipleValues[k]] = values.total + (valuesByYear[multipleValues[k]]||0);
            }
          }else{
            valuesByYear[values.option] = values.total + (valuesByYear[values.option]||0);
          }
        }
        datasByYear[''+result['_id']] = valuesByYear;
      }
      jsonResponse.typeResponse = multipleValues ?'multiple':'simple';
      jsonResponse.datas = datasByYear;
      res.json(jsonResponse);
    }
  );
}


var readDatasetIndicator = function(req, res, next){
  if(!parseKey(req.query.key, res)) return;
  var id = req.params.indicator;
  var indexBy = !!parseInt(id)?'_id':'name';
  var query = {};
  query[indexBy] = id;
  dataset.DataMongo.findOne(query)
  .select({'__v': 0})
  .populate('dataset')
  .populate('category')
  .populate('dimension')
  .populate('optionValues')
  .exec(function (err, data){
    if(err){
      console.log(err);
      res.json(500, {message: 'Un error ha ocurrido'});
      return;
    }
    if(!data){
      res.json(404, {message: 'no existe la data '+ id});
      return;
    }
    //guarda el registro de la petición del dataset por api
    if(req.query.no_track!=='1'){
      MetricModel.saveMetric(METRIC_VIAS.json, null, data['_id']);
    }

    //read parameters
    var filter = {};
    var transformQueryParameters = function(params, name){
      var params = params.split(',');
      for (var i = 0; i < params.length; i++) {
        params[i] = params[i].trim();
      };
      if(params.length==1){
        filter[name] = params[0];
      }else{
        filter[name] = {$in:params};
      }
    };

    if(req.query.year){
      transformQueryParameters(req.query.year, 'year');
    }

    //determine the type of the dataset.
    if(data.dataset.type==1){
      simpleValueStrategy(res, data, filter);
    }else if(data.dataset.type==2){
      if(req.query.gender){
        var gender = req.query.gender.toLowerCase();
        gender = !!parseInt(gender)?gender:{'m':'1','f':'2'}[gender];
        filter['$or'] =[{gender:gender}, {gender:parseInt(gender)}]; 
      }
      if(req.query.nse){
        transformQueryParameters(req.query.nse, 'nse');
      }
      if(req.query.age){
        transformQueryParameters(req.query.age, 'age');
      }
      if(req.query.zone){
        transformQueryParameters(req.query.zone, 'zone');
      }
      
      multipleValueStrategy(res, data, filter);
    }

  });

};