var mongoose = require('mongoose'),
    schema = require('../models/user'),
    model_user = schema.User,
    bcrypt = require('bcrypt-nodejs');

//se guarda el usuario
function save_user(req){
    //se encripta el password
    bcrypt.hash(req.body.pass, null, null,function(err,hash){
        if (err) throw console.log('error de encriptacion');
        var user = new model_user({ 
            name:req.body.name,
            email:req.body.email,
            password : hash
        });
        user.save();
    });
}
//se guarda el registro del usuario
exports.registro = function(req,res){
    if(req.body.pass==req.body.repass){
        save_user(req);
        res.render('register', {msg:'Usuario registrado'});
    }else{
        res.render('register', {notpass:true});
        }
}; 
//se hace la solicitud del formulario de registro
exports.formulario = function(req,res){
    res.render('register',{msg:''});
    };
