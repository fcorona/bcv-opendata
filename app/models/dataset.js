var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    autoIncrement = require('mongoose-auto-increment'),
    TagModel = require('./basics').TagModel;
/*
* mongo connection
*/
var connection = mongoose.connect('mongodb://localhost/comovamos');

autoIncrement.initialize(connection);

var DatasetSchema = new mongoose.Schema({
  name: {type: String, index: true, unique: true},
  title: String,
  description: String,
  type: Number,
  tags: [{type: Schema.ObjectId, ref: 'Tag'}]
});

// asocia los tags [String]
DatasetSchema.methods.addTags = function(tags){
  var dataset = this;
  for(var i = 0; i < tags.length; i++){
    var titleTag = tags[i];
    if(titleTag!=''){
      TagModel.findByName(titleTag, function(err, tag){
        if(err){
          console.log(err);
        }
        dataset.tags.push(tag);
        dataset.save();
      });
    }
  };
}

DatasetSchema.statics.listAll = function(name, tags, cb){
  var schema = this;
  for (var i = 0; i < tags.length; i++) {
    tags[i]
  }
  if(tags.length == 1 && tags[0] == ''){
    tags = [];
  }
  TagModel.find({title: {$in: tags}})
  .select('_id')
  .exec(function(err, foundTags){
    var query = schema.find();
    if(foundTags.length > 0){
      query = query.where({tags: {$in: foundTags}});
    }
    if(name && name!==''){
      query = query.or([{title: new RegExp(name, 'i')}, {description: new RegExp(name, 'i')}]);
    }
    query.populate('tags').exec(cb);
  });
}

DatasetSchema.virtual('stringTags').get(function(){
  var tags = '';
  for (var i = this.tags.length - 1; i >= 0; i--) {
    tags += this.tags[i].title + ', ';
  };
  return tags.substring(0, tags.length-2);
});


//??
var DimensionSchema = new mongoose.Schema({
  name: String,
  dataset: {type: Schema.ObjectId, ref: 'DatasetSchema'}
});

DimensionSchema.plugin(autoIncrement.plugin, { model: 'Dimension', field: 'dimensionId' });
DimensionMongo = mongoose.model('Dimension', DimensionSchema);

//??
var CategorySchema = new mongoose.Schema({
  name: String,
  dimension: {type: Schema.ObjectId, ref: 'DimensionSchema'},
  dataset: {type: Schema.ObjectId, ref: 'DatasetSchema'}
});

CategorySchema.plugin(autoIncrement.plugin, { model: 'Category', field: 'categoryId' });
CategoryMongo = mongoose.model('Category', CategorySchema);

//??
//puede ser un indicador o una pregunta
var DataSchema = new mongoose.Schema({
  name: String,
  description: String,
  measureType: String,
  source: String,
  coverage: String,
  period: String,
  category: {type: Schema.ObjectId, ref: 'Category'},
  dimension: {type: Schema.ObjectId, ref: 'Dimension'},
  dataset: {type: Schema.ObjectId, ref: 'Dataset'},
  totalValues: Number
});


DataSchema.statics.listAll = function(page, resultsPerPage, dimensions, name, cb){
  var schema = this;
  for (var i = 0; i < dimensions.length; i++) {
    dimensions[i] = dimensions[i].trim();
  }
  if(dimensions.length == 1 && dimensions[0] == ''){
    dimensions = [];
  }
  
  DimensionMongo.find({name: {$in: dimensions}})
  .select('_id')
  .exec(function(err, foundDimensions){
    queryTotal = schema.find();
    if(foundDimensions.length > 0){
      queryTotal = queryTotal.where({dimension: {$in: foundDimensions}});
    }
    if(name && name!==''){
      queryTotal = queryTotal.or([{name: new RegExp(name, 'i')}, {description: new RegExp(name, 'i')}]);
    }
    queryTotal.where({totalValues: { $gt: 0 }});
    
    queryTotal
    .count()
    .exec(function(err, total){
      var query = schema.find({});
      if(foundDimensions.length>0){
        query = query.where({dimension: {$in: foundDimensions}});
      }
      if(name && name!==''){
        query = query.or([{name: new RegExp(name, 'i')}, {description: new RegExp(name, 'i')}]);
      }
      query.where({totalValues: { $gt: 0 }});

      query.limit(resultsPerPage)
      .skip((page-1)*resultsPerPage)
      .sort('-totalValues')
      .exec(function(err, datas){
        cb(err, datas, total);
      });
    
    });
  
  });  
}

var ValuesSchema = new mongoose.Schema({
  year: {type: Number, index: true},
  dataset: {type: Schema.ObjectId, ref: 'DatasetSchema', index: true,},
  
  nse: {type: Number, index: true},
  zone: {type: Number, index: true},
  age: {type: Number, index: true},
  genre: {type: Number , index: true} 
},
{
  strict: false
});



DatasetSchema.virtual('href').get(function () {
  return 'loq puse';
});

exports.DatasetMongo = mongoose.model('Dataset', DatasetSchema);


exports.DimensionMongo = DimensionMongo;


exports.CategoryMongo = CategoryMongo;

DataSchema.plugin(autoIncrement.plugin, 'Data');
exports.DataMongo = mongoose.model('Data', DataSchema);



exports.ValuesMongo = mongoose.model('Values', ValuesSchema);