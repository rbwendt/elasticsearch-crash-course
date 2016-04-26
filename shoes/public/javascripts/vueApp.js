var aggregationFields = ['color', 'brand', 'size']

vm = new Vue({
  el: '#app',
  data: {
    shoes: {},
    query: '',
    query_string: '',
    aggregations: {}
  },
  methods: {
    fetchData: function() {
      var xhr = new XMLHttpRequest()
      var self = this
      var params = ['query', 'query_string'].concat(aggregationFields).reduce(function(params, field) {
        if (self[field]) {
          params.push(field + '=' + encodeURIComponent(self[field]))
        }
        return params
      }, [])
      xhr.open('GET', 'list-shoes?' + params.join('&'))
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
