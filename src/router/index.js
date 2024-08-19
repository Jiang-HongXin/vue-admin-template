import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '个人基本信息', icon: 'dashboard' }
    }]
  },

  {
    path: '/honor',
    component: Layout,
    alwaysShow: true,
    redirect: '/honor/listHonor',
    meta: { title: '荣誉管理', icon: 'el-icon-s-help' },
    children: [
      {
        path: 'listHonor',
        name: 'Form',
        component: () => import('@/views/honor/listHonor'),
        meta: { title: '查看荣誉', icon: 'table' }
      },
      {
        path: 'addHonor',
        name: 'Form',
        component: () => import('@/views/honor/AddHonor'),
        meta: { title: '增加荣誉', icon: 'form' }
      },
    ]
  },


  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]



const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

let router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router



/**
 * 权限路由
 * @returns {VueRouter}
 */
export const asyncRoutes = [
  {
    path: '/user',
    component: Layout,
    redirect: '/example/table',
    name: '用户信息',
    meta: { title: '用户信息', icon: 'el-icon-s-help' },
    children: [
      {
        path: 'info',
        name: 'info',
        component: () => import('@/views/user/info'),
        meta: { title: '个人信息', icon: 'form' }
      },
      {
        path: 'list',
        name: 'list',
        component: () => import('@/views/user/list'),
        meta: { title: '用户列表', icon: 'table',  roles: ['系统管理员']  }
      }
    ]
  }
]

export function addRoutes(role) {
  let newRoutes = filterAsyncRoutes(asyncRoutes, role);
  router.options.routes = constantRoutes.concat(newRoutes)
  router.addRoutes(newRoutes)
}
function hasPermission(route, role) {
  if (route.meta && route.meta.roles) {
    return route.meta.roles.includes(role)
  } else {
    return true
  }
}
function filterAsyncRoutes(routes, role) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(tmp, role)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, role)
      }
      res.push(tmp)
    }
  })

  return res
}
