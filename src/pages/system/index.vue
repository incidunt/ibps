<template>
  <div class="ibps-login-select-system login-container pull-height">
    <login-info />
    <div class="login-border pull-height">
      <div class="login-main animated fadeIn">
        <div class="login-title-container">
          <h3 class="title"><i class="ibps-icon-logo" />{{ $t('login.title') }}</h3>

        </div>
        <h3><span>{{ $t('login.selectSystem') }}</span></h3>
        <el-table
          :data="subsystemList"
          :show-header="false"
          :empty-text="'当前用户没有权限访问系统，请与管理员联系'"
          border
          size="medium"
          @cell-click="onClick"
        >
          <el-table-column :label="$t('login.selectSystem')">
            <div slot-scope="scope" class="logo-group-icon ibps-ellipsis">
              <i
                :class="'ibps-icon-'+scope.row.logo"
                class="ibps-icon"
              />
              <span class="logo-title">{{ scope.row.name }} </span>
            </div>
          </el-table-column>
        </el-table>
        <br>
        <el-row :span="24">
          <el-col :offset="16" :span="8">
            <el-button
              type="info"
              icon="ibps-icon-sign-out"
              class="login-submit"
              @click.native.prevent="handleLogout"
            >{{ $t('login.logOut') }}</el-button>
          </el-col>
        </el-row>
        <br>
        <login-bottom />
      </div>
    </div>

  </div>
</template>
<script>
import '@/assets/styles/pages/login.scss'

import { mapActions, mapState } from 'vuex'
import LoginInfo from '../login/login-info'
import LoginBottom from '../login/login-bottom'

export default {
  name: 'system-select',
  components: {
    LoginInfo,
    LoginBottom
  },
  computed: {
    ...mapState({
      subsystemList: state => state.ibps.system.subsystemList
    })
  },
  methods: {
    ...mapActions('ibps/account', [
      'logout'
    ]),
    onClick(item) {
      this.$store.dispatch('ibps/system/set', item)
      this.$router.push({ path: '/dashboard' })
    },
    handleLogout() {
      this.logout({
        vm: this,
        confirm: true
      })
    }
  }
}
</script>
<style lang="scss">
  .ibps-login-select-system{
    .el-table__empty-text{
      width: 100%;
    }
  }
</style>
