import { findCurrentUserSubSystem } from '@/api/platform/auth/subsystem'
import Utils from '@/utils/util'

export default {
  namespaced: true,
  state: {
    // 可以多个子系统
    subsystemList: [],
    // 当前使用的子系统
    system: {}

  },
  actions: {
    /**
     * @description 设置子系统
     * @param {Object} state vuex state
     * @param {String} system 系统
     */
    set({ state, dispatch }, system) {
      return new Promise(async resolve => {
        // store 赋值
        state.system = system || {}
        // 持久化
        await dispatch('ibps/db/set', {
          dbName: 'sys',
          path: 'system.current',
          value: system || {},
          user: true
        }, { root: true })
        // end
        resolve()
      })
    },
    /**
     * @description  加载当前子系统，如果子系统多个，需要选择一个
     * @param {*} {Object} state vuex state
     */
    loadSystem({ state, commit, dispatch }) {
      return new Promise(async resolve => {
        state.system = await dispatch('ibps/db/get', {
          dbName: 'sys',
          path: 'system.current',
          defaultValue: {},
          user: true
        }, { root: true })
        if (Utils.isNotEmpty(state.system)) {
          resolve()
        }
        await findCurrentUserSubSystem().then(async res => {
          const systemList = res.data
          await commit('init', systemList)

          // 更新子系统，判断是否有权限
          //  如果子系统只有一个
          if (systemList && systemList.length === 1) {
            await dispatch('set', systemList[0])
          }
          resolve()
        })
      })
    },
    /**
     * @description 从持久化数据读取子系统信息
     * @param {Object} state vuex state
     */
    load({ state, dispatch }) {
      return new Promise(async resolve => {
        // store 赋值
        state.system = await dispatch('ibps/db/get', {
          dbName: 'sys',
          path: 'system.current',
          defaultValue: {},
          user: true
        }, { root: true })
        // end
        resolve()
      })
    }
  },
  mutations: {
    set(state, system) {
      state.system = system
    },
    init(state, subsystemList) {
      state.subsystemList = subsystemList || []
    }
  }
}
