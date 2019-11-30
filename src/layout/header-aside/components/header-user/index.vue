<template>
  <div class="ibps-layout-header-user">
    <el-dropdown
      size="small"
      @command="command => handleControlItemClick(command)"
      @visible-change="visible =>dropdownVisible=visible"
    >
      <div>
        <el-avatar
          :src="avatar"
          :text="userName"
          shape="square"
          style="background: none;float: left;"
          @error="errorImageHandler"
        >
          <img :src="errorImage">
        </el-avatar>
        <span class="user-name-span">
          {{ $t('navbar.welcome') }}
          <div class="user-name-title">{{ userName }}</div>
        </span>
        <i
          class="user-dropdown"
          :class="{
            'el-icon-arrow-down':!dropdownVisible,
            'el-icon-arrow-up':dropdownVisible
          }"
          style="position: absolute;right: -15px;top: 15px;"
        />
      </div>
      <el-dropdown-menu slot="dropdown" class="user-dropdown">
        <!-- <el-dropdown-item command="dashboard">
          <ibps-icon name="home" class="ibps-mr-10" />
          {{ $t('navbar.dashboard') }}
        </el-dropdown-item> -->
        <el-dropdown-item v-if="!regOpen" command="userInfo">
          <ibps-icon name="user" class="ibps-mr-10" />
          {{ $t('navbar.userInfo') }}
        </el-dropdown-item>
        <el-dropdown-item command="changePassword">
          <ibps-icon name="lock" class="ibps-mr-10" />
          {{ $t('navbar.changePassword') }}
        </el-dropdown-item>

        <el-dropdown-item v-if="$utils.isNotEmpty(switchAccount)" command="exitSwitchUser">
          <ibps-icon name="reply" class="ibps-mr-10" />
          {{ $t('navbar.exitSwitchUser') }}
        </el-dropdown-item>

        <el-dropdown-item divided command="logout">
          <ibps-icon name="sign-out" class="ibps-mr-10" />
          {{ $t('navbar.logOut') }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>

    <change-password
      :ids="userId"
      :reg-open="regOpen"
      :visible="changePasswordVisible"
      :title=" $t('navbar.changePassword') "
      @close="visible => changePasswordVisible = visible"
    />
    <user-info
      :id="userId"
      :visible="userInfoVisible"
      :title=" $t('navbar.userInfo') "
      readonly
      @close="visible => userInfoVisible = visible"
    />
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import { getFile } from '@/utils/avatar'
import setting from '@/setting.js'
import ChangePassword from '@/views/platform/org/employee/change-password'
import UserInfo from '@/views/platform/org/employee/edit'

export default {
  components: {
    ChangePassword,
    UserInfo
  },
  data() {
    return {
      dropdownVisible: false,
      changePasswordVisible: false,
      userInfoVisible: false
    }
  },
  computed: {
    ...mapState('ibps/user', [
      'info',
      'switchAccount'
    ]),
    userId() {
      return this.info && this.info.employee ? this.info.employee.id : this.info.user && this.info.user.id ? this.info.user.id : ''
    },
    avatar() {
      const photo = this.info && this.info.employee ? this.info.employee.photo : null
      if (this.$utils.isEmpty(photo)) {
        return this.errorImage
      }
      return getFile(photo)
    },
    errorImage() {
      return this.$baseUrl + setting.userInfo.user.photo
    },
    userName() {
      return this.info && this.info.user ? this.info.user.fullname : ''
    },
    regOpen() {
      return this.$store.getters.regOpen
    }
  },
  methods: {
    ...mapMutations({
      pageKeepAliveClean: 'ibps/page/keepAliveClean'
    }),
    ...mapActions({
      logout: 'ibps/account/logout',
      exitSwitchUser: 'ibps/user/exitSwitchUser'
    }),
    handleControlItemClick(command) {
      switch (command) {
        case 'dashboard':// 主页
          this.$router.push({ path: '/' })
          break
        case 'userInfo':// 个人信息
          this.userInfo()
          break
        case 'changePassword':// 修改密码
          this.changePassword()
          break
        case 'exitSwitchUser':// 切换用户
          this.handleExitSwitchUser()
          break
        case 'logout':// 登出
          this.logOff()
          break
      }
    },
    /**
     * @description 登出
     */
    logOff() {
      this.logout({
        vm: this,
        confirm: true
      })
    },
    changePassword() {
      this.changePasswordVisible = true
    },
    userInfo() {
      this.userInfoVisible = true
    },
    errorImageHandler() {
      return false
    },
    handleExitSwitchUser() {
      this.exitSwitchUser().then(() => {
        this.$message.closeAll()
        this.$message.success('退出用户成功!')
        // 由于已经加载过设置 需要清空缓存设置
        this.pageKeepAliveClean()
        // 由于已经加载过设置 需要刷新此页面
        this.$router.replace('/refresh')
      })
    }
  }
}
</script>

