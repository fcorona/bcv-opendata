var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    UserModel = require('./user').UserModel;

var AppSchema = new mongoose.Schema({
  name: String,
  shortDescription: String,
  description: String,
  url: String,
  access: {type: Schema.ObjectId, ref: 'AppAccess'},
  tags: [String],
  allowed: {type: Boolean, default: true},
  owner: {type: Schema.ObjectId, ref: 'User'},
  logoUrl: String
});


var AppAccessSchema = new mongoose.Schema({
  key: {type: String, unique: true},
  limit: Number,
  allowAccess: [String]
});

var TagSchema = new mongoose.Schema({
  title: {type: String, unique: true},
  description: String
});

exports.AppAccessModel = mongoose.model('AppAccess', AppAccessSchema);
exports.AppModel = mongoose.model('App', AppSchema);
exports.TagModel = mongoose.model('Tag', TagSchema);

