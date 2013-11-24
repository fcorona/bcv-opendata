var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    autoIncrement = require('mongoose-auto-increment');
/*
* mongo connection
*/
var connection = mongoose.connect('mongodb://localhost/comovamos');

autoIncrement.initialize(connection);

var DatasetSchema = new mongoose.Schema({
  name: {type: String, index: true},
  type: Number
});

//??
var DimensionSchema = new mongoose.Schema({
  name: String,
  dataset: {type: Schema.ObjectId, ref: 'DatasetSchema'}
});

//??
var CategorySchema = new mongoose.Schema({
  name: String,
  dimension: {type: Schema.ObjectId, ref: 'DimensionSchema'},
  dataset: {type: Schema.ObjectId, ref: 'DatasetSchema'}
});

//??
//puede ser un indicador o una pregunta
var DataSchema = new mongoose.Schema({
  name: String,
  description: String,
  measureType: String,
  source: String,
  coverage: String,
  period: String,
  category: {type: Schema.ObjectId, ref: 'CategorySchema'},
  dimension: {type: Schema.ObjectId, ref: 'DimensionSchema'},
  dataset: {type: Schema.ObjectId, ref: 'DatasetSchema'}
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


exports.DatasetMongo = mongoose.model('Dataset', DatasetSchema);

DimensionSchema.plugin(autoIncrement.plugin, { model: 'Dimension', field: 'dimensionId' });
exports.DimensionMongo = mongoose.model('Dimension', DimensionSchema);

CategorySchema.plugin(autoIncrement.plugin, { model: 'Category', field: 'categoryId' });
exports.CategoryMongo = mongoose.model('Category', CategorySchema);

DataSchema.plugin(autoIncrement.plugin, 'Data');
exports.DataMongo = mongoose.model('Data', DataSchema);



exports.ValuesMongo = mongoose.model('Values', ValuesSchema);