var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var MetricSchema = new Schema({
  via: Number,
  data: Number,
  user: {type: Schema.ObjectId, ref: 'User'},
  date: {type: Date, default: Date.now},
});

//via: 0 html, 1 csv, 2 json, 3 embebed.
var METRIC_VIAS = {
  html: 0,
  csv: 1,
  json: 2,
  embebed: 3,
  graph: 4
};

MetricSchema.statics.saveMetric = function(via, user, data){
  new this({
    via: via,
    user: user,
    data: data
  }).save();
}


exports.MetricModel = mongoose.model('Metric', MetricSchema);
exports.METRIC_VIAS = METRIC_VIAS;
