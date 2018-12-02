const mongoose = require('mongoose');
const Schema = mongoose.Schema;

mongoose.connect('mongodb://localhost:27017/fors')

var schema = new Schema({
  cart_name: {type: String, required: true, trim: true}, //장바구니 번호
  cart_price: {type: Number}, //장바구니 총 가격
  discount_price: {type: Number}, //할인 가격
  id: {type: String}, //유저 id
  product: {type: Object}, //상품
  createdAt: {type: Date, default: Date.now} 
}, {
  toJSON: { virtuals: true},
  toObject: {virtuals: true}
});

var Cart = mongoose.model('Cart', schema);

module.exports = Cart;