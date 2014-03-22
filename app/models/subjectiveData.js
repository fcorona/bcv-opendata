var MongoClient = require('mongodb').MongoClient;

var host = process.env['MONGO_NODE_DRIVER_HOST'] != null ? process.env['MONGO_NODE_DRIVER_HOST'] : 'localhost';
var port = process.env['MONGO_NODE_DRIVER_PORT'] != null ? process.env['MONGO_NODE_DRIVER_PORT'] : 27017;

var mongo = undefined;
MongoClient.connect('mongodb://' + host + ':' + port + '/comovamos', function(err, db) {
  if(err) console.log(err);
  mongo = db;
});

exports.createCollection = function(collectionName, cb){
  var counter = 0;
  var callback = function(err, collection){
    if(err){
      counter = 5;
      cb(err);
      return;
    } 
    counter++;
    if(counter==5){
      cb(err);
    }
  };
  mongo.createCollection(collectionName, function(err, collection){
    if(err){
      cb(err);
      return;
    } 

    var indexes = ['year','zone', 'nse','age','gender'];
    for(var i = 0; i < indexes.length && counter < 5; i++){
      collection.createIndex(indexes[i], function(err , indexes){
        callback(err);
        if(err) return;
      });
    }
  });
};
exports.createCrude = function(){
  mongo.createCollection('crudeEpc', function(err, collection){
    if(err){
      console.log('43 createCrude', err);
    }
  });
}

exports.insertDataB = function(collectionName, datas, cb){
  console.log(collectionName);
  mongo.collection(collectionName).insert(datas, {w:1}, function(err, result){
    console.log(result);
  });
};

exports.deleteCollections = function(){
  for (var i = 0; i < 1445; i++) {
    var collectionName = 'prp'+i;
    mongo.collection(collectionName).drop(function(err,res){
      if(err){
        console.log('deleteCollections:', collectionName, err);
      }
    });
  };
  mongo.collection('crudeEpc').drop(function(err, res){
    if(err){
      console.log('deleteCollections:', collectionName, err);
    }
    console.log('eliminado crudeEpc');
  })
}

exports.insertIntoCrudeConsolidate = function(data, cb){
  mongo.collection('crudeEpc').insert(data, {w:1}, function(err, result){
    if(err){
      console.log('subjectiveData:75', data);
    }
    cb(err);
  });
}
//temporally unused
var countTotalAnswers = function(questionId, cb){
  var filter = {};
  var values = {
    'year': 1,
    'nse': 1,
    'zone': 1,
    'age': 1
  };
  filter[questionId] = {'$exists':true};
  values[questionId] = 1;
  mongo.collection('crudeEpc')
  .find(filter, values)
  .count(function(err, total){
    console.log('transform:', questionId, total);
    cb();
  })
};

exports.transferDataTo = function(questionId, cb){
  var filter = {};
  var values = {
    'year': 1,
    'nse': 1,
    'zone': 1,
    'age': 1,
    'gender': 1
  };
  filter[questionId] = {'$exists':true};
  values[questionId] = 1;
  mongo.collection('crudeEpc')
  .find(filter, values).toArray(function(err, values){
    if(err){console.log('93', err);}
    if(values.length === 0) cb();
    for(var i = 0; i < values.length; i++){
      var val = values[i];
      val.data = val[questionId];
      delete val[questionId];
      delete val['_id']
    };

    mongo.collection('pr' + questionId).insert(values, {w:1}, function(err, result){
      if(err){
        console.log('103', err);
        cb();
      }
      cb();
    });
  })
};

exports.retrieveDataFrom = function(questionId, filter, cb){
  mongo.collection('pr' + questionId).aggregate([
    {
      '$match': filter
    },
    {
      '$sort': {
        year: 1
      }
    },
    {
      '$group': {
        '_id': {
          year: '$year',
          data: '$data'
        },
        total: {
          '$sum': 1
        }
      }
    },
    {
      '$group': {
        '_id': '$_id.year',
        values: {
          '$addToSet': {
            option: '$_id.data',
            total: '$total'
          }
        }
      }
    }
    ], function(err, results){
      cb(err, results);
    });
}