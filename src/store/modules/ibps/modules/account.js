
import { login, logout, getValidCode, refreshAccessToken, resetPasswd, register } from '@/api/oauth2/user'
// 框架内部路由
import { frameInRoutes, resetRouter } from '@/router'

// 验权
import { getToken, updateToken, removeToken, removeRefreshToken, setUuid, removeUuid } from '@/utils/auth'

export default {
  namespaced: true,
  actions: {
    /**
     *  @description 获取验证码
     *
     */
    getCaptcha() {
      return new Promise((resolve, reject) => {
        getValidCode().then(response => {
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    /**
     * @description 用户名密码登录
     * @param {Object} param context
     * @param {Object} param vm {Object} vue 实例
     * @param {Object} param username {String} 用户账号
     * @param {Object} param password {String} 密码
     * @param {Object} param captcha {String} 验证码
     * @param {Object} param requestId {String} 随机id
     * @param {Object} param route {Object} 登录成功后定向的路由对象
     */
    loginByUsername({
      dispatch
    }, {
      vm,
      form,
      route = {
        path: '/dashboard'
      }
    }) {
      return new Promise(async(resolve, reject) => {
      // 开始请求登录接口
        login(form).then(async response => {
          const data = response.data

          dispatch('updataTokenInfo', data)

          dispatch('ibps/user/setAccount', form.username, { root: true })

          resolve(data)
        }).catch(err => {
          console.log('err: ', err)
          reject(err)
        })
      })
    },
    updataTokenInfo({
      commit,
      dispatch
    }, data) {
      // 设置 cookie 一定要存 uuid 和 token 两个 cookie
      // 整个系统依赖这两个数据进行校验和存储
      // uuid 是用户身份唯一标识 用户注册的时候确定 并且不可改变 不可重复
      // token 代表用户当前登录状态 建议在网络请求中携带 token
      // 如有必要 token 需要定时更新，默认保存一天
      updateToken(data)
      setUuid(data.uid)
    },
    /**
     * 忘记密码
     * @param {*} param context 上下文
     * @param {*} form 表单
     */
    resetPasswd({
      commit,
      dispatch
    }, form) {
      return new Promise(async(resolve, reject) => {
        // 开始请求重置密码接口
        resetPasswd(form).then(response => {
          resolve()
        }).catch(err => {
          console.log('err: ', err)
          reject(err)
        })
      })
    },
    /**
     * 注册帐号
     * @param {*} param context 上下文
     * @param {*} form 表单
     */
    register({
      commit,
      dispatch
    }, form) {
      return new Promise(async(resolve, reject) => {
        // 开始请求注册接口
        register(form).then(response => {
          resolve()
        }).catch(err => {
          console.log('err: ', err)
          reject(err)
        })
      })
    },
    /**
     * @description 注销用户并返回登录页面
     * @param {Object} param context 上下文
     * @param {Object} param vm {Object} vue 实例
     * @param {Object} param confirm {Boolean} 是否需要确认
     */
    logout({
      commit,
      dispatch
    }, {
      vm,
      confirm = false
    }) {
      // 判断是否需要确认
      if (confirm) {
        commit('ibps/gray/set', true, {
          root: true
        })
        vm.$confirm(vm.$t('logout.message'), vm.$t('logout.title'), {
          confirmButtonText: vm.$t('logout.confirmButtonText'),
          cancelButtonText: vm.$t('logout.cancelButtonText'),
          type: 'warning'
        }).then(() => {
          commit('ibps/gray/set', false, {
            root: true
          })
          dispatch('logoff', { vm })
        })
          .catch(() => {
            commit('ibps/gray/set', false, {
              root: true
            })
          })
      } else {
        dispatch('logoff', { vm })
      }
    },
    /**
     * 注销,包含后台登出和前台清除token
     */
    logoff({ dispatch }, { vm }) {
      const token = getToken()
      // 如果token过期直接登出
      if (token === null || token === '') {
        dispatch('fedLogout').then(() => {
          vm.$router.push({
            name: 'login'
          })
        }).catch(() => {})
        return
      }
      // 后台登出
      logout(token).then(() => {
        dispatch('fedLogout').then(() => {
          vm.$router.push({
            name: 'login'
          })
        }).catch(() => {})
      }).catch(() => {
        dispatch('fedLogout').then(() => {
          vm.$router.push({
            name: 'login'
          })
        }).catch(() => {})
      })
    },
    /**
     * 前台登出
     */
    fedLogout({
      commit,
      dispatch
    }, vm) {
      return new Promise(async(resolve, reject) => {
        // 重置路由
        resetRouter()
        // 删除一系列cookie
        removeToken()
        removeUuid()
        removeRefreshToken()
        // 删除用户信息
        dispatch('ibps/user/setAccount', null, { root: true })
        // // 删除子系统
        // dispatch('ibps/system/set', null, { root: true })
        // 删除菜单
        dispatch('ibps/menu/menusSet', null, { root: true })
        resolve(vm)
      })
    },
    /**
     * 刷新token
     * @param {*} param0
     * @param {*} token
     */
    refreshToken({
      commit,
      dispatch
    }) {
      return new Promise(async(resolve, reject) => {
        await refreshAccessToken().then(response => {
          const data = response.data
          // 更新token信息
          updateToken(data)
          resolve(data)
        }).catch(err => {
          console.log('refreshAccessToken-err: ', err)
          removeRefreshToken()
          reject(err)
        })
      })
    },
    /**
     * 加载登录后的信息
     * @param {*} param0
     * @param {*} param1
     */
    loadInfo({
      commit,
      dispatch
    }, {
      addRouters = [],
      menus
    }) {
      return new Promise(async resolve => {
        const routes = [...frameInRoutes, ...addRouters]
        // 处理路由 得到每一级的路由设置
        await commit('ibps/page/init', routes, {
          root: true
        })
        // 初始化菜单搜索功能
        await commit('ibps/search/init', menus, {
          root: true
        })

        await dispatch('load')
      })
    },
    /**
     * @description 用户登录后从持久化数据加载一系列的设置
     * @param {Object} state vuex state
     */
    load({
      commit,
      dispatch
    }) {
      return new Promise(async resolve => {
        // DB -> store 加载用户名
        await dispatch('ibps/user/get', null, {
          root: true
        })
        // DB -> store 加载主题
        await dispatch('ibps/theme/load', null, {
          root: true
        })
        // DB -> store 加载页面过渡效果设置
        await dispatch('ibps/transition/load', null, {
          root: true
        })
        // DB -> store 持久化数据加载上次退出时的多页列表
        await dispatch('ibps/page/openedLoad', null, {
          root: true
        })
        // DB -> store 持久化数据加载这个用户之前设置的侧边栏折叠状态
        await dispatch('ibps/menu/asideCollapseLoad', null, {
          root: true
        })

        // DB -> store 持久化数据加载全局尺寸
        await dispatch('ibps/size/load', null, {
          root: true
        })

        // DB -> store 持久化数据加载全局国际化
        await dispatch('ibps/language/load', null, {
          root: true
        })
        // DB -> store 持久化数据加载颜色设置
        await dispatch('ibps/color/load', null, {
          root: true
        })
        // end
        resolve()
      })
    }
  }
}
