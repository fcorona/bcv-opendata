var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    AppAccess = require('./basics').AppAccessModel;

var AppSchema = new mongoose.Schema({
  name: String,
  shortDescription: String,
  description: String,
  url: String,
  key: {type: Schema.ObjectId, ref: 'AppAccess'},
  tags: [String],
  allowed: {type: Boolean, default: true},
  owner: {type: Schema.ObjectId, ref: 'User'},
  logoUrl: String
});

//genera una llave para el usuario 
AppSchema.methods.generateKey = function(verifiedUser){
  var limit = verifiedUser ? 2000 : 500;
  var key = this.key;
  if(!key){
    key = new AppAccess({
      limit: limit,
      allowAccess: ['*']
    });
  }
  key.generateKey();
  this.key = key;
  this.save();
};


exports.AppModel = mongoose.model('App', AppSchema);


