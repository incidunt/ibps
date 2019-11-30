<template>
  <div class="login-container pull-height" @keyup.enter.native="handleLogin">
    <login-info />
    <div class="login-border pull-height">
      <div class="login-main animated fadeIn">
        <div class="login-title-container">
          <h3 class="title"><i class="ibps-icon-logo" />{{ $t('login.title') }}</h3>

        </div>
        <h3><span>{{ $t('login.userLogin') }}</span></h3>
        <user-login />
        <!-- <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane :label="$t('login.method.userPassword')" name="user">
            <user-login />
          </el-tab-pane>
          <el-tab-pane :label="$t('login.method.smsCode')" name="code">
            <code-login />
          </el-tab-pane>
          <el-tab-pane :label="$t('login.method.thirdparty')" name="third">
            <third-login />
          </el-tab-pane>
        </el-tabs> -->
        <login-bottom />
      </div>
    </div>

  </div>
</template>
<script>
import '@/assets/styles/pages/login.scss'
import LoginInfo from './login-info'
import LoginBottom from './login-bottom'
import UserLogin from './user-login'
// import codeLogin from './code-login'
// import thirdLogin from './third-login'

export default {
  name: 'login',
  components: {
    LoginInfo,
    LoginBottom,
    UserLogin
  },
  data() {
    return {
      activeName: 'user'
    }
  },
  methods: {
    handleClick() { }
  }
}
</script>
