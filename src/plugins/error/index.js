import store from '@/store'
import Utils from '@/utils/util'

export default {
  install(Vue, options) {
    Vue.config.errorHandler = function(error, instance, info) {
      Vue.nextTick(() => {
        // store 追加 log
        store.dispatch('ibps/log/push', {
          message: `${info}: ${error.message}`,
          type: 'danger',
          meta: {
            error,
            instance
          }
        })
        // 只在开发模式下打印 log
        if (process.env.NODE_ENV === 'development') {
          Utils.log.capsule('ibps', 'ErrorHandler', 'danger')
          Utils.log.danger('>>>>>> 错误信息 >>>>>>')
          console.log(info)
          Utils.log.danger('>>>>>> Vue 实例 >>>>>>')
          console.log(instance)
          Utils.log.danger('>>>>>> Error >>>>>>')
          console.log(error)
        }
      })
    }
  }
}
