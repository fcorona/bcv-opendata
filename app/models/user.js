var mongoose = require('mongoose'),
Schema = mongoose.Schema,
bcrypt = require('bcrypt-nodejs');

var userSchema = new mongoose.Schema({
  name : String,
  email : String,
  password : String,
  role: {type: String, default: 'developer'},
  validated: {type: Boolean, default: false},
  verified: {type: Boolean, default: false},
  apps: [{type: Schema.ObjectId, ref: 'App'}],
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

exports.User = mongoose.model('User', userSchema);
