import Vue from 'vue'
import App from './App'
// from local file
import vmStorage from '../../dist/vm-storage'
Vue.use(vmStorage, {
  prefix: ''
})

/* eslint-disable no-new */

new Vue({
  el: '#app',
  template: '<App/>',
  components: {App}
})
