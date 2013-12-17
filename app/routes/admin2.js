var fs = require('fs'),
    flash = require('connect-flash'),
    Iconv = require('iconv').Iconv,
    dataset = require('../models/dataset');

exports.uploadFileForm = function(req, res){
  res.render('upload2', {title:'Plataforma de openData', messages: req.flash()});
};

exports.uploadFile = function(req, res, next){
  if(req.files.dictionary.headers['content-type']!=='text/csv'){
    req.flash('error', req.files.dictionary.name +' no es un archivo valido, por favor suba un archivo CSV.')
    res.redirect('/admin/upload2/');
    return;
  }
  if(req.files.file.headers['content-type']!=='text/csv'){
    req.flash('error', req.files.file.name +' no es un archivo valido, por favor suba un archivo CSV.')
    res.redirect('/admin/upload2/');
    return;
  }

  var datasetDB = new dataset.DatasetMongo({name: 'epc', type: 2});
  datasetDB.save(function(err, instance){
    
    fs.readFile(req.files.file.path, function(err, data){
      processFile(err, data, transformData, instance);
    });

    fs.readFile(req.files.dictionary.path,  function(err, data){
      processFile(err, data, transformDictionary, instance);
    });

  });


  req.flash('info', 'Procesando el archivo.');
  res.redirect('/admin/upload2/');
};

var AGES = {
  'De 18 a 25 años': 1,
  'De 26 a 35 años': 2,
  'De 36 a 45 años': 3,
  'De 46 a 55 años': 4,
  'Más de 55 años': 5,
  'DE 18 A 25 ANOS': 1,
  'DE 26 A 35 ANOS': 2,
  'DE 36 A 45 ANOS': 3,
  'DE 46 A 55 ANOS': 4,
  'MAS DE 55 ANOS': 5,
  'MAS DE 56 ANOS': 5
}
var GENRES = {
  'HOMBRES': 1,
  'MUJERES': 2
}
var ZONES = {
  'CENTRO': 1,
  'CHAPINERO': 2,
  'NORTE': 3,
  'OCCIDENTAL': 4,
  'SUR-OCCIDENTAL': 5,
  'SUR-ORIENTAL': 6
}

var NIVEL_SOCIO_ECONOMICO = {
  'Estrato1': 1,
  'ESTRATO 1': 1,
  'Estrato2': 2,
  'ESTRATO 2': 2,
  'Estrato3': 3,
  'ESTRATO 3': 3,
  'Estrato4': 4,
  'ESTRATO 4': 4,
  'Estrato5': 5,
  'ESTRATO 5': 5,
  'Estrato6': 6,
  'ESTRATO 6': 6
}


var transformData = function(rows, headers, datasetDB){

  var crudeData = function(){
    return {
      year: '',
      nse: '',
      zone: '',
      age: '',
      genre: ''
    };
  };
  
  var i = 1;

  var processData = function(index){
    var row = rows[index].split(';');
    var crude = crudeData();
    crude.year = row[8].trim();
    crude.nse = row[9].trim();
    crude.nse = parseInt(crude.nse) ? crude.nse : NIVEL_SOCIO_ECONOMICO[crude.nse];
    crude.age = row[11].trim();
    crude.age = parseInt(crude.age) ? crude.age : AGES[crude.age];
    crude.genre = row[12].trim();
    crude.genre = parseInt(crude.genre) ? crude.genre : GENRES[crude.genre];
    crude.zone = row[15].trim();
    crude.zone = parseInt(crude.zone) ? crude.zone : ZONES[crude.zone];
    for (var j = 0; j < row.length; j++) {
      if(j == 8 || j == 9 || j == 11 || j == 12 || j == 15) continue;
      crude[headers[j]] = row[j];
    };
    crude.dataset = datasetDB;
    return crude;
  }

  var lot = {size: 10, current: 1, upTo: function(max){
    var nextValue = this.size + this.current;
    return nextValue > max ? max : nextValue; 
  }};

  var saveData = function(datas){
    dataset.ValuesMongo.create(datas, function(err){
      if(err){
        console.log(err);
        return;
      }
      createLot(lot.current, lot.upTo(rows.length-1));
    });
  }


  var createLot = function(start, end){
    var datas = [];
    for(i = start; i < end; i++) {
      datas.push(processData(i));
    };
    lot.current = i;
    if(datas.length > 0){
      saveData(datas);
    }
  }
  createLot(lot.current, lot.upTo(rows.length - 1));
  
};

var transformDictionary = function(rows, headers, datasetDB){
  for (var i = 1; i < rows.length; i++) {
    var row = rows[i].split(';');
    new dataset.DataMongo({name: row[2], description: row[1], dataset: datasetDB}).save();
  };
};

var processFile = function (err, data, transformFunction, datasetDB) {
  // node no soporta encoding iso-8859-1
  var iconv = new Iconv('ISO-8859-1', 'UTF-8');
  var buffer = iconv.convert(data);
  var rows = buffer.toString('utf8').split('\r\n');
  var headers = rows[0].split(';');
  transformFunction(rows, headers, datasetDB);
};
