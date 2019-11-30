export default {
  namespaced: true,
  state: {
    // 是否有新消息推送
    hasNew: false
  },
  actions: {
    /**
     * @description 设置新消息推送状态
     * @param {Object} state vuex state
     * @param {Boolean} new 新的状态
     */
    set({ state, dispatch }, hasNew) {
      return new Promise(async resolve => {
        // store 赋值
        state.hasNew = hasNew
        // 持久化
        await dispatch('ibps/db/set', {
          dbName: 'sys',
          path: 'message.hasNew',
          value: state.hasNew,
          user: true
        }, { root: true })
        // end
        resolve()
      })
    },
    /**
     * 从数据库读取新消息推送状态设置
     * @param {Object} state vuex state
     */
    load({ state, dispatch }) {
      return new Promise(async resolve => {
        // store 赋值
        state.active = await dispatch('ibps/db/get', {
          dbName: 'sys',
          path: 'message.hasNew',
          defaultValue: false,
          user: true
        }, { root: true })
        // end
        resolve()
      })
    }
  }
}
