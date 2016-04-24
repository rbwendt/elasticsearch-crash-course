vm = new Vue({
  el: '#app',
  data: {
    shoes: {},
    query: '',
    querystring: '',
    aggregations: {}
  },
  methods: {
    fetchData: function() {
      var xhr = new XMLHttpRequest()
      var self = this
      xhr.open('GET', 'list-shoes?q=' + self.query + '&qs=' + self.querystring)
      xhr.onload = function() {
        response = JSON.parse(xhr.responseText)
        self.shoes = response.hits
        self.aggregations = response.aggregations
      }
      xhr.send()
    }
  }
})

vm.fetchData()
