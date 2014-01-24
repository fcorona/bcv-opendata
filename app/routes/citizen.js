var datasetRoute = require('./dataset'),
    dataset = require('../models/dataset'),
    apps = require('../models/apps'),
    TagModel = require('../models/basics').TagModel;

module.exports = function(app){
  app.get('/', home);
  app.get('/datasets', datasets);
  app.get('/datasets/:name/interactive', datasetInteractivo);
  app.get('/datasets/:name/:format?', datasetRoute.showDataset);
  app.get('/apps', listApps);
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
  dataset.DatasetMongo.find()
  .populate('tags')
  .exec(function(err, datasets){
    if(err){
      res.send(500, err);
      return;
    }
    TagModel.find(function(err, tags){
      if(err){
        res.send(500, err);
        return;
      }
      res.render('citizen/datasets', {
        datasets: datasets,
        tags: tags
      });
    });
  });
};

//lista apps
var listApps = function(req, res){
  //valida las entradas
  var page = parseInt(req.query.page) || 1;
  var tags = req.query.tags || '';
  var resultsPerPage = 1;

  apps.AppModel.listAll(page, resultsPerPage, tags.split(','), function(err, applications, total){
    if(err){
      res.send(500, err);
      return;
    }
    total = Math.ceil(total/resultsPerPage);

    res.render('citizen/apps', {
      apps: applications,
      current: page,
      total: total,
      tags: tags
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

