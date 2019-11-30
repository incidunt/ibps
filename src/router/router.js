import { getLayout } from '@/layout'
import menuUtil from '@/utils/menu'
// 开发环境不使用懒加载, 因为懒加载页面太多的话会造成webpack热更新太慢, 所以只有生产环境使用懒加载
const _import = require('./_import_' + process.env.NODE_ENV)
const meta = { requiresAuth: true }

/**
 * 错误页面
 */
const errorPage = {
  path: '*',
  redirect: '/404',
  hidden: true
}
const idKey = menuUtil.ID_KEY
const labelKey = menuUtil.LABEL_KEY
const nameKey = menuUtil.NAME_KEY
const iconKey = menuUtil.ICON_KEY
const parentIdKey = menuUtil.PARENT_KEY
const childrenKey = menuUtil.CHILD_KEY
const urlKey = menuUtil.URL_KEY
const layoutKey = 'layout'

// 异步挂载的路由
// 动态需要根据权限加载的路由表 该路由表通过后台获取
export function generateRoutes(menus) {
  const asyncRouterMap = []
  for (const menu of menus) {
    asyncRouterMap.push(generateTopRoute(menu))
  }
  asyncRouterMap.push(errorPage)
  return asyncRouterMap
}

/**
 * 构建第一级路由
 * @param {*} menu
 */
function generateTopRoute(menu) {
  const router = {
    id: menu[idKey],
    parentId: menu[parentIdKey],
    path: '/' + menu[nameKey],
    name: menu[nameKey],
    component: getLayout(menu[layoutKey]),
    meta: {
      title: menu[labelKey],
      icon: menu[iconKey] || 'file-o',
      name: menu[nameKey],
      defaultUrl: menu[urlKey],
      ...meta
    }
  }
  if (menu[childrenKey] && menu[childrenKey].length > 0) {
    router.children = generateSubRoutes(menu[childrenKey])
  } else {
    router.children = [{
      id: menu[idKey],
      parentId: menu[parentIdKey],
      path: 'index',
      name: menu[nameKey],
      component: getComputedUrl(menu[urlKey]),
      meta: {
        title: menu[labelKey],
        icon: menu[iconKey] || 'file-o',
        name: menu[nameKey],
        defaultUrl: menu[urlKey],
        ...meta
      }
    }
    ]
  }
  return router
}

/**
 * 构建子路由
 * @param {*} menus
 */
function generateSubRoutes(menus) {
  const pool = []
  const push = function(menus, namePrefix = []) {
    menus.forEach(menu => {
      const router = {
        id: menu[idKey],
        parentId: menu[parentIdKey],
        path: [...namePrefix, menu[nameKey]].join('/'),
        name: [...namePrefix, menu[nameKey]].join('-'),
        component: getComputedUrl(menu[urlKey]),
        meta: {
          title: menu[labelKey],
          icon: menu[iconKey] || 'file-o',
          name: menu[nameKey],
          defaultUrl: menu[urlKey],
          ...meta
        }
      }

      if (menu[childrenKey] && menu[childrenKey].length > 0) {
        push(menu[childrenKey], [...namePrefix, menu[nameKey]])
      } else {
        pool.push({
          ...router
        })
      }
    })
  }
  push(menus)
  return pool
}

/**
 * 是否是iframe
 * @param {*} url
 */
function isHttp(url) {
  if (url === null || url === undefined || url === '') return false
  return !!(url.indexOf('http') !== -1 || url.indexOf('https') !== -1)
}
/**
 * 获取 组件url
 * @param {*} menu
 */
function getComputedUrl(url) {
  if (!url) return _import('/error/404', 'pages')
  if (isHttp(url)) {
    return _import('/iframe/index', 'pages')
  } else if (url.indexOf('/d/') > -1) { // 数据模版
    return _import('/platform/data/dataTemplate/template-list')
  } else {
    try {
      return _import(convertUrl(url)) || _import('/error/404', 'pages')
    } catch (error) {
    //  console.warn(error)
      return _import('/error/404', 'pages')
    }
  }
}
/**
 * 转换url 避免多余‘/’
 * @param {*} url
 */
function convertUrl(url) {
  const newUrl = '/' + url
  return newUrl === '/' ? '/' : newUrl.replace(/\/\//g, '/').replace(/\/$/, '')
}
