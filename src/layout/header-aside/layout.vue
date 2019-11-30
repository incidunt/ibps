<template>
  <div
    :style="styleLayoutMainGroup"
    :class="{grayMode: grayActive}"
    class="ibps-layout-header-aside-group hidden-print"
  >
    <!-- 半透明遮罩 -->
    <div class="ibps-layout-header-aside-mask" />
    <!-- websocket -->
    <!-- <ibps-notify-monitor /> -->
    <!-- 主体内容 -->
    <div class="ibps-layout-header-aside-content" flex="dir:top">
      <!-- 顶栏 -->
      <div
        :style="{
          opacity: searchActive ? 0.5 : 1
        }"
        class="ibps-theme-header"
        flex-box="0"
        flex
      >
        <div
          :style="{width: asideCollapse ? asideWidthCollapse : asideWidth}"
          class="logo-group"
          flex-box="0"
        >
          <!--logo-->
          <el-dropdown
            v-if="subsystemList && subsystemList.length >1"
            trigger="click"
            placement="bottom-start"
            @command="command => handleSubsystemClick(command)"
          >
            <ibps-logo :system="system" :aside-collapse="asideCollapse" :subsystem-list="subsystemList" />
            <el-dropdown-menu slot="dropdown" style="width:180px;">
              <el-dropdown-item
                v-for="(item,index) in subsystemList"
                :key="index"
                :disabled="item.id===system.id"
                :command="item"
              >
                {{ item.name }}
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <ibps-logo v-else :system="system" :aside-collapse="asideCollapse" :subsystem-list="subsystemList" />
        </div>
        <div class="toggle-aside-btn" flex-box="0" @click="handleToggleAside">
          <ibps-icon :name="asideCollapse ?'indent':'outdent'" />
        </div>
        <ibps-menu-header flex-box="1" />
        <!-- 顶栏右侧 -->
        <div class="ibps-header-right" flex-box="0">
          <!-- 如果你只想在开发环境显示这个按钮请添加 v-if="$env === 'development'" -->
          <ibps-header-search @click="handleSearchClick" />
          <ibps-header-error-log v-if="$env === 'development'" />
          <ibps-header-message />
          <!-- <ibps-header-download /> -->
          <!-- <ibps-header-locking />
          <ibps-header-theme />
          <ibps-header-language />
          <ibps-header-size /> -->
          <ibps-header-fullscreen />
          <ibps-header-user />
          <ibps-header-setting />
        </div>
      </div>
      <!-- 下面 主体 -->
      <div class="ibps-theme-container" flex-box="1" flex>
        <!-- 主体 侧边栏 -->
        <div
          ref="aside"
          :style="{
            width: asideCollapse ? asideWidthCollapse : asideWidth,
            opacity:searchActive ? 0.5 : 1
          }"
          flex-box="0"
          class="ibps-theme-container-aside"
        >
          <ibps-menu-side />
        </div>
        <!-- 主体 -->
        <div class="ibps-theme-container-main" flex-box="1" flex>
          <!-- 搜索 -->
          <transition name="fade-scale">
            <div v-show="searchActive" class="ibps-theme-container-main-layer" flex>
              <ibps-panel-search
                ref="panelSearch"
                @close="searchPanelClose"
              />
            </div>
          </transition>
          <!-- 内容 -->
          <transition name="fade-scale">
            <div v-show="!searchActive" class="ibps-theme-container-main-layer" flex="dir:top">
              <!-- tab -->
              <div class="ibps-theme-container-main-header" flex-box="0">
                <ibps-tabs />
              </div>
              <!-- 页面 -->
              <div class="ibps-theme-container-main-body" flex-box="1">
                <transition :name="transitionActive ? 'fade-transverse' : ''">
                  <keep-alive :include="keepAlive">
                    <router-view />
                  </keep-alive>
                </transition>
              </div>
            </div>
          </transition>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import IbpsLogo from './components/logo'
import IbpsMenuSide from './components/menu-side'
import IbpsMenuHeader from './components/menu-header'
import IbpsTabs from './components/tabs'
import IbpsHeaderSearch from './components/header-search'

import IbpsHeaderFullscreen from './components/header-fullscreen'
// import IbpsHeaderLocking from './components/header-locking'
// import IbpsHeaderLanguage from './components/header-language'
// import IbpsHeaderSize from './components/header-size'
// import IbpsHeaderTheme from './components/header-theme'
// import IbpsHeaderToolbar from './components/header-toolbar'
import IbpsHeaderSetting from './components/header-setting'
import IbpsHeaderMessage from './components/header-message'
import IbpsHeaderUser from './components/header-user'
import IbpsHeaderErrorLog from './components/header-error-log'
// import IbpsHeaderDownload from './components/header-download'
// import IbpsNotifyMonitor from '@/business/platform/socket/notify-monitor'

import { mapState, mapGetters, mapActions } from 'vuex'
import mixinSearch from './mixins/search'
import mixinLock from './mixins/lock'

export default {
  name: 'ibps-layout-header-aside',
  components: {
    IbpsLogo,
    IbpsMenuSide,
    IbpsMenuHeader,
    IbpsTabs,
    IbpsHeaderSearch,

    IbpsHeaderFullscreen,
    // IbpsHeaderLocking,
    // IbpsHeaderLanguage,
    // IbpsHeaderSize,
    // IbpsHeaderTheme,
    // IbpsHeaderToolbar,
    IbpsHeaderSetting,
    IbpsHeaderMessage,
    IbpsHeaderUser,
    IbpsHeaderErrorLog
    // IbpsHeaderDownload,
    // IbpsNotifyMonitor
  },
  mixins: [
    mixinSearch,
    mixinLock
  ],
  data() {
    return {
      // [侧边栏宽度] 正常状态
      asideWidth: '200px',
      // [侧边栏宽度] 折叠状态
      asideWidthCollapse: '65px'
    }
  },
  computed: {
    ...mapState('ibps', {
      keepAlive: state => state.page.keepAlive,
      grayActive: state => state.gray.active,
      transitionActive: state => state.transition.active,
      asideCollapse: state => state.menu.asideCollapse,
      system: state => state.system.system,
      subsystemList: state => state.system.subsystemList
    }),
    ...mapGetters('ibps', {
      themeActiveSetting: 'theme/activeSetting'
    }),
    /**
     * @description 最外层容器的背景图片样式
     */
    styleLayoutMainGroup() {
      return {
        ...this.themeActiveSetting.backgroundImage ? {
          backgroundImage: `url('${this.$baseUrl}${this.themeActiveSetting.backgroundImage}')`
        } : {}
      }
    },
    logoIconAll() {
      return `${this.$baseUrl}static/images/theme/${this.themeActiveSetting.name}/all.png`
    },
    logoIconOnly() {
      return `${this.$baseUrl}static/images/theme/${this.themeActiveSetting.name}/only.png`
    }
  },
  methods: {
    ...mapActions('ibps/menu', [
      'asideCollapseToggle'
    ]),
    /**
     * 接收点击切换侧边栏的按钮
     */
    handleToggleAside() {
      this.asideCollapseToggle()
    },
    handleSubsystemClick(system) {
      this.$store.dispatch('ibps/system/set', system)
      location.reload() // 为了重新实例化vue-router对象 避免bug
    }
  }
}
</script>

<style lang="scss">
// 注册主题
@import '@/assets/styles/theme/register.scss';
</style>
