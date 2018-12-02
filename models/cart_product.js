const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate');

mongoose.connect('mongodb://localhost:27017/fors')

var schema = new Schema({
  p_num: {type:Number},
  p_name: {type: String, required: true, trim: true},
  p_price: {type: String},
  p_image: {type: String},
  p_brand: {type: String},
  p_event: {type: Number},
  createdAt: {type: Date, default: Date.now}
}, {
  toJSON: { virtuals: true},
  toObject: {virtuals: true}
});

var cartProduct = mongoose.model('cartProduct', schema);

schema.plugin(mongoosePaginate);

module.exports = cartProduct;