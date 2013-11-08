var dataset = require('../models/dataset');

var validateKey = function(key, req){
  if(key==='not-valid-key'){
    return {
      valid: false,
      message: 'no es una llava valida'
    };
  }
  return {
    valid: true
  }
};

exports.notImplemented = function(req, res, next){
  res.json({message: 'not implemented yet'});
};

exports.readDataset = function(req, res, next){
  var key = req.query.key;
  if(key === undefined){
    res.json({message: 'No se ha enviado un <key> para validar la transacción.'});
    return;
  }
  var validatedKey = validateKey(key, req);
  if(!validatedKey.valid){
    res.json({message: validatedKey.message});
    return
  }
  if(req.params.name === 'iicv'){
    dataset.DimensionMongo.find({}, function (err, data){
      if(err){
        res.json({message: 'Un error ha ocurrido'});
        return;
      }
      res.json({title:'Informe Indicadores de Calidad de Vida', data: data});
    });
  }else{
    res.json({message: 'no existe el dataset '+ req.params.name});
  }
};