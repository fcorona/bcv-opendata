var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    AppModel = require('./apps').AppModel;


var ScoreSchema = new Schema({
  app: {type: Schema.ObjectId, ref: 'App'},
  ip: String,
  score: Number
});

ScoreSchema.index({app: 1, ip: 1}, {unique: true});

ScoreSchema.post('save', function(doc){
  AppModel.findById(doc.app, function(err, app){
    if(err){
      console.log(err);
      return;
    }
    if(!app.score){
      app.score = doc.score;
      app.totalVotes = 1;
    }else{
      app.score = (app.score*app.totalVotes + doc.score)/(app.totalVotes + 1);
      app.totalVotes++;
    }
    app.save();
  });
});


exports.ScoreModel = mongoose.model('Score', ScoreSchema);