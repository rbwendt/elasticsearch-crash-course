var express = require('express');
var client = require('../src/client')

var router = express.Router();

function search(req, res, next) {
  var query = {
    match_all: {}
  }
  if (req.query.q) {
    query = {
      match: {
        "_all" : req.query.q
      }
    }
  }
  if (req.query.qs) {
    query = {
      query_string: {
        default_field: 'brand',
        "query" : req.query.qs
      }
    }
  }


  var opts = {
    index: 'shoes',
    type: 'shoes',
    body: {
      query: query
    }
  }
  client.search(opts)
  .then(function (resp) {
    var hits = resp.hits.hits.map(function(hit) {
      return hit._source
    });
    res.send(JSON.stringify(hits))
  }, function (err) {
    console.trace(err.message);
  });
}

/* GET users listing. */
router.get('/', search);

module.exports = router;
