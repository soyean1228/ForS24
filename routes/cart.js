var express = require('express');
var router = express.Router();

//db
const Cart = require('../models/cart')
const Product = require('../models/product')
const cartProduct = require('../models/cart_product')

/* GET home page. */

router.get('/', async(req, res, next)=> {
  // discount_eleven = 0;
  // discount_emart=0;
  // discount_gs=0
  if (req.user){
    var currentId = req.user.uid //현재 로그인 중인 id 
    //gs25카트 
    var cart_gs = await Cart.findOne({"id" : currentId, "cart_name": "GS25"})
    var total_price_gs = 0;
    var total_price_emart = 0;
    var total_price_eleven = 0;
    if(cart_gs){
      var prod_gs = cart_gs.product
      // console.log(prod_gs)
      await cartProduct.remove({});
      for(var i=0; i<prod_gs.length; i++){
      //  console.log(prod_gs.length);
        var product = await Product.findOne({"p_name" : prod_gs[i].name});
        // console.log(product);
        var p = new cartProduct({"p_num" : prod_gs[i].num,
        "p_name" : prod_gs[i].name,
        "p_price" :  product.p_price,
        "p_brand" :  product.p_brand,
        "p_image": product.p_image,
        "p_event": product.p_event,
        })
        var w = parseInt(product.p_price.split('원')[0].split(',')[0].concat(product.p_price.split('원')[0].split(',')[1]));
        total_price_gs = total_price_gs + (w * prod_gs[i].num);
        await p.save();
        console.log(total_price_gs);
        await cart_gs.update({cart_price: total_price_gs});
      }
      var cartProduct_gs= await cartProduct.find({});
      }else{
        //await cart_gs.update({cart_price: total_price_gs});
        cartProduct_gs = 0;
      }

    //emart카트  
    var cart_emart = await Cart.findOne({"id" : currentId, "cart_name": "emart"})
    if(cart_emart){
    var prod_emart = cart_emart.product
    // console.log(prod_emart)
    await cartProduct.remove({});
    var total_price = 0;
    for(var i=0; i<prod_emart.length; i++){
      // console.log(prod_gs.length);
      var product = await Product.findOne({"p_name" : prod_emart[i].name});
      //console.log(product);
      var p = new cartProduct({"p_num" : prod_emart[i].num,
      "p_name" : prod_emart[i].name,
      "p_price" :  product.p_price,
      "p_brand" :  product.p_brand,
      "p_image": product.p_image,
      "p_event": product.p_event,
     })
      var w = parseInt(product.p_price.split('원')[0].split(',')[0].concat(product.p_price.split('원')[0].split(',')[1]));
      total_price_emart = total_price_emart + (w * prod_emart[i].num);
      await p.save();
      await cart_emart.update({cart_price: total_price_emart});
    }
    var cartProduct_emart = await cartProduct.find({});
    }else{
      cartProduct_emart = 0;
    }
    //va
    //seveneleven카트 
    var cart_seveneleven = await Cart.findOne({"id" : currentId, "cart_name": "seveneleven"})
    if(cart_seveneleven){
    var prod_seveneleven = cart_seveneleven.product
    // console.log(prod_emart)
    await cartProduct.remove({});
    var total_price = 0;
    for(var i=0; i<prod_seveneleven.length; i++){
      // console.log(prod_gs.length);
      var product = await Product.findOne({"p_name" : prod_seveneleven[i].name});
      //console.log(product);
      var p = new cartProduct({"p_num" : prod_seveneleven[i].num,
      "p_name" : prod_seveneleven[i].name,
      "p_price" :  product.p_price,
      "p_brand" :  product.p_brand,
      "p_image": product.p_image,
      "p_event": product.p_event,
     })
      var w = parseInt(product.p_price.split('원')[0].split(',')[0].concat(product.p_price.split('원')[0].split(',')[1]));
        total_price_eleven = total_price_eleven + (w * prod_seveneleven[i].num);
      await p.save();
      await cart_seveneleven.update({cart_price: total_price_eleven});
    }
    var cartProduct_seveneleven = await cartProduct.find({});
    console.log(cartProduct_seveneleven);
    }else{
      cartProduct_seveneleven = 0;
    }
    //var cartProduct_seveneleven = await cartProduct.find({});

    res.render('cart',{ prod_gs : cartProduct_gs , prod_emart : cartProduct_emart, prod_seveneleven: cartProduct_seveneleven, 
      total_price_gs : total_price_gs, total_price_emart : total_price_emart, total_price_eleven : total_price_eleven});
    console.log(total_price);
  }else{
    res.send('<script type="text/javascript">alert("로그인이 필요한 페이지입니다"); document.location.href = "/"; </script>');
  }
});

