import { getUserInfo, switchUser, exitSwitchUser, getRegisterOpen } from '@/api/oauth2/user'
import { getToken } from '@/utils/auth'
// 框架内部路由
import { resetRouter } from '@/router'

import Utils from '@/utils/util'

export default {
  namespaced: true,
  state: {
    // 用户信息,包含用户、组织等信息
    info: {},
    // 帐号
    account: '',
    // 切换的账号
    switchAccount: '',
    regOpen: false
  },
  actions: {
    /**
     * @description 设置用户数据
     * @param {Object} state vuex state
     * @param {*} info info
     */
    set({ state, dispatch }, info) {
      return new Promise(async resolve => {
        // store 赋值
        state.info = info
        // 持久化
        await dispatch('ibps/db/set', {
          dbName: 'sys',
          path: 'user.info',
          value: info,
          user: true
        }, { root: true })
        // end
        resolve()
      })
    },
    /**
     * @description 从数据库取用户数据
     * @param {Object} state vuex state
     */
    get({ state, dispatch }) {
      return new Promise(async resolve => {
        // store 赋值
        state.info = await dispatch('ibps/db/get', {
          dbName: 'sys',
          path: 'user.info',
          defaultValue: {},
          user: true
        }, { root: true })
        // end
        resolve()
      })
    },
    load({
      state,
      dispatch
    }) {
      // 设置 vuex 用户信息
      return new Promise(async(resolve, reject) => {
        await dispatch('getAccount')
        // 获取切换用户账号
        await dispatch('getSwitchAccount')
        await dispatch('getRegister')
        getUserInfo(state.account).then(async response => {
          if (!response) { reject() }
          const info = response.data
          // 设置当前
          await dispatch('ibps/user/set', info, {
            root: true
          })
          // 获取当前子系统
          await dispatch('ibps/system/loadSystem', null, {
            root: true
          })
          resolve(info)
        }).catch(error => {
          reject(error)
        })
      })
    },
    /**
     * 获取用户名
     * @param {*} param0
     */
    getAccount({ state, dispatch }) {
      return new Promise(async resolve => {
        // store 赋值
        state.account = await dispatch('ibps/db/get', {
          dbName: 'sys',
          path: 'account',
          defaultValue: '',
          user: true
        }, { root: true })
        // end
        resolve()
      })
    },
    setAccount({
      state,
      dispatch
    }, account) {
      return new Promise(async resolve => {
        // store 赋值
        state.account = account
        // 持久化
        await dispatch('ibps/db/set', {
          dbName: 'sys',
          path: 'account',
          value: account,
          user: true
        }, { root: true })
        // end
        resolve()
      })
    },
    /**
     * 获取切换用户账号
     * @param {*} param0
     */
    getSwitchAccount({ state, dispatch }) {
      return new Promise(async resolve => {
        // store 赋值
        state.switchAccount = await dispatch('ibps/db/get', {
          dbName: 'sys',
          path: 'switchAccount',
          defaultValue: '',
          user: true
        }, { root: true })
        // end
        resolve()
      })
    },
    /**
     * 设置切换用户账号
     * @param {*} param0
     * @param {*} switchAccount
     */
    setSwitchAccount({
      state,
      dispatch
    }, switchAccount) {
      return new Promise(async resolve => {
        // store 赋值
        state.switchAccount = switchAccount
        // 持久化
        await dispatch('ibps/db/set', {
          dbName: 'sys',
          path: 'switchAccount',
          value: switchAccount,
          user: true
        }, { root: true })
        // end
        resolve()
      })
    },
    /**
     * 切换用户
     * @param {*} param0
     * @param {*} username
     */
    switchUser({
      state,
      dispatch
    }, username) {
      return new Promise(async(resolve, reject) => {
        const switchAccount = state.account
        let token = getToken()
        if (Utils.isEmpty(token)) {
          await dispatch('ibps/account/refreshToken', null, { root: true })
          token = getToken()
          if (Utils.isEmpty(token)) {
            reject()
            return
          }
        }

        await switchUser({
          username: username,
          token: token
        }).then(async response => {
          const data = response.data
          // 更新token信息
          await dispatch('ibps/account/updataTokenInfo', data, { root: true })
          // 更新用户信息
          await dispatch('setAccount', username)
          // 更新切换用户信息
          await dispatch('setSwitchAccount', switchAccount)
          // 清除子系统
          // await dispatch('ibps/system/set', null, { root: true })
          //  清除菜单
          await dispatch('ibps/menu/menusSet', null, { root: true })
          // 重置路由
          resetRouter()
          resolve(data)
        }).catch(err => {
          console.log('switchUser-err: ', err)
          reject(err)
        })
      })
    },
    /**
     * 退出切换
     * @param {*} param0
     */
    exitSwitchUser({
      state,
      dispatch
    }) {
      return new Promise(async(resolve, reject) => {
        const account = state.account
        const switchAccount = state.switchAccount
        let token = getToken()
        if (Utils.isEmpty(token)) {
          await dispatch('ibps/account/refreshToken', null, { root: true })
          token = getToken()
          if (Utils.isEmpty(token)) {
            reject()
            return
          }
        }
        await exitSwitchUser({
          username: account,
          token: token
        }).then(async response => {
          const data = response.data
          // 更新token信息
          await dispatch('ibps/account/updataTokenInfo', data, { root: true })
          // 更新用户信息
          await dispatch('setAccount', switchAccount)
          // 更新切换用户信息
          await dispatch('setSwitchAccount', '')
          // 清除子系统
          // await dispatch('ibps/system/set', null, { root: true })
          //  清除菜单
          await dispatch('ibps/menu/menusSet', null, { root: true })
          // 重置路由
          resetRouter()
          resolve(data)
        }).catch(err => {
          console.log('refreshAccessToken-err: ', err)
          reject(err)
        })
      })
    },
    getRegister({
      state
    }) {
      return new Promise(async(resolve, reject) => {
        await getRegisterOpen().then(async response => {
          const regOpen = response.data
          state.regOpen = regOpen
          resolve(regOpen)
        }).catch(err => {
          console.log('getRegisterInfo:', err)
          reject(err)
        })
      })
    }

  }
}

