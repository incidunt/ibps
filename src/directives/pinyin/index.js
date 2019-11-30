import pinyin from './pinyin'

const install = function(Vue) {
  Vue.directive('pinyin', pinyin)
}

if (window.Vue) {
  window['pinyin'] = pinyin
  window.Vue.use(install)
}

pinyin.install = install
export default pinyin
