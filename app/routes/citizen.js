var datasetRoute = require('./dataset'),
    dataset = require('../models/dataset'),
    apps = require('../models/apps'),
    TagModel = require('../models/basics').TagModel,
    utils = require('../util/validators'),
    ScoreModel = require('../models/score').ScoreModel;

module.exports = function(app){
  app.get('/', home);
  app.get('/datasets', datasets);
  app.get('/datasets/:name/interactive', datasetInteractivo);
  app.get('/datasets/:name/:format?', datasetRoute.showDataset);
  app.get('/apps', listApps);
  app.get('/apps/successfullReport', successfullReport);
  app.get('/apps/:appId/report', reportAppForm);
  app.post('/apps/:appId/report', reportApp);
  app.post('/apps/:appId/rate', rateApp);
  app.get('/apps/:appId', viewApp);
}

//inicio para ciudadano
var HOME_ROUTES = {
  admin: '/admin/',
  developer: '/dev/apps/'
};

var home = function(req, res){
  if(req.user){
    res.redirect(HOME_ROUTES[req.user.role]);
  }else{
    res.render('index', {title:'Plataforma de openData'});
  }
};

//lista datasets
var datasets = function(req, res){
  //valida las entradas
  var name = req.query.name || '';
  var tags = req.query.tags || '';

  var tagsToArray = tags.split(',');
  tags = '';
  for(var i = 0; i < tagsToArray.length; i++){
    var tag = (tagsToArray[i] || '').trim();
    if(tag !== ''){
      tags += tag+',';
    }
  };

  dataset.DatasetMongo.listAll(name,  tags.split(','), function(err, datasets){
    if(err){
      res.send(500, err);
      return;
    }
    TagModel.find(function(err, allTags){
      if(err){
        res.send(500, err);
        return;
      }
      res.render('citizen/datasets', {
        datasets: datasets,
        tags: tags,
        name: name,
        allTags: allTags
      });
    });
  });
};

//lista apps
var listApps = function(req, res){
  //valida las entradas
  var page = parseInt(req.query.page) || 1;
  var name = req.query.name || '';
  var tags = req.query.tags || '';
  var resultsPerPage = 10;

  apps.AppModel.listAll(page, resultsPerPage, tags.split(','), name,
    function(err, applications, total){
    if(err){
      res.send(500, err);
      return;
    }
    total = Math.ceil(total/resultsPerPage);

    TagModel.find(function(err, allTags){
      if(err){
        res.send(500, err);
        return;
      }
      res.render('citizen/apps', {
        apps: applications,
        current: page,
        total: total,
        name: name,
        tags: tags,
        allTags: allTags
      });
    });
  });
};

//lista datasets
var datasetInteractivo = function(req, res){
  res.render('citizen/iicvInteractivo');
};

//ver app
var viewApp = function(req, res){
  apps.AppModel.findOne({'_id': req.params.appId})
  .populate('owner')
  .populate('tags')
  .exec(function(err, application){
    if(err){
      res.send(500, err);
      return;
    }
    if(!application){
      res.render(404, '404');
      return;
    }
    res.render('citizen/app', {title: application.name, app: application});
  });
};

//reportar app
var reportAppForm = function(req, res){
  apps.AppModel.findOne({'_id': req.params.appId})
  .exec(function(err, application){
    if(err){
      res.send(500, err);
      return;
    }
    if(!application){
      res.render(404, '404');
      return;
    }
    res.render('citizen/reportApp', {
      title: 'reportar ' + application.name,
      app: application,
      errors: {},
      email: '',
      reason: ''
    });
  });
};

var reportApp = function(req, res){
  var errors = {},
      email = req.body.email || '',
      reason = req.body.reason || '';

  if(email.length < 3 || !utils.validateEmail(email)){
    errors.email = 'El correo electrónico que escribio no es válido';
  };

  if(reason.length < 3){
    errors.reason = 'debe escribir una razón mas descriptiva.'
  }
  if(Object.keys(errors).length > 0){
    res.render('citizen/reportApp', {
      email: email,
      reason: reason,
      errors: errors,
      app: {
        id: req.body.id,
        name: req.body.name
      }
    });
    return;
  }

  new apps.ReportAppModel({
    email: email,
    reason: reason,
    app: req.body.id
  })
  .save(function(err, reportApp){
    if(err){
      res.send(500, err);
      return;
    }
    res.redirect('/apps/successfullReport');
  })

};

var successfullReport = function(req, res){
  res.render('citizen/successfullReport');
};

var rateApp = function(req, res){
  new ScoreModel({
    score: req.body.score,
    ip: req.ip,
    app: req.params.appId
  }).save(function(err, score){
    if(err){
      res.send(200, {msg: 'error'})
    }else{
      res.send(200, {msg: 'ok'});
    }
  });
}
