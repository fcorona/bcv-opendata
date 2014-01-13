

//inicio para ciudadano
exports.home = function(req, res){
  res.render('index', {title:'Plataforma de openData'});
};

//lista datasets
exports.datasets = function(req, res){
  res.send(200, {'message': 'not implemented yet.'});
};

//lista apps
exports.apps = function(req, res){
  res.send(200, {'message': 'not implemented yet.'});
};

//ver app
exports.viewApp = function(req, res){
  res.send(200, {'message': 'not implemented yet. ' + req.params.appId});
};

