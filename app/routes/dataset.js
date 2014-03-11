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
  var renderFormat = {'html': 'citizen/datasetHtml',
                      'table': 'datasetTable',
                      'list': 'dataset',
                      'graph': 'citizen/datasetGraph',
                      'csv': 'none'};
  var format = req.params.format || 'html';
  format = format in renderFormat ? format : 'html';

  if(format == 'html' || format == 'graph' || format === 'csv'){

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
      }else{
        res.render(renderFormat[format], {
          title: foundDataset.name,
          dataset: foundDataset
        });
      }
      return;
    });
    return;
  }

  dataset.DatasetMongo.findOne({name: req.params.name}, function (errDataset, foundDataset){
    foundDataset = foundDataset.toJSON();
    if(foundDataset.type==2){
      res.send(200, {message: 'not implemented yet.'});
      return;
    }
    dataset.DimensionMongo.find({dataset: foundDataset}, function (errDimension, dimensions){
      foundDataset.dimensions = [];
      for (var i = dimensions.length - 1; i >= 0; i--) {
        dimensions[i] = dimensions[i].toJSON();
        foundDataset.dimensions.push(dimensions[i]);
      };
      dataset.CategoryMongo.find({dataset: foundDataset}, function(errCategory, categories){
        var localCategories = {};
        for (var i = categories.length - 1; i >= 0; i--) {
          var localCategory = categories[i].toJSON();
          if(!(localCategory.dimension in localCategories)){
            localCategories[localCategory.dimension] = [];
          }
          localCategories[localCategory.dimension].push(localCategory);
          categories[i] = localCategory;
        };
        for (var i = dimensions.length - 1; i >= 0; i--) {
          dimensions[i].categories = localCategories[dimensions[i]['_id']];
        };

        dataset.DataMongo.find({dataset: foundDataset}, function(errDatas, datas){
          for (var i = datas.length - 1; i >= 0; i--) {
          var localDatas = {};
            var localData = datas[i].toJSON();
            localData.id = ''+localData['_id'];
            if(!(localData.category in localDatas)){
              localDatas[localData.category] = [];
            }
            localDatas[localData.category].push(localData);
            datas[i] = localData;
          };
          for (var i = categories.length - 1; i >= 0; i--) {
            categories[i].indicators = localDatas[categories[i]['_id']];
          };
          dataset.ValuesMongo.find({dataset: foundDataset}, function(errDatas, values){

            res.render(renderFormat[format], {title:'Informe Indicadores de Calidad de Vida', data: foundDataset, data2: values});
            return;
          });

        });
      });
    });
  });
}