var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ChallengeSchema = new Schema({
  name: String,
  description: String,
  imageUrl: String,
  starts: {type: Date, default: Date.now},
  ends: {type: Date, default: Date.now},
  participants: [{type: Schema.ObjectId, ref: 'App'}]
},
{
  strict: false
});

ChallengeSchema.virtual('startsString').get(function(){
  var date = this.starts;
  return date.getDate() + '/' + date.getMonth() + '/' + date.getFullYear();
});

ChallengeSchema.virtual('endsString').get(function(){
  var date = this.ends;
  return date.getDate() + '/' + date.getMonth() + '/' + date.getFullYear();
});

ChallengeSchema.statics.listAll = function(page, resultsPerPage, name, cb){
  var schema = this;
  var queryTotal = schema.find();

  if(name && name !== ''){
    queryTotal = queryTotal.or([{name: new RegExp(name, 'i')}, {description: new RegExp(name, 'i')}]);
  }

  queryTotal.count().exec(function(err, total){
    if(err){cb(err); return;}
    var query = schema.find();
    if(name && name !== ''){
      query = query.or([{name: new RegExp(name, 'i')}, {description: new RegExp(name, 'i')}]);
    }

    query.limit(resultsPerPage)
    .skip((page-1)*resultsPerPage)
    .sort('-starts')
    .exec(function(err, challenges){
      cb(err, challenges, total);
    });
  });

}

exports.ChallengeModel = mongoose.model('Challenge', ChallengeSchema);