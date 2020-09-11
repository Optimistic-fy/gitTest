// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import fastClick from 'fastclick'
import './assets/styles/reset.css'
import './assets/styles/border.css'
import store from './store/index'
import 'babel-polyfill' // 用于手机测试时不支持promise白屏的情况
import VueRouter from 'vue-router'
import {
  post,
  get
} from './utils/request'
import 'lib-flexible/flexible' //自适应屏幕大小
import global from './utils/global.js'
import Vant from 'vant'
import 'vant/lib/index.css'
import {
  Lazyload,
  Toast
} from 'vant'
import '@/assets/styles/change.css'
import {
  timeHandle,
  reloadPubdate
} from './utils/moment'


Vue.config.productionTip = false
fastClick.attach(document.body) // 解决移动端点击延迟

router.beforeEach((to, from, next) => {
  //在跳转前进行一些操作，通过matched是因为层次路由 
  if (to.name === 'home') {
    document.title = store.state.title;
  } else {
    document.title = to.matched[0].meta.title; //路由跳转 
  }
  next()
});

Vue.use(VueRouter)
Vue.use(Vant)
Vue.use(Lazyload)
Vue.use(Toast)


Vue.filter('moment', timeHandle)
Vue.filter('moment', reloadPubdate)

Vue.prototype.$post = post
Vue.prototype.$get = get
Vue.prototype.$global = global
Vue.prototype.$Toast = Toast

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: {
    App
  },
  template: '<App/>'
})