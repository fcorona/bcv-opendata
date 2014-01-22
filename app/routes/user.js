var UserModel = require('../models/user').User,
    utils = require('../util/validators');


module.exports = function(app){
  app.get('/user/:userId/validate', validateUser);
  app.get('/user', utils.validUser, viewUser);
  app.get('/user/edit', utils.validUser, editUser);
  app.get('/user/edit', utils.validUser, editUser);
  app.post('/user/edit', utils.validUser, updateUser);
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
    req.user.save(function(err, newUser){
      res.redirect('user');
    });

  });

}