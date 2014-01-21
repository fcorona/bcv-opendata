var mongoose = require('mongoose'),
    schema = require('../models/user'),
    model_user = schema.User,
    bcrypt = require('bcrypt-nodejs'),
    mailSender = require('../util/mailSender');

//se busca si existe el usuario
var registrar = function (req, res){
  if(req.body.pass == req.body.repass){
    new model_user({ 
      name: req.body.name,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.pass)
    }).save(function(err, user){
      mailSender.sendMail(user, 'ACTIVE_ACCOUNT');
      res.render('register', {msg: 'Su usuario ha sido registrado con éxito'});
    });
  }else{
    res.render('register', {notpass: true});
  }
};

//se guarda el registro del usuario
exports.registro = function(req, res){
  model_user.findOne({email: req.body.email}, function(err, userx){
    if(err){
      console.log(err)
    };
    if(!userx){
      return registrar(req,res)
    };
    res.render('register', {msg: 'Este usuario ya esta registrado', register: true});
  });
}; 

//se hace la solicitud del formulario de registro
exports.formulario = function(req,res){
  res.render('register',{msg:''});
};
