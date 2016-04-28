var aggregationFields = ['color', 'brand', 'size']

var queries = {
  match: `{"query": {"match": {
   "_all": "blundstone 7"
}}}`,
  query_string: `{"query_string": {
   "default_field": "brand",
   "query": "blundstone AND size:7"
}}`
}

vm = new Vue({
  el: '#app',
  data: {
    shoes: {},
    query: '',
    query_string: '',
    aggregations: {},
    jsonQuery: '',
    mode: false
  },
  methods: {
    switchQuery: function(key) {
      this.jsonQuery = queries[key]
    },
    toggleMode: function() {
      this.mode = !this.mode
    },
    fetchData: function() {
      var xhr = new XMLHttpRequest()
      var self = this
      var queryUrl
      if (this.mode) {
        var params = ['query', 'query_string'].concat(aggregationFields).reduce(function(params, field) {
          if (self[field]) {
            params.push(field + '=' + encodeURIComponent(self[field]))
          }
          return params
        }, [])
        queryUrl = 'list-shoes?' + params.join('&')
      } else {
        queryUrl = 'list-shoes?a=' + this.jsonQuery.replace(/\s+/g, ' ')
      }
      xhr.open('GET', queryUrl)
      xhr.onload = function() {
        response = JSON.parse(xhr.responseText)
        self.shoes = response.hits
        self.aggregations = response.aggregations
      }
      xhr.send()
    },
    setAgg: function(field, key) {
      this[field] = key
      this.fetchData()
    }
  }
})

vm.fetchData()
