// clipboard  剪贴板
import Clipboard from './clipboard'

const install = function(Vue) {
  Vue.directive('clipboard', Clipboard)
}

if (window.Vue) {
  window.clipboard = Clipboard
  window.Vue.use(install)
}

Clipboard.install = install
export default Clipboard
