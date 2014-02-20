var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    basics = require('./basics'),
    AppAccessModel = basics.AppAccessModel,
    TagModel = basics.TagModel;

var AppSchema = new Schema({
  name: String,
  shortDescription: String,
  description: String,
  url: String,
  key: {type: Schema.ObjectId, ref: 'AppAccess'},
  tags: [{type: Schema.ObjectId, ref: 'Tag'}],
  allowed: {type: Boolean, default: true},
  owner: {type: Schema.ObjectId, ref: 'User'},
  logoUrl: String,
  score: {type: Number, default: 0},
  totalVotes: {type: Number, default: 0}
});

var ReportAppSchema = new Schema({
  from: String,
  date: {type: Date, default: Date.now},
  reason: String,
  app: {type: Schema.ObjectId, ref: 'App'},
  open: {type: Boolean, default: true}
});

//genera una llave para el usuario 
AppSchema.methods.generateKey = function(verifiedUser){
  var limit = verifiedUser ? 2000 : 500;
  var key = this.key;
  if(!key){
    key = new AppAccessModel({
      limit: limit,
      allowAccess: ['*']
    });
  }
  key.generateKey();
  this.key = key;
  this.save();
};

// asocia los tags [String]
AppSchema.methods.addTags = function(tags){
  var app = this;
  for(var i = 0; i < tags.length; i++){
    var titleTag = tags[i];
    if(titleTag!=''){
      TagModel.findByName(titleTag, function(err, tag){
        if(err){
          console.log(err);
        }
        app.tags.push(tag);
        app.save();
      });
    }
  };
}

AppSchema.methods.updateInfo = function(model, cb){
  this.name = model.name;
  this.shortDescription = model.shortDescription;
  this.description = model.description;
  this.url = model.url;
  this.logoUrl = model.logoUrl;
  this.addTags(model.tags);
  this.save(cb);
}

AppSchema.statics.listAll = function(page, resultsPerPage, tags, name, cb){
  var schema = this;
  
  for (var i = 0; i < tags.length; i++) {
    tags[i] = tags[i].trim().toLowerCase();
  }
  if(tags.length == 1 && tags[0] == ''){
    tags = [];
  }
  
  TagModel.find({title: {$in: tags}})
  .select('_id')
  .exec(function(err, foundTags){
    queryTotal = schema.find();
    if(foundTags.length > 0){
      queryTotal = queryTotal.where({tags: {$in: foundTags}});
    }
    if(name && name!==''){
      queryTotal = queryTotal.or([{name: new RegExp(name, 'i')}, {description: new RegExp(name, 'i')}]);
    }
    
    queryTotal
    .count()
    .exec(function(err, total){
      var query = schema.find({
        allowed: true
      });
      if(foundTags.length>0){
        query = query.where({tags: {$in: foundTags}});
      }
      if(name && name!==''){
        query = query.or([{name: new RegExp(name, 'i')}, {description: new RegExp(name, 'i')}]);
      }

      query.limit(resultsPerPage)
      .skip((page-1)*resultsPerPage)
      .sort('-score')
      .populate('owner')  
      .populate('tags')
      .exec(function(err, apps){
        cb(err, apps, total);
      });
    
    });
  
  });
};

AppSchema.virtual('stringTags').get(function(){
  var tags = '';
  for (var i = this.tags.length - 1; i >= 0; i--) {
    tags += this.tags[i].title + ', ';
  };
  return tags.substring(0, tags.length-2);
});

var ReportAppModel = mongoose.model('ReportApp', ReportAppSchema);

AppSchema.methods.reportByUsers = function(cb){
  console.log('app id', this.id);
  ReportAppModel.find({app: this.id}, cb);
};

exports.AppModel = mongoose.model('App', AppSchema);
exports.ReportAppModel = ReportAppModel;


