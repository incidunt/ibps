<template>
  <el-form ref="loginForm" :rules="loginRules" :model="loginForm" class="login-form" status-icon label-width="0">
    <el-form-item prop="phone">
      <el-input v-model="loginForm.phone" :placeholder="$t('login.mobile')" auto-complete="off" prefix-icon="iconfont ibps-icon-mobile" @keyup.enter.native="handleLogin" />
    </el-form-item>
    <el-form-item prop="code">
      <el-input v-model="loginForm.code" :placeholder="$t('login.code')" auto-complete="off" prefix-icon="iconfont ibps-icon-qrcode" @keyup.enter.native="handleLogin">
        <template slot="append"><span :class="[{display:msgKey}]" class="msg-text" @click="handleSend">{{ $t(msgKey?'login.msgScuccess':'login.msgInit',{'time':msgTime}) }}</span></template>
      </el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" class="login-submit" @click.native.prevent="handleLogin">{{ $t('login.logIn') }}</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { validateMobile } from '@/utils/validate'

const MSGTIME = 60 // 时间 60秒
export default {
  name: 'codelogin',
  data() {
    const validatePhone = (rule, value, callback) => {
      const isMobile = validateMobile(value)
      if (!isMobile.result) {
        callback(new Error(this.$t('validate.mobile.' + isMobile.msg)))
      } else {
        callback()
      }
    }
    const validateCode = (rule, value, callback) => {
      if (value.length !== 4) {
        callback(new Error(this.$t('login.codeLength')))
      } else {
        callback()
      }
    }
    return {
      msgTime: MSGTIME,
      msgKey: false,
      loginForm: {
        phone: '',
        code: ''
      },
      loginRules: {
        phone: [{ required: true, trigger: 'blur', validator: validatePhone }],
        code: [{ required: true, trigger: 'blur', validator: validateCode }]
      }
    }
  },
  methods: {
    // 发送验证码
    handleSend() {
      const isMobile = validateMobile(this.loginForm.phone)
      if (!isMobile.result) {
        this.$el[0].focus()
        return
      }
      if (this.msgKey) { return }
      this.msgKey = true
      const time = setInterval(() => {
        this.msgTime--
        if (this.msgTime === 0) {
          this.msgTime = MSGTIME
          this.msgKey = false
          clearInterval(time)
        }
      }, 1000)
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.$store.dispatch('loginByPhone', this.loginForm).then(res => {
            this.loading = false
            this.$router.push({ path: '/' })
          })
        }
      })
    }
  }
}
</script>

<style>
.msg-text {
  display: block;
  width: 60px;
  font-size: 12px;
  text-align: center;
  cursor: pointer;
}
.msg-text.display {
  color: #ccc;
}
</style>
