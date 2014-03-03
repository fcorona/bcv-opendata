var apps = require('../models/apps'),
    validUser = require('../util/validators').validUser;


module.exports = function(app){
  app.get('/dev/apps', validUser, listApps);
  app.get('/dev/apps/create', validUser, devValidated, formApp);
  app.post('/dev/apps/create', validUser, devValidated, createApp);
  app.get('/dev/apps/:id', validUser, viewApp);
  app.get('/dev/apps/:id/edit', validUser, devValidated, editApp);
  app.post('/dev/apps/:id/edit', validUser, devValidated, updateApp);
  app.get('/dev/apps/:id/generateKey', validUser, generateKey);
}

var devValidated = function(req, res, next){
  if(!req.user.validated){
    res.render('dev/noValidatedUser');
    return;
  }
  next();
};

var listApps = function(req, res){
  apps.AppModel.find({owner: req.user.id}, function(err, applications){
    if(err){
      res.send(500, err);
      return;
    }
    res.render('dev/apps', {apps: applications});
  });
};

var viewApp = function(req, res){
  apps.AppModel.findOne({'_id': req.params.id, owner: req.user.id})
  .populate('key')
  .populate('tags')
  .exec(function(err, app){
    if(err){
      res.send(500, err);
      return;
    }
    if(!app){
      res.send(404, 'app no encontrada');
      return; 
    }
    res.render('dev/view-app', {app: app});
  });
};

var editApp = function(req, res){
  apps.AppModel.findOne({'_id': req.params.id, owner: req.user.id})
  .populate('tags')
  .exec(function(err, app){
    if(err){
      res.send(500, err);
      return;
    }
    if(!app){
      res.send(404, 'app no encontrada');
      return;
    }

    res.render('dev/edit-app', {model: app, errors: {}});
  });
};

var updateApp = function(req, res){
  var model = {},
     errors = {};

  //validar campos:
  model.name = req.body.name || '';
  if(model.name.length < 4 || model.name.length > 40){
    errors.name = 'El nombre debe tener entre 5 y 40 caracteres';
  };

  model.shortDescription = req.body.shortDescription || '';
  if(model.shortDescription.length < 3 || model.shortDescription.length > 140){
    errors.shortDescription = 'La decripci&oacute;n corta debe tener entre 3 y 140 caracteres';
  };

  model.description = req.body.description || '';
  if(model.description.length < 3 || model.description.length > 800){
    errors.description = 'La decripci&oacute;n debe tener entre 3 y 800 caracteres';
  };

  model.stringTags = req.body.stringTags;

  model.url = req.body.url;
  model.logoUrl = req.body.logoUrl;
  //tags pendientes por ahora

  model.owner = req.user;
  if(Object.keys(errors).length > 0){
    model.id = req.params.id;
    res.render('dev/create-app', {model: model, errors: errors});
    return;
  }

  apps.AppModel.findOne({'_id': req.params.id, owner: req.user.id})
  .exec(function(err, app){
    var tags = (model.stringTags || '').split(',');
    if(tags[0]!='' || tags.length>1){
      model.tags = tags;
    }
    app.updateInfo(model, function(err2){
      if(err2){
        res.send(500, err2);
        return;
      }
      res.redirect('dev/apps/' + app.id);
    });
  });
};

var formApp = function(req, res){
  var model = {name: '', description: '', url: '', logoUrl: ''};
  res.render('dev/create-app', {model: model, errors: {}});
};

var createApp = function(req, res){
  var model = {},
     errors = {};

  //validar campos:
  model.name = req.body.name || '';
  if(model.name.length < 4 || model.name.length > 40){
    errors.name = 'El nombre debe tener entre 5 y 40 caracteres';
  };
  
  model.shortDescription = req.body.shortDescription || '';
  if(model.shortDescription.length < 3 || model.shortDescription.length > 140){
    errors.shortDescription = 'La descrip&oacute;n corta debe tener entre 3 y 140 caracteres';
  };

  model.description = req.body.description || '';
  if(model.description.length < 3 || model.description.length > 800){
    errors.description = 'La descripci&oacute;n debe tener entre 3 y 800 caracteres';
  };

  model.url = req.body.url;
  model.logoUrl = req.body.logoUrl;
  model.stringTags = req.body.stringTags;

  model.owner = req.user;
  if(Object.keys(errors).length > 0){
    res.render('dev/create-app', {model: model, errors: errors});
    return;
  }

  new apps.AppModel(model)
  .save(function(err, app){
    if(err){
      res.send(500, err);
      return;
    }
    var tags = (model.stringTags || '').split(',');
    if(tags[0]!='' || tags.length>1){
      model.tags = tags;
    }
    app.addTags(tags);
    req.user.apps.push(app);
    req.user.save();
    res.redirect('dev/apps/' + app.id);
  });
};


var generateKey = function(req, res){
  apps.AppModel.findOne({'_id': req.params.id, owner: req.user.id})
  .populate('key')
  .exec(function(err, app){
    if(err){
      res.send(500, err);
      return;
    }
    if(!app){
      res.send(404, 'app no encontrada');
      return; 
    }
    app.generateKey();
    res.redirect('dev/apps/' + app.id);
  });
};