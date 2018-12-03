const mongoose = require('mongoose');
var express = require('express');
var router = express.Router();

//db
const Product = require('../models/product')


/*기본페이지/
/* GET home page. */

var currentEvent = 1;
var currentBrand = "emart"

///////////////////////*defult*//////////////////////
router.get('/', async(req, res, next)=> {
  var prod = await Product.find({"p_brand" : "emart", "p_event" : 1})
  console.log(prod);
  console.log(currentEvent,currentBrand);
  //res.render('event',{ prod : prod ,currentEvent :currentEvent});
});


///////////////////////*편의점별 배너클릭시 페이지*//////////////////////
router.get('/:id',async(req,res,next)=>{
  console.log(currentBrand, req.params.id);
  if(req.params.id == 1 || req.params.id == 2 || req.params.id == 0 ){
    var prod = await Product.find({"p_brand" : currentBrand, "p_event" : req.params.id})
  }else if(req.params.id == "event"){
    var prod = await Product.find({"p_brand" : "emart", "p_event" : 1})
  }else if(req.params.id == "emart" || req.params.id == "GS25" ||req.params.id == "seveneleven" ){
    currentBrand = req.params.id;
    var prod = await Product.find({"p_brand" : req.params.id, "p_event" : 1})
  }
  currentEvent = currentEvent;
  res.render('event',{ prod : prod ,currentEvent :currentEvent});
});

module.exports = router;