router.post('/:id', async(req, res, next)=>{
  if(req.params.id == "sale_emart"){
    var cart_e = await Cart.findOne({"cart_name": "emart","id" :req.user.uid});
    discount_emart = cart_e.cart_price;
    //membership discount
    if(req.body.membership == 'kt'){
      discount_emart = discount_emart - discount_emart*0.1;
      // console.log(discount_emart);
    }
    //res.render('cart',{discount_emart: discount_emart});
    res.redirect('/cart');
    }else if(req.params.id == "sale_gs")
    {
      var cart_g = await Cart.findOne({"cart_name": "GS25", "id" :req.user.uid});
      console.log(req.body);
      discount_gs = cart_g.cart_price;
      //membership discount
      if(req.body.membership == 'lg' || req.body.membership == 'u+' || req.body.membership == 'kt'){
        discount_gs = discount_gs - discount_gs*0.1;
        //res.render('cart',{discount_gs: discount_gs});
      }
      //card discount
      if(req.body.card == 'Mr.Life')
      {
        discount_gs = discount_gs - discount_gs*0.1;  
      }else if(req.body.card == 'taptapO'){
        discount_gs = discount_gs - discount_gs*0.07; 
      }else if(req.body.card == 'kia'){
        discount_gs = discount_gs - discount_gs*0.2;
      }else if(req.body.card == 'happy'){
        discount_gs = discount_gs - discount_gs*0.15;
      }
      //res.render('cart',{discount_gs: discount_gs});
    }else if(req.params.id == "sale_eleven")
    {
      var cart_s = await Cart.findOne({"cart_name": "seveneleven", "id" :req.user.uid});
      console.log(cart_s);
      discount_eleven = cart_s.cart_price;
      console.log(cart_s.cart_price);
      //membership discount
      if(req.body.membership == 't'){
        var i = discount_eleven/1000;
        discount_eleven = discount_eleven - 50*i;
        //res.render('cart',{discount_eleven: discount_eleven});
      }
      //card discount
      if(req.body.card == 'Mr.Life'){
        discount_eleven = discount_eleven - discount_eleven*0.1;  
      }else if(req.body.card == 'taptapO'){
        discount_eleven = discount_eleven - discount_eleven*0.07; 
      }else if(req.body.card == 'seven_lotte'){
        discount_eleven = discount_eleven - discount_eleven*0.1;
      }
      //res.render('cart',{discount_eleven: discount_eleven});
    }
    res.redirect('/cart');
  });  



////////////////////////////////////////////////////////////
//////////////////상품 삭제////////////////////////////////
////////////////////////////////////////////////////////////
router.post('/:id/:cid', async(req, res, next)=>{
  var currentId = req.user.uid //현재 로그인 중인 id
  var currentBrand = req.params.cid //선택된 상품의 브랜드
  console.log(req.params.id); //p_pname
  console.log(req.params.cid);  //p.p_brand
  console.log(currentId);  //id

  var d_prod = req.params.id; //삭제할 상품 이름

  //카트 찾기
  var delete_cart = await Cart.findOne({"id" : currentId, "cart_name" : req.params.cid })
  //console.log(delete_cart);  //삭제를 선택한 상품의 카트 출력 

  //카트 속 상품 찾기
  //console.log("카트에 담긴 상품들을 출력해주세요~~");
  var delete_cart_prod = delete_cart.product;
  console.log(delete_cart_prod);
  //console.log("============이게뭘까용=================");
  //var c = JSON.stringify(delete_cart.product);
  //console.log(c);
  console.log("============삭제해야할 상품이 뭔가요~~?=================");
  console.log(d_prod);
  for(var key in delete_cart.product){
    console.log("============(key값 출력)===================");
    console.log(key);
    if(delete_cart.product[key].name==d_prod){
      console.log("============(상품삭제)===================");
      // var a = JSON.stringify(delete_cart.product.splice(key,2));
      // var d_w = parseInt(delete_cart.product[key].cart_price.split('원')[0].split(',')[0].concat(product.p_price.split('원')[0].split(',')[1]));
      // delete_cart.cart_price = delete_cart.cart_price + (d_w * prod_seveneleven[i].num);
      delete_cart.product.splice(key,1);
      var delete_prodstr = JSON.stringify(delete_cart.product);
      console.log(delete_prodstr);
      await delete_cart.update({product : JSON.parse(delete_prodstr)}) 
      break;
    }
  }

  if(currentBrand == "GS25"){
    res.render('cart',{prod_gs : delete_cart_prod });
    res.redirect('/cart');
  }else if(currentBrand == "emart" ){
    res.render('cart', {prod_emart : delete_cart_prod })
    res.redirect('/cart');
  }else if(currentBrand == "seveneleven" ){
    res.render('cart', {prod_seveneleven : delete_cart_prod })
    res.redirect('/cart');
  }
});


module.exports = router;