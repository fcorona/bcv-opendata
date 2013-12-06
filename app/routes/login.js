var passport = require('passport');
exports.login = function(req, res){
    try{
        console.log("-------");
        var usern = req.users.name;
        console.log("-------");
        var session = true;
        console.log('user: '+usern);
        res.render('index', { username:usern, session_on:session });
    }
    catch(err){
        var usern="No has iniciado sesion";
        var session = false;
        console.log("no iniciado");
        res.render('login', { username:usern, session_on:session });
    }
};
