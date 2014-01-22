var UserModel = require('../models/user').User,
    utils = require('../util/validators'),
    bcrypt = require('bcrypt-nodejs');


module.exports = function(app){
  app.get('/user/:userId/validate', validateUser);
  app.get('/user', utils.validUser, viewUser);
  app.get('/user/edit', utils.validUser, editUser);
  app.post('/user/edit', utils.validUser, updateUser);
  app.get('/user/password', utils.validUser, editPassword);
  app.post('/user/password', utils.validUser, updatePassword);
}

var validateUser = function(req, res, next){
  UserModel.findOne({'_id': req.params.userId, validated: false})
  .exec(function(err, user){
    if(err){
      console.log(err);
      res.send(500, err);
      return;
    }
    if(!user){
      res.render(404, '404');
      return;
    }
    user.validated = true;
    user.save();
    res.render('user/validated', {user: user});
  });
};

var viewUser = function(req, res, next){
  res.render('user/view');
}

var editUser = function(req, res, next){
  res.render('user/edit', {currentUser: req.user, errors: {}});
}

var updateUser = function(req, res, next){
  var model = {},
      errors = {};

  model.name = req.body.name || '';
  if(model.name.length < 4 || model.name.length > 50){
    errors.name = 'El nombre debe tener entre 5 y 50 caracteres';
  };

  model.email = req.body.email || '';
  if(model.email.length < 3 || !utils.validateEmail(model.email)){
    errors.email = 'El correo electrónico que escribio no es válido';
  };

  if(Object.keys(errors).length > 0){
    res.render('user/edit', {currentUser: model, errors: errors});
    return;
  }
  UserModel.find({email: model.email, '_id': {$ne: req.user.id}}, function(err, users){
    if(err){
      console.log(err);
      res.send(500, err);
      return;
    }
    if(users.length>0){
      errors.email = 'este correo electrónico ya esta en uso por otro usuario';
      res.render('user/edit', {currentUser: model, errors: errors});
      return;
    }
    req.user.name = model.name;
    req.user.email = model.email;
    req.user.save(function(err){
      res.redirect('user');
    });

  });
}

var editPassword = function(req, res, next){
  res.render('user/password', {errors: {}});
}

var updatePassword = function(req, res, next){
  var errors = {};
  var oldPass = req.body.oldPass || '';
  var newPass = req.body.newPass || '';
  var rePass = req.body.rePass || '';

  if(newPass.length < 3 || newPass.length > 50){
    errors.newPass = 'La contraseña debe contener entre 3 y 50 caracteres';
  }
  if(rePass.length < 3 || rePass.length > 50){
    errors.rePass = 'La contraseña debe contener entre 3 y 50 caracteres';
  }
  if(rePass != newPass){
    errors.newPass = 'Las contraseñas no coinciden';
    errors.rePass = '';
  }

  if(!bcrypt.compareSync(oldPass, req.user.password)){
    errors.oldPass = 'la contraseña no es válida';
  }

  if(Object.keys(errors).length > 0){
    res.render('user/password', {errors: errors});
    return;
  } 

  req.user.password = bcrypt.hashSync(newPass);
  req.user.save(function(err){
    res.redirect('/user');
  });

}