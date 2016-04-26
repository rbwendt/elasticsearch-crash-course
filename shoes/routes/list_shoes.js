var express = require('express');
var client = require('../src/client')

var router = express.Router();

var aggregationFields = ['color', 'brand', 'size']

function generateAggregationRequest(aggregationFields) {
  return aggregationFields.reduce(function (agg, field) {
    agg[field] = {
      terms: {
        field: field,
        size: 1000
      }
    }
    return agg
  }, {})
}

function search(req, res, next) {

  var musts = []
  if (req.query.q) {
    musts.push({
      match: {
        "_all" : req.query.q
      }
    })
  }
  if (req.query.qs) {
    musts.push({
      default_field: 'brand',
      "query" : req.query.qs
    })
  }
  aggregationFields.map(function(field) {
    if (req.query[field]) {
      var o = {}
      o[field] = req.query[field]
      musts.push({ "term" :  o})
    }
  })
  var query = {
    constant_score: {
      filter: {
        bool: {
          must: musts
        }
      }
    }
  }

  var opts = {
    index: 'shoes',
    type: 'shoes',
    body: {
      query: query,
      aggs: generateAggregationRequest(aggregationFields)
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
