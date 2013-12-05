var mongoose = require('mongoose'),
    bcrypt = require('bcrypt-nodejs');

var userSchema = new mongoose.Schema({
    name : String,
    email : String,
    password : String,
});
//metodo para validar el password
userSchema.methods.validPassword = function (password) {
    if (password === this.password) {
        return true; 
        } else {
            return false;
        }
}
exports.User = mongoose.model('User', userSchema);
