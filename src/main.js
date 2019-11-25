import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './assets/css/global.css'

import axios from 'axios'
axios.defaults.baseURL='http://127.0.0.1:8888/api/private/v1/';
axios.interceptors.request.use(config=>{
  config.headers.Authorization=window.sessionStorage.getItem('token')
  return config
})
Vue.prototype.$http=axios;
Vue.config.productionTip = false

// ui组将
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);

import TreeTable from 'vue-table-with-tree-grid'
Vue.component('tree-table', TreeTable)


new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
