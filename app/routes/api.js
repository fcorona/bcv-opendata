var dataset = require('../models/dataset');

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
  return req.protocol + "://" + req.get('host');
}


exports.notImplemented = function(req, res, next){
  res.json({message: 'not implemented yet'});
};

exports.listDataset = function(req, res, next){
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

exports.readDataset = function(req, res, next){
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

exports.readDatasetDimension = function(req, res, next){
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


exports.readDatasetCategory = function(req, res, next){
  if(!parseKey(req.query.key, res)) return;

  dataset.CategoryMongo.findOne({categoryId: req.params.category}, {'__v': 0}, function (err, category){
    if(err){
      console.log(err);
      res.json(500, {message: 'Un error ha ocurrido'});
      return;
    }
    if(!category){
      res.json(404, {message: 'no existe la categoria '+ req.params.category});
      return;
    }

    dataset.DataMongo.find({category: category}, {'_id': 1, 'name': 1}, {sort: {'_id':1}}, function(err, datas){
      var jsonResponse = category.toJSON();
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

};


var simpleValueStrategy = function(res, data){
  var constraints = {year: 1, '_id': 0};
  constraints[data['_id']] = 1;

  dataset.ValuesMongo.find({dataset: data.dataset}, constraints, {sort: {year: 1}}, function(err, values){
    if(err){
      console.log(err);
      return;
    }
    var jsonResponse = data.toJSON();
    jsonResponse.datas = {};
    for (var i = 0; i < values.length; i++) {
      var value = values[i];
      jsonResponse.datas[value.year] = value.getValue(''+data['_id']);
    };
    res.json(jsonResponse);
    return;
  });
}

var multipleValueStrategy = function(res, data){
  //var constraints = {year: 1, '_id': 0, 'name': 1};
  var o = {};
  o.query = {};
  //o.scope = {name: name};
  //o.scope[data.name] = 1;
  var name= data.name.toLowerCase();
  o.map = function () { emit(this.year, this.year); };
  o.reduce = function (k, vals) {
    // var total=0;
    // for (var i = 0; i < vals.length; i++) {
    //   total+=vals[i];
    // };
    // return total;

    return vals.length;
  };

  var project =  {year:1};
  project[name] = 1;
  name = '$'+name;
  dataset.ValuesMongo.aggregate({
    $project: project,
    },
    {$group: {
      '_id': {varValue:name, year:'$year'},
      total: {$sum: 1}
    }},
    function(err, results){
      if (err) console.log(err);
      res.json({results:results});
    }
  );
/*
  dataset.ValuesMongo.find({dataset: data.dataset}, constraints, {sort: {year: 1}}, function(err, values){
    if(err){
      console.log(err);
      return;
    }
    var jsonResponse = data.toJSON();
    jsonResponse.datas = {};
    for (var i = 0; i < values.length; i++) {
      var value = values[i];
      jsonResponse.datas[value.year] = value.getValue(''+data['_id']);
    };
    res.json(jsonResponse);
    return;
  });
*/
}


exports.readDatasetIndicator = function(req, res, next){
  if(!parseKey(req.query.key, res)) return;

  dataset.DataMongo.findOne({'_id':req.params.indicator}, {'__v': 0}, function (err, data){
    if(err){
      console.log(err);
      res.json(500, {message: 'Un error ha ocurrido'});
      return;
    }
    if(!data){
      res.json(404, {message: 'no existe la data '+ req.params.indicator});
      return;
    }

    dataset.DatasetMongo.findOne({'_id':data.dataset}, function(err, datasetDB){

      //determine the type of the dataset.
      if(datasetDB.type==1){
        simpleValueStrategy(res, data);
      }else if(datasetDB.type==2){
        multipleValueStrategy(res, data);
      }
    });

  });

};