var UserModel = require('../models/user').User;

module.exports = function(app){
  app.get('/user/:userId/validate', validateUser);
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
    user.save(function(err2, updatedUser){
      if(err2){
        console.log(err2);
        res.send(500, err2);
        return;   
      }
      res.render('user/validated', {user: updatedUser});
    });
  });
}