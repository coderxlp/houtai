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

import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
Vue.use(VueQuillEditor);


/* 时间过滤器 */
Vue.filter('dateFormat',function(orig){
  const dt=new Date(orig)

  const y=dt.getFullYear()
  const m=(dt.getMonth()+1+"").padStart(2,'0')
  const d=(dt.getDate()+"").padStart(2,'0')

  const hh=(dt.getHours()+"").padStart(2,'0')
  const mm=(dt.getMinutes()+"").padStart(2,'0')
  const ss=(dt.getSeconds()+"").padStart(2,'0')
  return  `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
