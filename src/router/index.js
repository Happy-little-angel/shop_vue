import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login.vue'

Vue.use(VueRouter)

  const routes = [
  {
    path: '/login',
    name: '登录',
    component: Login
  },
  {
    //重定向路由
    path: '/',
    name: 'login',
    redirect:'/login'
  },
  {
    path: '/home',
    name: 'Home',
    component: () => import(/* webpackChunkName: "about" */ '../components/Home.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

//挂载路由导航函数
//为路由对象添加beforeEach 导航守卫
  //1.to 将要访问的路径
  //2.from 代表从哪个路径跳转而来
  //3.next 是一个函数,代表放行;
    // next () 直接放行   next("/login") 强制跳转
router.beforeEach((to,from,next) => {
  //如果访问登录页面直接放行;
  if(to.path === '/login') return next ()
  //从而获取token;
  const tokenStr = window.sessionStorage.getItem('token');
  //没有token,强制跳转到登录页面
  if(!tokenStr) return next('/login')
  next()
  })
export default router
