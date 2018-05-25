// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import VueLazyLoad from 'vue-lazyload'
import infiniteScroll from 'vue-infinite-scroll'
import {currency} from './util/currency'

import './assets/css/app.css'

// 引用axios，并设置基础URL为后端服务api地址
var axios = require('axios')
axios.defaults.baseURL = '/sell'
// 将API方法绑定到全局
Vue.prototype.$axios = axios

Vue.config.productionTip = false

Vue.filter("currency", currency)

Vue.use(VueLazyLoad, {
  loading: "/static/loading-svg/loading-spokes.svg"
});
Vue.use(infiniteScroll);
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: {App},
  template: '<App/>'
})
