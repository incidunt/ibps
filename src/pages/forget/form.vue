<template>
  <el-form ref="loginForm" :rules="loginRules" :model="loginForm" class="login-form" status-icon label-width="0">
    <el-form-item prop="mobile">
      <el-input v-model="loginForm.mobile" :placeholder="$t('login.mobile')" auto-complete="off" prefix-icon="iconfont ibps-icon-mobile" @keyup.enter.native="handleForget" />
    </el-form-item>
    <el-form-item prop="passWd">
      <el-input v-model="loginForm.passWd" :type="passwordType" :placeholder="$t('login.password')" prefix-icon="ibps-icon-lock" auto-complete="off" @keyup.enter.native="handleForget">
        <i slot="suffix" :class="passwordType=='password'?'ibps-icon-eye-slash':'ibps-icon-eye'" class=" el-input__icon" @click="showPassword" />
      </el-input>
    </el-form-item>
    <el-form-item prop="validCode">
      <el-input v-model="loginForm.validCode" :placeholder="$t('login.code')" auto-complete="off" prefix-icon="iconfont ibps-icon-qrcode" @keyup.enter.native="handleForget">
        <template slot="append"><span :class="[{display:msgKey}]" class="msg-text" @click="handleSend">{{ $t(msgKey?'login.msgScuccess':'login.msgInit',{'time':msgTime}) }}</span></template>
      </el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" class="login-submit" @click.native.prevent="handleForget">{{ $t('login.resetPassword') }}</el-button>
    </el-form-item>
    <el-form-item>
      <el-button plain class="login-submit" @click.native.prevent="handleLogin">{{ $t('login.backLogin') }}</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { validateMobile } from '@/utils/validate'
import { sendSms } from '@/api/oauth2/user'

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
      if (value.length !== 6) {
        callback(new Error(this.$t('login.codeLength')))
      } else {
        callback()
      }
    }
    return {
      msgTime: MSGTIME,
      msgKey: false,
      passwordType: 'password',
      loginForm: {
        mobile: '',
        passWd: '',
        validCode: ''
      },
      loginRules: {
        mobile: [{ required: true, trigger: 'blur', validator: validatePhone }],
        passWd: [{ required: true, message: this.$t('validate.required') }],
        validCode: [{ required: true, trigger: 'blur', validator: validateCode }]
      }
    }
  },
  methods: {
    showPassword() {
      this.passwordType === ''
        ? (this.passwordType = 'password')
        : (this.passwordType = '')
    },
    // 发送验证码
    handleSend() {
      const isMobile = validateMobile(this.loginForm.mobile)
      if (!isMobile.result) {
        this.$message.closeAll()
        this.$message.error(this.$t('login.mobileCorrect'))
        this.$el[0].focus()
        return
      }

      // 真正发送验证码
      sendSms({
        mobile: this.loginForm.mobile,
        forget: true
      }).then((data) => {
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
      }).catch((e) => {

      })
    },
    handleForget() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.$store.dispatch('ibps/account/resetPasswd', this.loginForm).then(res => {
            this.$confirm('重置密码成功', '提示', {
              confirmButtonText: '重新登录',
              cancelButtonText: '取消',
              type: 'success'
            }).then(() => {
              this.$router.push({ path: '/login' })
            }).catch(() => {
            })
          })
        }
      })
    },
    handleLogin() {
      this.$router.push({ path: '/login' })
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
