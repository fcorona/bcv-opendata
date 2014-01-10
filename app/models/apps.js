var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    UserModel = require('./user').UserModel;

var connection = mongoose.connect('mongodb://localhost/comovamos');

var AppSchema = new mongoose.Schema({
  name: String,
  description: String,
  access: {type: Schema.ObjectId, ref: 'AppAccess'}, 
  owner: {type: Schema.ObjectId, ref: 'User'} 
});


var AppAccessSchema = new mongoose.Schema({
  key: {type: String, unique: true},
  limit: Number,
  allowAccess: [String]

});

exports.AppAccessMongo = mongoose.model('AppAccess', AppAccessSchema);
exports.AppMongo = mongoose.model('App', AppSchema);

