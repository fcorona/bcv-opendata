var flash = require('connect-flash'),
    dataset = require('../models/dataset');


exports.showDataset = function(req, res, next){
  var renderFormat = {'html': 'datasetHtml',
                      'table': 'datasetTable',
                      'list': 'dataset',
                      'graph': 'datasetGraph'};
  var format = req.params.format || 'html';
  format = format in renderFormat ? format : 'html';

  if(format == 'html' || format == 'graph'){

    dataset.DatasetMongo.findOne({name: req.params.name}, function (err, foundDataset){
      if(err){
        res.send(500, err);
        return;
      }
      if(!foundDataset){
        res.render(404, '404');
        return;
      }

      res.render(renderFormat[format], {dataset: foundDataset});
      return;
    });
    return;
  }

  dataset.DatasetMongo.findOne({name: req.params.name}, function (errDataset, foundDataset){
    foundDataset = foundDataset.toJSON();
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
          var localDatas = {};
          for (var i = datas.length - 1; i >= 0; i--) {
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