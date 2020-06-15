import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import './assets/style/style.css'
import './assets/style/global.css'
import './plugins/element.js'
import 'element-ui/lib/theme-chalk/index.css';
// 导入字体:
import './assets/font/iconfont.css'

Vue.prototype.$http = axios //将axios 挂载到$http上;
//配置请求的跟路径;
axios.defaults.baseURL = "https://www.liulongbin.top:8888/api/private/v1/"

//axios请求拦截
axios.interceptors.request.use(config =>{
	//为请求头对象,添加token验证的Authorization字段
  config.headers.Authorization = window.sessionStorage.getItem('token')
  console.log("config",config)
  //必须return config
	return config
})

//从而为请求头设置自定义字段
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
