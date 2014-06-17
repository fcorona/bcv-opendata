var flash = require('connect-flash'),
    dataset = require('../models/dataset'),
    MetricModel = require('../models/metric').MetricModel,
    METRIC_VIAS = require('../models/metric').METRIC_VIAS,
    subjective = require('../models/subjectiveData'),
    Iconv = require('iconv').Iconv,
    csv = require('csv');

var exportCSV = function(foundDataset, res){
  var headers = ['Dimensión', 'Categoría','Indicador','Descripción','Unidad de Medida','Fuente','Cobertura','Periodicidad'];
  var content = [];
  content.push(foundDataset.dimension ? foundDataset.dimension.name : '');
  content.push(foundDataset.category ? foundDataset.category.name : '');
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


var exportCSVSubjective = function(foundDataset, res){
  var headers = ['Dimensión', 'Categoría','Indicador','Descripción', 'Año'];
  var content = [];
  content.push(foundDataset.dimension ? foundDataset.dimension.name : '');
  content.push(foundDataset.category ? foundDataset.category.name : '');
  content.push(foundDataset.name);
  content.push(foundDataset.description);
  for (var i = 0; i < foundDataset.optionValues.length; i++) {
    headers.push(foundDataset.optionValues[i].description);
  }

  var name= foundDataset.name.toLowerCase();
  subjective.retrieveDataFrom(name, {},function (err, results){
      if (err) console.log(err);
      
      var datasByYear = {};
      for(var i=0; i<results.length; i++){
        var result = results[i];
        var valuesByYear = {};
        for(var j=0; j<result.values.length; j++){
          var values = result.values[j];
          if(!values.option || values.option===''){
            valuesByYear['empty'] = values.total + (valuesByYear['empty']||0);
          }
          if(values.option.indexOf('|')!=-1){
            var multipleValues = values.option.split('|');
            for(var k=0; k<multipleValues.length; k++){
              valuesByYear[multipleValues[k]] = values.total + (valuesByYear[multipleValues[k]]||0);
            }
          }else{
            valuesByYear[values.option] = values.total + (valuesByYear[values.option]||0);
          }
        }
        datasByYear[''+result['_id']] = valuesByYear;
      }
      var rows = [headers];
      
      for (var i in datasByYear){
          var r_data = [i];
          for (var ov = 0; ov < foundDataset.optionValues.length; ov++) {
              r_data.push(datasByYear[i][foundDataset.optionValues[ov].option]);
          }
          rows.push(content.concat(r_data));
          
      }
      
      res.set('Content-Type', 'text/csv');
      res.set('Content-Disposition', 'attachment; filename='+foundDataset.name+'.csv');
      var iconv = new Iconv('UTF-8', 'ISO-8859-1');
      var result = [];
      csv()
      .from(rows, { delimiter: ';'})
      .on('data', function(data) {
          result.push(data);
      })
      .on('end', function() {
          var buffer = iconv.convert(result.join(''));
          res.send(buffer);
      });
      

  });

    

};


var exportAllCSV = function(res){

  dataset.DatasetMongo.findOne({'name':'iicv'}, function(err, datasetFound){
    dataset.DataMongo.find({'dataset': datasetFound}, {}, {sort:{'dimension':1,'category':1}})
      .populate('dataset')
      .populate('dimension')
      .populate('category')
      .populate('optionValues')
      .exec(function (err, foundDatas){
        var headers = ['ID', 'Dimensión', 'Categoría','Indicador','Descripción','Unidad de Medida','Fuente','Cobertura','Periodicidad'];
        for(var i=1998; i<2015;i++){
          headers.push(''+i);
        }

        dataset.ValuesMongo.find({dataset: datasetFound},{},{sort:{year: 1}},
        function(err, values){
          if(err){
            res.send(500, err);
            return;
          }

          var content = [];
          var theCSV = [];
          theCSV.push(headers);
          for(var j=0; j<foundDatas.length; j++){
            var content = [];
            var foundData = foundDatas[j];
            var id = foundData['_id'];
            content.push(id);
            content.push(foundData.dimension.name);
            content.push(foundData.category.name);
            content.push(foundData.name);
            content.push(foundData.description);
            content.push(foundData.measureType);
            content.push(foundData.source);
            content.push(foundData.coverage);
            content.push(foundData.period);
            
            
            for(var i = 0; i < values.length; i++){
              var value = values[i];
              content.push(value.getValue(''+id));
            };
            theCSV.push(content);
          }
          
          res.set('Content-Type', 'text/csv');
          res.set('Content-Disposition', 'attachment; filename=iicv.csv');
          var iconv = new Iconv('UTF-8', 'ISO-8859-1');
          var result = [];
          csv()
          .from(theCSV, { delimiter: ';', rowDelimiter:'\r'})
          .on('data', function(data) {
            result.push(data);
          })
          .on('end', function() {
            var buffer = iconv.convert(result.join(''));
            res.send(buffer);
          });
        });
      });
  });


}

exports.exportIICV = function(req, res, next){
  exportAllCSV(res);
  return;
}

exports.showDataset = function(req, res, next){
  var format = req.params.format || 'html';
  format = format ==='html' || format==='csv' ? format : 'html';
  dataset.DataMongo.findOne({'_id': req.params.datasetId})
  .populate('dataset')
  .populate('dimension')
  .populate('category')
  .populate('optionValues')
  .exec(function (err, foundData){
    if(err){
      console.log('dataset:65', err);
      res.render(404, '404');
      return;
    }
    if(!foundData){
      return;
    }
    MetricModel.saveMetric(METRIC_VIAS[format], null, foundData['_id']);
    if(format==='csv'){
      if(foundData.dataset.type==1){        
        exportCSV(foundData, res);
        return;
      }else{
        exportCSVSubjective(foundData, res);
          return;
      }
    }
        
    if(foundData.dataset.type==1){
      res.render('citizen/datasetHtml', {
        title: foundData.name,
        dataset: foundData
      });
    }else{
      res.render('citizen/datasetHtmlSubjective', {
        title: foundData.name,
        dataset: foundData
      });
    }
    return;
  });

}
