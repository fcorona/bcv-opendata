var mongoose = require('mongoose');
var Schema = mongoose.Schema;
/*
* mongo connection
*/
mongoose.connect('mongodb://localhost/comovamos');

var DatasetSchema = new mongoose.Schema({
  name: {type: String, index: true},
  type: Number,
  dimensions: {type: [Schema.ObjectId], ref: 'DimensionSchema'}
});

//??
var DimensionSchema = new mongoose.Schema({
  name: String,
  categories: Array,
  id: Number
});

//??
var CategorySchema = new mongoose.Schema({
  name: String,
  indicators: Array
});

//??
//puede ser un indicador o una pregunta
var DataSchema = new mongoose.Schema({
  name: String,
  id: {type: Number, index: true}

});

var ValuesSchema = new mongoose.Schema({
  year: Number,
  dataset: {type: Schema.ObjectId, ref: 'DatasetSchema'},
  
  sector: Number,
  zona: Number,
  edad: Number,
  sexo: Number  
},
{
  strict: false
});

exports.DimensionMongo = mongoose.model('Dimension', DimensionSchema);

exports.DatasetMongo = mongoose.model('Dataset', DatasetSchema);
exports.ValuesMongo = mongoose.model('Values', ValuesSchema);