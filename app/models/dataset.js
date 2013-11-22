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
  categories: Array,
  dataset: {type: Schema.ObjectId, ref: 'DatasetSchema'}
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


DimensionSchema.plugin(autoIncrement.plugin, { model: 'Dimension', field: 'dimensionId' });

exports.DimensionMongo = mongoose.model('Dimension', DimensionSchema);

exports.DatasetMongo = mongoose.model('Dataset', DatasetSchema);
exports.ValuesMongo = mongoose.model('Values', ValuesSchema);