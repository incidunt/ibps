
<template>
  <el-form ref="loginForm" :rules="loginRules" :model="loginForm" class="login-form" status-icon label-width="0">
    <el-form-item prop="username">
      <el-input v-model="loginForm.username" :placeholder="$t('login.username')" tabindex="1" auto-complete="on" prefix-icon="ibps-icon-user" @keyup.enter.native="handleLogin" />
    </el-form-item>

    <el-tooltip v-model="capsTooltip" :content="$t('login.capsTooltip')" placement="right" manual>
      <el-form-item prop="password">
        <el-input
          v-model="loginForm.password"
          :type="passwordType"
          :placeholder="$t('login.password')"
          tabindex="2"
          auto-complete="on"
          prefix-icon="ibps-icon-lock"
          @keyup.native="checkCapslock"
          @blur="capsTooltip = false"
          @keyup.enter.native="handleLogin"
        >
          <i slot="suffix" :class="passwordType==='password'?'ibps-icon-eye-slash':'ibps-icon-eye'" class=" el-input__icon" @click="showPassword" />
        </el-input>
      </el-form-item>
    </el-tooltip>
    <el-form-item v-if="enabledValidCode" prop="captcha">
      <el-row :span="24">
        <el-col :span="15">
          <el-input v-model="loginForm.captcha" :maxlength="code.len" :placeholder="$t('login.code')" tabindex="3" auto-complete="on" prefix-icon="ibps-icon-qrcode" @keyup.enter.native="handleLogin" />
        </el-col>
        <el-col :span="9">
          <div class="login-code">
            <span v-if="code.type === 'text'" class="login-code-img" @click="refreshCode">{{ code.value }}</span>
            <img v-else :src="code.src" class="login-code-img" @click="refreshCode">
          </div>
        </el-col>
      </el-row>
    </el-form-item>
    <el-form-item prop="remember">
      <el-row :span="24">
        <el-col :span="14">
          <el-checkbox v-model="loginForm.remember">{{ $t('login.remember') }}</el-checkbox>
        </el-col>
        <el-col v-if="isRegOpen" :span="10">
          <el-button type="text" class="forget" @click="forget">{{ $t('login.forget') }}</el-button>
          <el-divider direction="vertical" />
          <el-button type="text" class="register" @click="register">{{ $t('login.register') }}</el-button>
        </el-col>
      </el-row>
    </el-form-item>
    <el-form-item>
      <el-button :loading="loading" type="primary" class="login-submit" @click.native.prevent="handleLogin">{{ $t('login.logIn') }}</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { getRegisterOpen } from '@/api/oauth2/user'
const loginForm = process.env.NODE_ENV === 'development'
  ? {
    username: 'admin',
    password: '1',
    captcha: '',
    remember: true,
    requestId: ''
  } : {
    username: '',
    password: '',
    captcha: '',
    remember: true,
    requestId: ''
  }

