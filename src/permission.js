/**
 * 路由拦截、鉴权
 * <pre>
 * 作者:hugh zhuang
 * 邮箱:3378340995@qq.com
 * 日期:2015-11-02-下午3:29:34
 * 版权:广州流辰信息技术有限公司
 * </pre>
 */
// 进度条
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

// 帮助类
import Utils from '@/utils/util'
import I18n from '@/utils/i18n'
// 存储
import store from '@/store/index'
// 路由数据
import router from '@/router'
// 验权
import { getToken, getRefreshToken } from '@/utils/auth'

import { MessageBox } from 'element-ui'

// 不重定向白名单
const whiteList = ['/login', '/register', '/forget', '/authredirect']
/**
 * 路由拦截
 * 权限验证
 */
router.beforeEach(async(to, from, next) => {
  // 确认已经加载多标签页数据
  await store.dispatch('ibps/page/isLoaded')
  // 确认已经加载组件尺寸设置
  await store.dispatch('ibps/size/isLoaded')
  // 关闭搜索面板
  store.commit('ibps/search/set', false)
  // 进度条
  NProgress.start()

  const locking = Utils.cookies.get('locking')
  if (locking === 'locked' && to.name !== 'locking') { // 判断当前是否是锁定状态
    next({
      replace: true,
      name: 'locking'
    })
  } else if (locking === 'unlock' && to.name === 'locking') {
    next(false)
  } else {
  // 这里将cookie里是否存有token作为验证是否登录的条件
    const hasToken = getToken()
    if (hasToken && hasToken !== 'undefined') { // 从cookie 获取用户token
      // 登录 锁定 401没权限  403禁止访问
      if (to.name === 'locking' || to.name === 'login' || to.name === 'error401' || to.name === 'error403') {
        next()
      } else {
        // 判断是否有子系统和是否有菜单
        if (Utils.isEmpty(store.getters.system) || Utils.isEmpty(store.getters.menus)) {
          store.dispatch('ibps/user/load').then(res => { // 拉取用户信息,避免刷新用户丢失  //TODO 加载用户和菜单合并应该请求
            const system = store.getters.system
            if (Utils.isEmpty(system) || Utils.isEmpty(system.id)) {
              if (to.name === 'systemSelect') return next()
              return next({ path: '/systemSelect', replace: true })
            }
            store.dispatch('ibps/menu/init', { systemId: system.id }).then(() => { // 根据用户菜单权限生成可访问的路由表
              if (Utils.isEmpty(store.getters.menus)) {
                next({ path: '/403', replace: true, query: { noGoBack: true }})
              } else {
                const addRouters = store.getters.routers
                if (addRouters && addRouters.length > 0) {
                  // 动态添加可访问路由表
                  router.addRoutes(addRouters)
                  // 初始化加载或用户刷新页面后从数据库加载一系列的设置
                  store.dispatch('ibps/account/loadInfo', {
                    addRouters,
                    menus: store.getters.menus
                  })
                  next({ ...to, replace: true }) // hack方法 确保addRoutes已完成
                } else {
                  next({ path: '/403', replace: true, query: { noGoBack: true }})
                }
              }
            }).catch((e) => {
              console.error(e)
              NProgress.done() // 结束Progress
            })
          }).catch((e) => {
            console.error(e)
            NProgress.done() // 结束Progress
            // 前台登出
            store.dispatch('ibps/account/fedLogout').then(() => {
              next({ name: 'login' })
            }).catch((err) => {
              console.error(err)
            })
          })
        } else { // 动态改变权限,判断是否有菜单权限，或者刷新页面
          if (to.matched.length === 0) { // 不能匹配的路由
            return next({ path: '401', replace: true, query: { noGoBack: true }})
          } else {
            next()
          }
        }
      // end
      }
    } else { /* has no token*/
      // 判断refresh tonken是否过期
      const refreshToken = getRefreshToken()
      if (refreshToken && refreshToken !== 'undefined') {
        // 刷新tonken
        await store.dispatch('ibps/account/refreshToken').then(() => {
          next()
        }).catch((err) => {
          console.info(err)
          Utils.cookies.set('redirect', to.fullPath)
          MessageBox.confirm(
            I18n.t('error.logout.message'),
            I18n.t('error.logout.title'), {
              confirmButtonText: I18n.t('error.logout.confirmButtonText'),
              cancelButtonText: I18n.t('error.logout.cancelButtonText'),
              type: 'warning'
            }).then(() => {
            next('/login')// 否则全部重定向到登录页
          }).catch(() => {})
        })
      } else {
        if (whiteList.indexOf(to.path) !== -1) { // 在免登录白名单，直接进入
          next()
        } else {
          // 将当前预计打开的页面完整地址临时存储 登录后继续跳转
          // 这个 cookie(redirect) 会在登录后自动删除
          Utils.cookies.set('redirect', to.fullPath)
          next('/login')// 否则全部重定向到登录页
        }
      }
    }
  }
})

router.afterEach(async({ name, params, query, meta }) => {
  // 进度条
  NProgress.done()
  // 多页控制 打开新的页面
  store.dispatch('ibps/page/open', { name, params, query })
  // 更改标题
  I18n.setTitle(meta.name || name, meta.title)
})
