<template>
  <el-tooltip
    content="锁屏"
    effect="dark"
    placement="bottom"
  >
    <el-button class="ibps-mr btn-text can-hover" type="text" @click="lockScreen">
      <ibps-icon name="lock" size="16" />
    </el-button>
  </el-tooltip>
</template>

<script>
import Utils from '@/utils/util'

export default {
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
</script>
