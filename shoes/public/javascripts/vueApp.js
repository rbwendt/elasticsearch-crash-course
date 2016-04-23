vm = new Vue({
  el: '#app',
  data: {
    shoes: {}
  },
  methods: {
    fetchData: function() {
      var xhr = new XMLHttpRequest()
      var self = this
      xhr.open('GET', 'list-shoes')
      xhr.onload = function() {
        console.log(JSON.parse(xhr.responseText))
        self.shoes = JSON.parse(xhr.responseText)
      }
      xhr.send()
    }
  }
})

vm.fetchData()
