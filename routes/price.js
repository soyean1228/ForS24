var express = require('express');
var router = express.Router();
var json = require('json');

//db
const Product = require('../models/product')
const Cart = require('../models/cart')

var currentEvent = 1;
var currentBrand = "emart"

/* GET home page. */
router.get('/', async(req, res, next)=> {
  var prod = await Product.find({"p_brand" : "emart"})
  //console.log(prod);
  //console.log(currentEvent,currentBrand);
  res.render('price',{ prod : prod });
});

router.get('/:id',async(req,res,next)=>{
  //console.log(req.params.id);
  if(req.params.id == 1 || req.params.id == 2 || req.params.id == 0 ){
    var prod = await Product.find({"p_brand" : currentBrand, "p_event" : req.params.id})
    //currentEvent = req.params.id;
    //console.log(currentEvent)
  }
  if(req.params.id == "price"){
    var prod = await Product.find({"p_brand" : "emart"})
  }
  if(req.params.id == "emart" || req.params.id == "GS25" || req.params.id == "seveneleven" ){
    currentBrand = req.params.id;
    console.log(req.params.id)
    var prod = await Product.find({"p_brand" : req.params.id})
  }
  if(req.params.id == "cart"){
    //var cart = await Cart.find({})
    //console.log(cart);
    res.render('cart');
  }
  console.log(currentBrand)
  //console.log(currentEvent)
  res.render('price',{ prod : prod });
});

router.post('/:id/:cid' , async( req , res , next) => {
  if(req.user){
  // 데이터가 잘넘어오는지 확인을 위해서
  console.log(req.body);  //p_num 수량
  console.log(req.params.id); //p_name 상품 이름 
  console.log(req.params.cid); //p_brand cart브랜드 이름 
  var currentId = req.user.uid //현재 로그인 중인 id 
  var c_brand = req.params.cid;// new_cart의 브랜드 이름 
  console.log(c_brand);
  var cart_p = await Cart.findOne({"id" : currentId, "cart_name" : c_brand })
  if(cart_p){ //currentId에 이미 cart가 있을 때 
    var cart_prod = cart_p.product
    //var pro_num = JSON.stringify(req.body);//var n = pro_num.split('{');
    var prod_num = JSON.stringify(req.body).split('{')[1].split('}')[0];   //////pro_num[0]이 최종 "num" : "11"
    //console.log(prod_num[0]) //console.log(cart_prod);
    var cart_prod_String = JSON.stringify(cart_prod).split('[')[1].split(']')[0]; //cart 안 product를 String으로 바꾼 것 
    //console.log(cart_prod_String);
    if (cart_prod_String){
      var product = '[' + cart_prod_String + ','+'{' + '"name"'+ ':' + '"' + req.params.id +'"'+',' + prod_num + '}' + ']';
      //var product_r = "'" + product + "'";
      // console.log(product_r); //현재 상태는 String
      // JSONParser parser = new JSONParser();
      // Object obj = parser.parse( product );
      // JSONObject jsonObj = (JSONObject) obj;
      //console.log(JSON.parse(cart_prod_String));
      console.log(product);
    }else {
      product = '[' +'{' + '"name"'+ ':' + '"' + req.params.id +'"'+',' + prod_num + '}' + ']';
    }
    await Cart.update({ id: currentId, cart_name : currentBrand }, {product : JSON.parse(product) })
  }else{ //currentId에 cart가 없을 때 
    var prod_num = JSON.stringify(req.body).split('{')[1].split('}')[0];   //////pro_num[0]이 최종 "num" : "11"
    var c_product = '['+'{' + '"name"'+ ':' + '"' + req.params.id +'"'+',' + prod_num + '}' + ']';
    console.log(c_product)
    var new_cart = new Cart({
      cart_name: c_brand, //장바구니 브랜드 이름 
      cart_price: 0, //장바구니 총 가격
      discount_price: 0, //할인 가격
      id: currentId, //유저 id
      product: JSON.parse(c_product), //상품
    })
    await new_cart.save(); 
  }
  var prod = await Product.find({"p_brand" : currentBrand, "p_event" : currentEvent})
  res.render('price',{ prod : prod});

}else{
  res.send('<script type="text/javascript">alert("로그인이 필요한 기능입니다."); document.location.href = "/"; </script>');

}
});

module.exports = router;