export default {
  name: 'register-form',
  data() {
    const validateUsername = (rule, value, callback) => {
      if (this.$utils.isEmpty(value)) {
        return callback(new Error(this.$t('login.username')))
      }
      callback()
    }
    const validateMobile = (rule, value, callback) => {
      if (this.$utils.isEmpty(value)) {
        return callback(new Error(this.$t('用户名不能为空')))
      } else {
        const isPhone = /^1(3|4|5|6|7|8|9)\d{9}$/
        if (value.length === 11) {
          if (!isPhone.test(value)) {
            return callback(new Error(this.$t('请输入正确手机号')))
          } else {
            callback()
          }
        } else {
          if (!isPhone.test(value)) {
            return callback(new Error(this.$t('请输入正确手机号')))
          } else {
            return callback(new Error(this.$t('请输入正确手机号长度')))
          }
        }
      }
    }
    // TODO 去后台验证的是否正确
    const validateCode = (rule, value, callback) => {
      callback()
      // if (this.code.value !== value) {
      //   this.loginForm.captcha = ''
      //   // this.loadValidCode(false)
      //   callback(new Error(this.$t('login.codeCorrect')))
      // } else {
      //   callback()
      // }
    }
    return {
      enabledValidCode: false,
      loginForm,
      isRegOpen: false,
      validateMobile: validateMobile,
      code: {
        src: '',
        value: '',
        len: 5,
        type: 'src'
      },
      loginRules: {
        username: [
          { required: true, trigger: 'blur', validator: validateUsername }
        ],
        password: [
          { required: true, message: this.$t('login.password'), trigger: 'blur' },
          { min: 1, message: this.$t('login.passwordCorrect'), trigger: 'blur' }
        ],
        captcha: [
          { required: true, message: this.$t('login.code'), trigger: 'blur' },
          { required: true, trigger: 'blur', validator: validateCode }
        ]

      },
      passwordType: 'password',
      capsTooltip: false,
      loading: false
    }
  },
  watch: {
    isRegOpen: {
      handler: function(val, oldVal) {
        if (val) {
          this.loginRules.username = [{ required: true, trigger: 'blur', validator: this.validateMobile }]
        } else {
          this.loginRules.username = [{ required: true, trigger: 'blur', validator: this.validateUsername }]
        }
      },
      immediate: true
    }
  },
  created() {
    this.initValidCode()
    this.loadValidCode(true)
    this.isRegisterOpen()
  },
  methods: {
    initValidCode() {
      if (this.enabledValidCode) {
        this.loginRules.captcha[0]['required'] = true
        this.loginRules.captcha[1]['required'] = true
      } else {
        this.loginRules.captcha[0]['required'] = false
        this.loginRules.captcha[1]['required'] = false
      }
    },
    isRegisterOpen() {
      getRegisterOpen().then((data) => {
        this.isRegOpen = data.data
      }).catch((e) => {})
    },
    // 获取验证码
    loadValidCode(isBackfill) {
      this.$store.dispatch('ibps/account/getCaptcha').then((data) => {
        // 返回状态501，说明系统没有开启验证码
        if (data.state === 501) {
          this.enabledValidCode = false
        } else {
          this.enabledValidCode = true
          this.code.src = data.data
          this.loginForm.requestId = data.variables.requestId
        }
        this.initValidCode()
        if (isBackfill) {
          this.loginForm.code = this.code.value
        }
      }).catch((e) => {

      })
    },
    refreshCode() {
      this.loadValidCode()
    },
    checkCapslock({ shiftKey, key } = {}) {
      if (key && key.length === 1) {
        if (shiftKey && (key >= 'a' && key <= 'z') || !shiftKey && (key >= 'A' && key <= 'Z')) {
          this.capsTooltip = true
        } else {
          this.capsTooltip = false
        }
      }
      if (key === 'CapsLock' && this.capsTooltip === true) {
        this.capsTooltip = false
      }
    },
    showPassword() {
      this.passwordType === ''
        ? (this.passwordType = 'password')
        : (this.passwordType = '')
    },
    forget() {
      this.$router.replace('/forget')
    },
    register() {
      this.$router.replace('/register')
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          const loading = this.$loading({
            lock: true,
            text: this.$t('common.loading'),
            background: 'rgba(0, 0, 0, 0.7)'
          })
          this.$store.dispatch('ibps/account/loginByUsername', {
            vm: this,
            form: this.loginForm
          }).then(() => {
            // 更新路由 尝试去获取 cookie 里保存的需要重定向的页面完整地址
            const redirect = this.$route.query.redirect
            if (redirect) {
              // 重定向到指定的页面
              this.$router.replace(redirect)
            } else {
              // 重定向到开始路径
              this.$router.replace('/')
            }

            // 延迟10秒关闭遮盖层
            setTimeout(() => {
              this.loading = false
              loading.close()
            }, 1000)
          }).catch((err) => {
            if (err && this.enabledValidCode) {
              this.refreshCode()
            }
            this.loading = false
            loading.close()
          })
        } else {
          this.$message.closeAll()
          this.$message({
            message: this.$t('common.dialog.saveError'),
            type: 'warning'
          })
          return false
        }
      })
    }
  }
}
</script>
