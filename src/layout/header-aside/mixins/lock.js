import Utils from '@/utils/util'
import hotkeys from 'hotkeys-js'
import setting from '@/setting.js'

export default {
  mounted() {
    // 绑定锁屏快捷键
    hotkeys(setting.hotkey.lock.open, event => {
      event.preventDefault()
      this.lockScreen()
    })
  },
  beforeDestroy() {
    hotkeys.unbind(setting.hotkey.lock.open)
  },
  methods: {
    lockScreen() {
      Utils.cookies.set('redirect', this.$route.fullPath) // 本地存储锁屏之前打开的页面以便解锁后打开
      Utils.cookies.set('locking', 'locked')
      setTimeout(() => {
        this.$router.push({
          path: '/locking'
        })
      }, 800)
    }
  }
}
