import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/views/login/';
import Home from '@/views/home/';
import Layout from '@/views/layout/';
import Article from '@/views/article/';
import Publish from '@/views/publish/';
import Image from '@/views/image/';


Vue.use(VueRouter)

const routes = [{
    path: '/login',
    name: 'login',
    component: Login
  }, {
    path: '/',
    //有默认子路由，就不要给父路由起名字
    // name: 'layout',
    component: Layout,
    children: [{
        //path为空，会作为默认子路由渲染
        path: '',
        name: 'home',
        component: Home
      }, {
        path: '/article',
        name: 'article',
        component: Article
      },
      {
        path: '/publish',
        name: 'publish',
        component: Publish
      },
      {
        path: '/image',
        name: 'image',
        component: Image
      }
    ]
  },
  /* {
  path: '/home',
  name: 'home',
  component: Home
} */
]

const router = new VueRouter({
  routes
})

//路由导航守卫，所有的页面的导航都会经过这里
router.beforeEach((to, from, next) => {
  // 如果访问的页面不是/login，校验登陆状态
  const user = JSON.parse(window.localStorage.getItem('user'))
  if (to.path !== '/login') {
    if (user) {
      next()
    } else {
      next('/login')
    }
  } else {
    next()
  }
})

export default router
