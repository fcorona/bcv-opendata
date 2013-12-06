var mongoose = require('mongoose'),
    schema = require('../models/user'),
    model_user = schema.User,
    bcrypt = require('bcrypt-nodejs');
//se busca si existe el usuario
//se guarda el registro del usuario
exports.registro = function(req,res){
    if(req.body.pass==req.body.repass){
        var user = new model_user({ 
            name:req.body.name,
            email:req.body.email,
            password : bcrypt.hashSync(req.body.pass)
        });
        user.save();
        res.render('register', {msg:'Usuario registrado'});
    }else{
        res.render('register', {notpass:true});
        }
}; 
//se hace la solicitud del formulario de registro
exports.formulario = function(req,res){
    res.render('register',{msg:''});
    };
