var passport = require('passport');
exports.login = function(req, res){
  try{
    var usern = req.users.name;
    var session = true;
    res.render('index', {username: usern, session_on: session});
  }
  catch(err){
    var usern="No has iniciado sesion";
    var session = false;
    res.render('login', {username: usern, session_on: session});
  }
};
