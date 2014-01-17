var datasetRoute = require('./dataset'),
    dataset = require('../models/dataset'),
    apps = require('../models/apps');

module.exports = function(app){
  app.get('/', home);
  app.get('/datasets/', datasets);
  app.get('/datasets/:name/:format?', datasetRoute.showDataset);
  app.get('/apps/', listApps);
  app.get('/apps/:appId', viewApp);
}

//inicio para ciudadano
var home = function(req, res){
  if(req.user && req.user.role == 'admin'){
    res.redirect('/admin/');
  }else{
    res.render('index', {title:'Plataforma de openData'});
  }
};

//lista datasets
var datasets = function(req, res){
  dataset.DatasetMongo.find({}, function(err, datasets){
    if(err){
      res.send(500, err);
      return;
    }
    res.render('citizen/datasets', {datasets: datasets});
  });
};

//lista apps
var listApps = function(req, res){
  apps.AppModel.find({})
  .populate('owner')
  .exec(function(err, applications){
    if(err){
      res.send(500, err);
      return;
    }
    res.render('citizen/apps', {apps: applications});
  });
};

//ver app
var viewApp = function(req, res){
  apps.AppModel.findOne({'_id': req.params.appId})
  .populate('owner')
  .exec(function(err, application){
    if(err){
      res.send(500, err);
      return;
    }
    if(!application){
      res.render(404, '404');
      return;
    }
    res.render('citizen/app', {app: application});
  });
};

