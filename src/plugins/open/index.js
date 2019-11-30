import Utils from '@/utils/util'

export default {
  install(Vue, options) {
    Vue.prototype.$open = Utils.open
  }
}
