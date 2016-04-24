vm = new Vue({
  el: '#app',
  data: {
    shoes: {},
    query: '',
    querystring: ''
  },
  methods: {
    fetchData: function() {
      var xhr = new XMLHttpRequest()
      var self = this
      xhr.open('GET', 'list-shoes?q=' + self.query + '&qs=' + self.querystring)
      xhr.onload = function() {
        console.log(JSON.parse(xhr.responseText))
        self.shoes = JSON.parse(xhr.responseText)
      }
      xhr.send()
    }
  }
})

vm.fetchData()
