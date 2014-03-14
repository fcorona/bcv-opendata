var flash = require('connect-flash'),
    dataset = require('../models/dataset'),
    MetricModel = require('../models/metric').MetricModel,
    METRIC_VIAS = require('../models/metric').METRIC_VIAS,
    Iconv = require('iconv').Iconv,
    csv = require('csv');

var exportCSV = function(foundDataset, res){
  var headers = ['Dimensión', 'Categoría','Indicador','Descripción','Unidad de Medida','Fuente','Cobertura','Periodicidad'];
  var content = [];
  content.push(foundDataset.dimension.name);
  content.push(foundDataset.category.name);
  content.push(foundDataset.name);
  content.push(foundDataset.description);
  content.push(foundDataset.measureType);
  content.push(foundDataset.source);
  content.push(foundDataset.coverage);
  content.push(foundDataset.period);
  var filter = {year:1};
  var id = foundDataset['_id'];
  filter[''+id]=1;
  dataset.ValuesMongo.find({
    dataset: foundDataset.dataset
  },
  filter,
  {
    sort: {year: 1}
  },
  function(err, values){
    if(err){
      res.send(500, err);
      return;
    }
    for (var i = 0; i < values.length; i++) {
      var value = values[i];
      headers.push(value.year);
      content.push(value.getValue(''+id));
    };
    
    res.set('Content-Type', 'text/csv');
    res.set('Content-Disposition', 'attachment; filename='+foundDataset.name+'.csv');
    var iconv = new Iconv('UTF-8', 'ISO-8859-1');
    var result = [];
    csv()
    .from([headers, content], { delimiter: ';'})
    .on('data', function(data) {
      result.push(data);
    })
    .on('end', function() {
      var buffer = iconv.convert(result.join(''));
      res.send(buffer);
    });
  });
}

exports.showDataset = function(req, res, next){
  var format = req.params.format || 'html';
  format = format ==='html' || format==='csv' ? format : 'html';
  dataset.DataMongo.findOne({name: req.params.name})
  .populate('dataset')
  .populate('dimension')
  .populate('category')
  .exec(function (err, foundDataset){
    if(err){
      res.send(500, err);
      return;
    }
    if(!foundDataset){
      res.render(404, '404');
      return;
    }
    MetricModel.saveMetric(METRIC_VIAS[format], null, foundDataset['_id']);
    if(format==='csv'){
      exportCSV(foundDataset, res);
      return;
    }
    if(foundDataset.dataset.type==1){
      res.render('citizen/datasetHtml', {
        title: foundDataset.name,
        dataset: foundDataset
      });
    }else{
      res.send('not implemented yet');
    }
    return;
  });

}