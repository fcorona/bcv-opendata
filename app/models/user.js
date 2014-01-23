var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    AppAccess = require('./basics').AppAccessModel,
    bcrypt = require('bcrypt-nodejs');

var userSchema = new mongoose.Schema({
  name : String,
  email : String,
  password : String,
  role: {type: String, default: 'developer'},
  validated: {type: Boolean, default: false},
  verified: {type: Boolean, default: false},
  apps: [{type: Schema.ObjectId, ref: 'App'}],
  testKey: {type: Schema.ObjectId, ref: 'AppAccess'},
  requestedPassword: {type: Boolean, default: false}
});

//metodo para validar el password
userSchema.methods.validPassword = function(password){
  if(bcrypt.compareSync(password, this.password)){
    return true; 
  }else{
    return false;
  }
};

//genera una llave para el usuario 
userSchema.methods.generateKey = function(){
  var limit = this.validated ? 60 : 20;
  var key = this.testKey;
  if(!key){
    key = new AppAccess({
      limit: limit,
      allowAccess: ['*']
    });
  }
  key.generateKey();
  this.testKey = key;
  this.save();
};

exports.User = mongoose.model('User', userSchema);
