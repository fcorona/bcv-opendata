var fs = require('fs'),
    flash = require('connect-flash'),
    Iconv = require('iconv').Iconv,
    dataset = require('../models/dataset');

exports.uploadFileForm = function(req, res){
  res.render('upload', {title:'Plataforma de openData', messages: req.flash()});
};

exports.uploadFile = function(req, res, next){
  if(req.files.file.headers['content-type']!=='text/csv'){
    req.flash('error', req.files.file.name +' no es un archivo valido, por favor suba un archivo CSV.')
    res.redirect('/admin/upload/');
    return;
  }

  fs.readFile(req.files.file.path, processFile);

  req.flash('info', 'Procesando el archivo.');
  res.redirect('/admin/upload/');
};

var transformData = function(rows, headers){
  var datasetDB = new dataset.DatasetMongo({name: 'epc', type: 2});
  datasetDB.save();
  var crudeData = function(){
    return {
      year: '',
      nse: '',
      zone: '',
      age: '',
      genre: ''
    };
  };
  var remainingColumns = rows.length;
  var tail = [];
  var i = 1;
  var processData = function(index){

    var row = rows[index].split(';');
    var crude = crudeData();
    crude.year = row[8].trim();
    crude.nse = row[9].trim();
    crude.age = row[11].trim();
    crude.genre = row[12].trim();
    crude.zone = row[15].trim();
    for (var j = 0; j < row.length; j++) {
      if(j == 8 || j == 9 || j == 11 || j == 12 || j == 15) continue;
      crude[headers[j]] = row[j];
    };
    crude.dataset = datasetDB;
    return crude;
  }
  var saveData = function(crude){
    if(!crude){
      console.log('procesando fila ' + i, remainingColumns);
      return;
    }
      
    return (new dataset.ValuesMongo(crude)).save(function(err, instance){
      if(i >= remainingColumns-2)
        return;
      i++;
      return tail.push(processData(i));
    });
  }

  tail.push(processData(i));

  (function worker(){
    saveData(tail.pop());
    if(i<remainingColumns-2)
      setTimeout(worker, 5);
  })();


  
};


var processFile = function (err, data) {
  console.log('voy a cargar epc');
  // node no soporta encoding iso-8859-1
  var iconv = new Iconv('ISO-8859-1', 'UTF-8');
  console.log('voy a transformalo en utf8');
  var buffer = iconv.convert(data);
  console.log('voy a partirlo');
  var rows = buffer.toString('utf8').split('\r\n');
  console.log('voy a sacar los headers');
  var headers = rows[0].split(';');
  console.log('voy a salvarlo');
  transformData(rows, headers);
};
