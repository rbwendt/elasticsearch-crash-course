var express = require('express');
var client = require('../src/client')

var router = express.Router();

function done(req, res, next) {
  res.send('respond with a resource');
}

function getBrand() {
  var brands = ['nike', 'reebok', 'spalding', 'blundstone', 'birkenstock', 'puma',
    'new balance', 'adidas'
  ]
  return brands[Math.floor(Math.random() * brands.length)]
}

function getSize() {
  return Math.floor(12 + Math.random() * 14) / 2
}

function getPrice() {
  return Math.floor(6000 + Math.random() * 7000) / 100
}

function getType() {
  var types = ['running shoe', 'sandal', 'boot', 'winter boot']
  return types[Math.floor(Math.random() * types.length)]
}

function getColor() {
  var colors = ['red', 'green', 'yellow', 'blue', 'white', 'black']
  return colors[Math.floor(Math.random() * colors.length)]
}

function getLaces() {
  return Math.random() > 0.5
}

function getShoe() {
  return {
    brand: getBrand(),
    size: getSize(),
    type: getType(),
    color: getColor(),
    laces: getLaces(),
    price: getPrice()
  }
}

function getSale(shoe, saleDate) {
  return {
    shoe: shoe,
    soldFor: (0.85 + Math.random() * 0.15) * shoe.price,
    saleDate: saleDate
  }
}

function getInsertion(type, record) {

  client.create({
    index: 'shoes',
    type: type,
    body: record
  })

}

function generateDataInserts() {
  var inserts = []
  var i, j, k, L
  for (i = 0; i < 30; i++) {
    var shoe = getShoe()
    inserts.push(getInsertion('shoes', shoe))
    for (j = -7; j < 0; j++) {
      var saleDate = new Date()
      saleDate.setDate(saleDate.getDate() + j)
      L = 5 + Math.floor(Math.random() * 30)
      for (k = 0; k < L; k++) {
        var sale = getSale(shoe, saleDate)
        inserts.push(getInsertion('sales', sale))
      }
    }
  }
  return inserts
}

function populate(req, res, next) {
  Promise.all(generateDataInserts())
  .then(function() {done(req, res, next)});
}

/* GET users listing. */
router.get('/', populate);

module.exports = router;
