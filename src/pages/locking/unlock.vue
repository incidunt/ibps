
<template>
  <transition name="show-unlock">
    <div v-if="showUnlock" class="unlock-body-con" @keydown.enter="handleUnlock">
      <div :style="{marginLeft: avatarLeft}" class="unlock-avatar-con" @click="handleClickAvatar">
        <img :src="info.avatar" class="unlock-avatar-img">
        <div class="unlock-avatar-cover">
          <span><i class="ibps-icon-unlock" /></span>
          <p>{{ $t('components.lockScreen.unlock') }}</p>
        </div>
      </div>
      <div :style="{marginLeft: avatarLeft}" class="unlock-avatar-under-back" />
      <div class="unlock-input-con">
        <div class="unlock-input-overflow-con">
          <div :style="{right: inputLeft}" class="unlock-overflow-body">
            <input ref="inputEle" v-model="password" :placeholder="$t('components.lockScreen.placeholder')" class="unlock-input" autocomplete="false" type="password">
            <button ref="unlockBtn" class="unlock-btn" @mousedown="unlockMousedown" @mouseup="unlockMouseup" @click="handleUnlock">
              <i class="ibps-icon-key" />
            </button>
          </div>
        </div>
      </div>
      <div class="unlock-locking-tip-con">{{ $t('components.lockScreen.locked') }}</div>
    </div>
  </transition>
</template>

<script>
import { mapState } from 'vuex'
import Utils from '@/utils/util'
import hotkeys from 'hotkeys-js'

export default {
  name: 'unlock',
  props: {
    showUnlock: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      open: false,
      avatarLeft: '0px',
      inputLeft: '400px',
      password: '',
      check: null
    }
  },
  computed: {
    ...mapState('ibps/user', [
      'info'
    ])
  },
  mounted() {
    // 绑定回车功能快捷键
    hotkeys('Enter', event => {
      event.preventDefault()
      this.handleEnter()
    })
  },
  beforeDestroy() {
    hotkeys.unbind('Enter')
  },
  methods: {
    validator() {
      if (this.password === '') { return false }
      return true // TODO 你可以在这里写密码验证方式，如发起ajax请求将用户输入的密码this.password与数据库用户密码对比
    },
    handleEnter() {
      if (this.open) {
        this.handleUnlock()
      } else {
        this.handleClickAvatar()
      }
    },
    handleClickAvatar() {
      this.open = true
      this.avatarLeft = '-180px'
      this.inputLeft = '0px'
      if (this.$refs && this.$refs.inputEle) {
        this.$refs.inputEle.focus()
      }
    },

    handleUnlock() {
      if (this.validator()) {
        this.open = false
        this.avatarLeft = '0px'
        this.inputLeft = '400px'
        this.password = ''
        Utils.cookies.set('locking', 'unlock')
        this.$emit('on-unlock')
      } else {
        this.$message({
          message: this.$t('components.lockScreen.tip'),
          type: 'error'
        })
      }
    },
    unlockMousedown() {
      this.$refs.unlockBtn.className = 'unlock-btn click-unlock-btn'
    },
    unlockMouseup() {
      this.$refs.unlockBtn.className = 'unlock-btn'
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
@import '@/assets/styles/pages/unlock.scss'
</style>
