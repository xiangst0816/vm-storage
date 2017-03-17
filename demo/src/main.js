import Vue from 'vue'
import App from './App'

// from local file
import vmStorage from '../../dist/vm-storage'

/* eslint-disable no-new */

Vue.use(vmStorage)
new Vue({
  el: '#app',
  template: '<App/>',
  components: {App}
})
