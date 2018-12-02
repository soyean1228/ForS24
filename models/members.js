const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var schema = new Schema({
  uid: {type: String, required: true, trim: true},
  email: {type: String},
  password: {type: String},
  createdAt: {type: Date, default: Date.now}
}, {
  toJSON: { virtuals: true},
  toObject: {virtuals: true}
});

var Member = mongoose.model('Member', schema);

module.exports = Member;