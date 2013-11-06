var dataset = require('../models/dataset');

exports.notImplemented = function(req, res, next){
  res.json({message: 'not implemented yet'});
};

exports.readDataset = function(req, res, next){
  if(req.params.name === 'iicv'){
    dataset.DimensionMongo.find({}, function (err, data){
      res.json({title:'Informe Indicadores de Calidad de Vida', data: data});
    });
  }else{
    res.json({message: 'no existe el dataset '+ req.params.name});
  }
};