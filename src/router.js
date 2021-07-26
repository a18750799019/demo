import Vue from 'vue'
import Router from 'vue-router'
import NProgress from 'nprogress'
import { localStorageSetting } from '@/util/ds.common'
Vue.use(Router)

let router = new Router({
  // mode:"history",
  routes: [
    {
      path: '/',
      name: 'blank',
      component: () => import('@/layouts/Default/Default.vue'),
      children: [
        {
          path: '/home',
          name: 'home',
          component: () => import('./views/Home'),
          children: [
            {
              path: '/test',
              name: 'test',
              component: () => import('./views/Main/Test.vue')
            },
            {
              path: '/main',
              name: 'main',
              component: () => import('./views/Main/main.vue')
            },
            {
              path: '/sysconf',
              name: 'sysconf',
              component: () => import('./views/sysConf/sysconf.vue')
            },
            {
              path: '/sysconf2',
              name: 'sysconf2',
              component: () => import('./views/sysConf/sysconf.new.vue')
            }
          ]
        },
        {
          path: '/',
          redirect: 'login'
        }
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('./views/Login/Login.vue')
    },
    {
      path: '*',
      name: 'notFound',
      component: () => import('./_sys_components/404.vue')
    }
  ]
})

/** 处理路由会重复添加的问题 */
const routerPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return routerPush.call(this, location).catch(error => error)
}

// router.beforeEach((route, redirect, next) => {
//   NProgress.start()
//   //权限判断
//   if (localStorageSetting("userid")) {
//   if(route.path == "/login" || route.path == "/") next("/home")
//   else next()
// } else {
//   if(route.path == "/login" || route.path == "/") next()
//   else next("/login")
// }
// })

router.afterEach(() => {
  NProgress.done()
})

export default router
