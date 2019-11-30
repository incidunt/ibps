import Vue from 'vue'
import VueRouter from 'vue-router'
import Layout from '@/layout/header-aside'
import CustomLayout from '@/layout/custom-layout'
const meta = { requiresAuth: true }

Vue.use(VueRouter)
/**
 * 在主框架内显示
 */
const frameIn = [
  {
    path: '/',
    redirect: { name: 'dashboard' },
    component: Layout,
    children: [
      {
        path: 'dashboard',
        name: 'dashboard',
        meta: {
          ...meta,
          title: '首页'
        },
        component: () => import('@/pages/dashboard')
      },
      {
        path: 'd/:id(\\w+)',
        component: () => import('@/views/platform/data/dataTemplate/template-list'),
        name: 'dataTemplateList',
        meta: { title: '数据模版' }
      }
    ]
  }

]
/**
 * 在主框架之外显示
 */
const frameOut = [
  // 刷新页面
  {
    path: '/refresh',
    name: 'refresh',
    hidden: true,
    component: {
      beforeRouteEnter(to, from, next) {
        next(vm => vm.$router.replace(from.fullPath))
      },
      render: h => h()
    }
  },
  // 页面重定向
  {
    path: '/redirect/:route*',
    name: 'redirect',
    hidden: true,
    component: {
      beforeRouteEnter(to, from, next) {
        next(vm => vm.$router.replace(JSON.parse(from.params.route)))
      },
      render: h => h()
    }
  },
  {
    path: '/login',
    name: 'login',
    meta: {
      title: '登录'
    },
    component: () => import('@/pages/login')
  },
  {
    path: '/register',
    name: 'register',
    meta: {
      title: '注册账号'
    },
    component: () => import('@/pages/register')
  },
  {
    path: '/forget',
    name: 'forget',
    meta: {
      title: '忘记密码'
    },
    component: () => import('@/pages/forget')
  },
  {
    path: '/systemSelect',
    name: 'systemSelect',
    meta: {
      title: '选择子系统'
    },
    component: () => import('@/pages/system')
  },
  {
    path: '/locking',
    name: 'locking',
    meta: {
      title: '锁屏'
    },
    component: () => import('@/pages/locking')
  },
  {
    path: '/404',
    name: 'error404',
    meta: {
      title: '404-页面不存在'
    },
    hidden: true,
    component: () => import('@/pages/error/404')
  },
  {
    path: '/401',
    name: 'error401',
    meta: {
      title: '401- 未授权'
    },
    hidden: true,
    component: () => import('@/pages/error/401')
  },
  {
    path: '/403',
    name: 'error403',
    meta: {
      title: '403-权限不足'
    },
    hidden: true,
    component: () => import('@/pages/error/403')
  }
]
// 自定义
const frameCustom = [
  {
    path: '/platform',
    name: 'platform',
    component: CustomLayout,
    children: [{
      path: 'bpmn/form',
      name: 'bpmnForm',
      meta: {
        ...meta,
        title: '流程表单'
      },
      component: () => import('@/views/platform/bpmn/form/index')

    }]
  },
  {
    path: '/demo',
    redirect: { name: 'dashboard' },
    component: Layout,
    children: [{
      path: 'query-builder',
      name: 'query-builder',
      meta: {
        ...meta,
        title: '规则条件'
      },
      component: () => import('@/views/demo/components/query-builder')

    }]
  },
  // 无布局头和侧边栏
  {
    path: '/demo',
    component: CustomLayout,
    children: [{
      path: 'crud/list',
      name: 'crud-list',
      meta: {
        title: '列表'
      },
      component: () => import('@/views/demo/crud/list/index')

    },
    {
      path: 'iframe/form',
      name: 'iframe-form',
      meta: {
        title: 'iframe表单'
      },
      component: () => import('@/views/demo/iframe-form/index')
    }
    ]

  }

]

// 重新组织后导出
const constantRouterMap = [
  ...frameIn,
  ...frameOut,
  ...frameCustom
]

// 导出需要显示菜单的
export const frameInRoutes = frameIn

const createRouter = () => new VueRouter({
// mode: 'history', // 后端支持可开 https://router.vuejs.org/zh/guide/essentials/history-mode.html
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

const router = createRouter()

/**
 * 重置Router
 */
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
