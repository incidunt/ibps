<template>
  <div style="width: 100%;height: 100%;background: #667aa6">
    <div class="unlock-con">
      <unlock :show-unlock="showUnlock" @on-unlock="handleUnlock" />
    </div>
  </div>
</template>

<script>
import unlock from './unlock.vue'
import Utils from '@/utils/util'
export default {
  components: {
    unlock
  },
  data() {
    return {
      showUnlock: false
    }
  },
  mounted() {
    this.showUnlock = true
    if (!document.getElementById('lock_screen_back')) {
      const lockdiv = document.createElement('div')
      lockdiv.setAttribute('id', 'lock_screen_back')
      lockdiv.setAttribute('class', 'lock-screen-back')
      document.body.appendChild(lockdiv)
    }
    const lockScreenBack = document.getElementById('lock_screen_back')
    lockScreenBack.style.zIndex = -1
  },
  methods: {
    handleUnlock() {
      const lockScreenBack = document.getElementById('lock_screen_back')
      this.showUnlock = false
      lockScreenBack.style.zIndex = -1
      lockScreenBack.style.boxShadow = '0 0 0 0 #667aa6 inset'
      const path = Utils.cookies.get('redirect')
      this.$router.push({
        path: path || '/' // 解锁之后跳转到锁屏之前的页面
      })
    }
  }
}
</script>
