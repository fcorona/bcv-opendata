var flash = require('connect-flash'),
    dataset = require('../models/dataset');


exports.showDataset = function(req, res, next){
  var renderFormat = {'table': 'datasetTable',
                      'list': 'dataset'};
  var format = req.params.format || 'table';
  format = format in renderFormat ? format : 'table';
  if(req.params.name === 'iicv'){
    dataset.DimensionMongo.find({}, function (err, data){
      res.render(renderFormat[format], {title:'Informe Indicadores de Calidad de Vida', data: data});
      return;
    });
  }else{
    res.send('bad request');
  }
};