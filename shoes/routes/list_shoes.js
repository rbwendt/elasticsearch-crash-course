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
      query: query,
      aggs: {
        "colors": {
          "terms": {
            "field": "color",
            "size": 1000
          }
        },
        "brands": {
          "terms": {
            "field": "brand",
            "size": 1000
          }
        },
        "sizes": {
          "terms": {
            "field": "size",
            "size": 1000
          }
        }
      }
    }
  }
  client.search(opts)
  .then(function (resp) {
    var aggregations = []
    for (var k in resp.aggregations) {
      aggregations.push({
        "field" : k,
        "values" : resp.aggregations[k].buckets
      })
    }
    var response = {
      hits: resp.hits.hits.map(function(hit) {
        return hit._source
      }),
      aggregations: aggregations
    }
    res.send(JSON.stringify(response))
  }, function (err) {
    console.trace(err.message);
  });
}

/* GET users listing. */
router.get('/', search);

module.exports = router;
