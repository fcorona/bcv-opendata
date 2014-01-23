var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var AppAccessSchema = new mongoose.Schema({
  key: {type: String, unique: true},
  limit: Number,
  allowAccess: [String]
});

AppAccessSchema.methods.generateKey = function(){
  this.key = require('generate-key').generateKey(50);
  this.save();
}

// dev sin validar: 20,
// dev validado, no app,
// dev ok, app: 500
// dev ok, app ok: 2000

var TagSchema = new mongoose.Schema({
  title: {type: String, unique: true},
  description: String
});

exports.AppAccessModel = mongoose.model('AppAccess', AppAccessSchema);
exports.TagModel = mongoose.model('Tag', TagSchema);