var validUser = function(req, res, next){
  if(!req.isAuthenticated()){
    res.redirect('/');
    return;
  }
  next();
};

var validateEmail = function(email){ 
  var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
};

module.exports.validateEmail = validateEmail;
module.exports.validUser = validUser;