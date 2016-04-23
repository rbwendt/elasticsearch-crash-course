var express = require('express');
var elasticsearch = require('elasticsearch');
var client = new elasticsearch.Client({
  host: 'localhost:9200',
  log: 'trace'
});

var router = express.Router();

function search(req, res, next) {
  var query = {
    match_all: {}
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
