var flash = require('connect-flash'),
    dataset = require('../models/dataset');


exports.showDataset = function(req, res, next){
  var renderFormat = {'table': 'datasetTable',
                      'list': 'dataset',
                      'graph': 'datasetGraph'};
  var format = req.params.format || 'table';
  format = format in renderFormat ? format : 'table';
  
  if(req.params.name === 'iicv'){
    dataset.DimensionMongo.find({}, function (err, data){
      dataset.ValuesMongo.find({}, function(err2, data2){
        res.render(renderFormat[format], {title:'Informe Indicadores de Calidad de Vida', data: data, data2: data2});
        return;
      })

    });
  }else{
    res.send('bad request');
  }
};