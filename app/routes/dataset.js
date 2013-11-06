var flash = require('connect-flash'),
    dataset = require('../models/dataset');


exports.showDataset = function(req, res, next){
  if(req.params.name === 'iicv'){
    dataset.DimensionMongo.find({}, function (err, data){
      res.render('dataset', {title:'Informe Indicadores de Calidad de Vida', data: data});
      return;
    });
  }else{
    res.send('bad request');
  }
};