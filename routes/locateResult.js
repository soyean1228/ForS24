var express = require('express');
var http = require('http');
var router = express.Router();

/* GET home page. */
router.get('/', async(req, res, next)=> {
  res.render('locateResult')
});
module.exports = router;

