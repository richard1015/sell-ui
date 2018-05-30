// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Vuex from 'vuex'
import VueLazyLoad from 'vue-lazyload'
import infiniteScroll from 'vue-infinite-scroll'
import {currency} from './util/currency'
import {date} from './util/date'

import './assets/css/app.css'
// 引用axios，并设置基础URL为后端服务api地址
var axios = require('axios')
axios.defaults.baseURL = '/sell'
// 将API方法绑定到全局
Vue.prototype.$axios = axios

Vue.config.productionTip = false

Vue.filter("currency", currency)
Vue.filter("date", date)

Vue.use(VueLazyLoad, {
  loading: "/static/loading-svg/loading-spokes.svg"
});
Vue.use(infiniteScroll);

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    nickName: '',
    cartCount: 0
  },
  mutations: {
    //更新用户信息
    updateUserInfo(state, nickName) {
      state.nickName = nickName;
    },
    updateCartCount(state, cartCount) {
      state.cartCount += cartCount;
    },
    initCartCount(state, cartCount) {
      state.cartCount = cartCount;
    }
  }
});

new Vue({
  el: '#app',
  store,
  router,
  components: {App},
  template: '<App/>'
})
