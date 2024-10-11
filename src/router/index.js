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
      }
    ]
  },


  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/', hidden: true }
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
    path: '/groupLeader',
    component: Layout,
    name: '组长权限',
    meta: { title: '组长权限', icon: 'el-icon-s-help', roles: ['教研组长'] },
    children: [
      {
        path: 'listHonor',
        name: 'listHonor',
        component: () => import('@/views/honor/AuditHonor'),
        meta: { title: '查看学科教师获奖', icon: 'table', roles: ['教研组长'] }
      },
      {
        path: 'listUser',
        name: 'listUser',
        component: () => import('@/views/user/list'),
        meta: { title: '重制密码', icon: 'table',  roles: ['教研组长']  }
      }
    ]
  },
  {
    path: '/head',
    component: Layout,
    name: '主任权限',
    meta: { title: '主任权限', icon: 'el-icon-s-help',  roles: ['教科室主任']},
    alwaysShow: true,
    children: [
      {
        path: 'listHonor',
        name: 'info',
        component: () => import('@/views/honor/AuditHonor'),
        meta: { title: '查看学科教师获奖', icon: 'table', roles: ['教科室主任'] }
      }
    ]
  },
  {
    path: '/admin',
    component: Layout,
    name: '管理员权限',
    meta: { title: '管理员权限', icon: 'el-icon-s-help', roles: ['系统管理员'] },
    alwaysShow: true,
    children: [
      {
        path: 'importUser',
        name: 'importUser',
        component: () => import('@/views/user/import'),
        meta: { title: '导入教师名单', icon: 'table', roles: ['系统管理员'] }
      },
      {
        path: 'listUser',
        name: 'listUser',
        component: () => import('@/views/user/list'),
        meta: { title: '人员管理', icon: 'table', roles: ['系统管理员'] }
      },
      {
        path: 'dictionary',
        name: 'dictionary',
        component: () => import('@/views/dictionary/index'),
        meta: { title: '词条管理', icon: 'table', roles: ['系统管理员'] }
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
