const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var schema = new Schema({
  c_card: {type: String, required: true, trim: true},
  c_rate: {type: Number},
  createdAt: {type: Date, default: Date.now}
}, {
  toJSON: { virtuals: true},
  toObject: {virtuals: true}
});

var User = mongoose.model('Card', schema);

module.exports = Card;