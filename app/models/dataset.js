var mongoose = require('mongoose');
/*
* mongo connection
*/
mongoose.connect('mongodb://localhost/comovamos');
var DimensionSchema = new mongoose.Schema({
  name: String,
  categories: Array
});

exports.DimensionMongo = mongoose.model('Dimension', DimensionSchema);