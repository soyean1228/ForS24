const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate');

mongoose.connect('mongodb://localhost:27017/fors')

// // 3. 연결된 testDB 사용
var db = mongoose.connection;
// 4. 연결 실패
db.on('error', function(){
    console.log('Connection Failed!');
});

// 5. 연결 성공
db.once('open', function() {
    console.log('Connected!');
});

var schema = new Schema({
  p_num: {type:Number},
  p_name: {type: String, required: true, trim: true},
  p_price: {type: String},
  p_image: {type: String},
  p_brand: {type: String},
  p_event: {type: Number},
  // c_card: {type: Schema.Types.ObjectId, ref: 'Card'},
  //card랑 연동  c_card: {type: String},
  createdAt: {type: Date, default: Date.now}
}, {
  toJSON: { virtuals: true},
  toObject: {virtuals: true}
});

var Product = mongoose.model('Product', schema);

schema.plugin(mongoosePaginate);

module.exports = Product;