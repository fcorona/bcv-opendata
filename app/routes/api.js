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


exports.notImplemented = function(req, res, next){
  res.json({message: 'not implemented yet'});
};

exports.readDataset = function(req, res, next){
  if(!parseKey(req.query.key, res)) return;

  if(!req.params.name === 'iicv'){
    res.json({message: 'no existe el dataset '+ req.params.name});
    return;
  }
  dataset.DimensionMongo.find({}, function (err, data){
    if(err){
      res.json({message: 'Un error ha ocurrido'});
      return;
    }
    res.json({title:'Informe Indicadores de Calidad de Vida', dimensions: data});
  });

};

exports.readDatasetDimension = function(req, res, next){
  if(!parseKey(req.query.key, res)) return;

  if(!req.params.name === 'iicv'){
    res.json({message: 'no existe el dataset '+ req.params.name});
    return;
  }
  dataset.DimensionMongo.findOne({name:req.params.dimension}, function (err, data){
    if(err){
      res.json({message: 'Un error ha ocurrido'});
      return;
    }
    if(!data.length){
      res.json({message: 'no existe la dimensión '+ req.params.dimension});
      return;
    }
    res.json({dataset:'Informe Indicadores de Calidad de Vida', dimension: req.params.dimension, categories: data.categories});
  });

};


exports.readDatasetCategory = function(req, res, next){
  if(!parseKey(req.query.key, res)) return;

  if(!req.params.name === 'iicv'){
    res.json({message: 'no existe el dataset '+ req.params.name});
    return;
  }

  dataset.DimensionMongo.findOne({name:req.params.dimension, 
                               categories:{'$elemMatch':{name:req.params.category}}},
                              {categories:{'$elemMatch':{name:req.params.category}}},
                              function (err, data){
    if(err){
      res.json({message: 'Un error ha ocurrido'});
      return;
    }
    if(!data){
      res.json({message: 'no existe la categoria '+ req.params.category});
      return;
    }
    res.json({dataset:'Informe Indicadores de Calidad de Vida', dimension: req.params.dimension, category: req.params.category, indicators: data.categories[0].indicators});
  });

};

exports.readDatasetIndicator = function(req, res, next){
  if(!parseKey(req.query.key, res)) return;

  if(!req.params.name === 'iicv'){
    res.json({message: 'no existe el dataset '+ req.params.name});
    return;
  }
  dataset.DimensionMongo.findOne({name:req.params.dimension, 
                               categories:{'$elemMatch':{name:req.params.category}}},
                              {categories:{'$elemMatch':{name:req.params.category}}},
                              function (err, data){
    if(err){
      res.json({message: 'Un error ha ocurrido'});
      return;
    }
    var indicators = data.categories[0].indicators;
    for(var i = 0; i< indicators.length; i++){
      var indicator = indicators[i];
      if(indicator.name === req.params.indicator){
        indicator.dataset = 'Informe Indicadores de Calidad de Vida';
        indicator.dimension = req.params.dimension;
        indicator.category = req.params.category;
        res.json(indicator);
        return;
      }
    }
    res.json({message: 'no existe el indicador '+ req.params.indicator});
  });

};