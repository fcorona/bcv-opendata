var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    basics = require('./basics'),
    AppAccessModel = basics.AppAccessModel,
    TagModel = basics.TagModel;

var AppSchema = new mongoose.Schema({
  name: String,
  shortDescription: String,
  description: String,
  url: String,
  key: {type: Schema.ObjectId, ref: 'AppAccess'},
  tags: [{type: Schema.ObjectId, ref: 'Tag'}],
  allowed: {type: Boolean, default: true},
  owner: {type: Schema.ObjectId, ref: 'User'},
  logoUrl: String
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

AppSchema.virtual('stringTags').get(function(){
  var tags = '';
  for (var i = this.tags.length - 1; i >= 0; i--) {
    tags += this.tags[i].title + ', ';
  };
  return tags.substring(0, tags.length-2);
});

exports.AppModel = mongoose.model('App', AppSchema);


