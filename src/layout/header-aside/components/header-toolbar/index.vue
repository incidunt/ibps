<template>
  <div class="ibps-header-toolbar">
    <el-dropdown
      size="small"
      @command="command => handleControlItemClick(command)"
    >
      <div>
        <el-button slot="title" class="btn-text can-hover" type="text">
          <ibps-icon name="cog" size="18" />
        </el-button>
      </div>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item command="theme">
          <ibps-icon name="diamond" class="ibps-mr-10" />
          {{ $t('navbar.theme') }}
        </el-dropdown-item>
        <el-dropdown-item command="size">
          <el-popover
            v-model="sizeVisible"
            trigger="hover"
            placement="left"
            width="80"
            popper-class="ibps-header-toolbar-popper"
          >
            <div class="ibps-menu-list">
              <div
                v-for="size in sizes"
                :key="size"
                :class="{'is-disabled':sizeValue===size}"
                class="ibps-menu-item"
                flex="cross:center main:center"
                @click="handleSizeChange(size)"
              >
                <ibps-icon :name="sizeIconName(size)" class="ibps-mr-5" />
                <div class="ibps-menu-item-label" flex-box="1">   {{ $t('size.'+size) }} </div>
              </div>
            </div>
            <span slot="reference">
              <ibps-icon name="font" class="ibps-mr-10" />
              {{ $t('navbar.size') }}
            </span>
          </el-popover>

        </el-dropdown-item>
        <el-dropdown-item command="language">
          <el-popover
            v-model="languageVisible"
            trigger="hover"
            placement="left"
            width="80"
            popper-class="ibps-header-toolbar-popper"
          >
            <div class="ibps-menu-list">
              <div
                :class="{
                  'is-disabled':languageValue==='zh-CN'
                }"
                class="ibps-menu-item"
                flex="cross:center main:center"
                @click="handleLanguageChange('zh-CN')"
              >
                <ibps-icon :name="languageIconName('zh-CN')" class="ibps-mr-5" />
                <div class="ibps-menu-item-label" flex-box="1">中文</div>
              </div>
              <div
                :class="{
                  'is-disabled':languageValue==='en'
                }"
                class="ibps-menu-item"
                flex="cross:center main:center"
                @click="handleLanguageChange('en')"
              >
                <ibps-icon :name="languageIconName('en')" class="ibps-mr-5" />
                <div class="ibps-menu-item-label" flex-box="1">English</div>
              </div>
            </div>
            <span slot="reference">
              <ibps-icon name="language" class="ibps-mr-10" />
              {{ $t('navbar.language') }}
            </span>
          </el-popover>
        </el-dropdown-item>

        <el-dropdown-item command="locking" divided>
          <ibps-icon name="lock" class="ibps-mr-10" />
          {{ $t('navbar.lockScreen') }}
        </el-dropdown-item>
        <el-dropdown-item command="fullscreen">
          <ibps-icon :name="fullscreenActive ?'compress':'arrows-alt'" class="ibps-mr-10" />
          {{ fullscreenActive ? $t('navbar.exitFullscreen'): $t('navbar.fullscreen') }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <el-dialog
      :visible.sync="themeDialogVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :title="$t('navbar.theme')"
      append-to-body
      width="600px"
    >
      <ibps-theme-list style="margin-top: -25px;" />
    </el-dialog>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import setting from '@/setting.js'
import IbpsThemeList from '../header-theme/components/ibps-theme-list'

export default {
  components: {
    IbpsThemeList
  },
  data() {
    return {
      themeDialogVisible: false,
      sizeVisible: false,
      languageVisible: false,
      sizes: [
        'default', 'medium', 'small', 'mini'
      ]
    }
  },
  computed: mapState({
    sizeValue: state => state.ibps.size.value,
    languageValue: state => state.ibps.language.value,
    fullscreenActive: state => state.ibps.fullscreen.active
  }),
  watch: {
    // 注意 这里是关键
    // 因为需要访问 this.$ELEMENT 所以只能在这里使用这种方式
    sizeValue: {
      handler(val, oldVal) {
        if (val === '') {
          return this.handleSiszChange(this.$ELEMENT.size || setting.system.size)
        }
        if (oldVal) {
          // 这个情况在已经加载完页面 用户改变了尺寸时触发
          this.$ELEMENT.size = val
          // 由于已经加载过设置 需要清空缓存设置
          this.pageKeepAliveClean()
          // 由于已经加载过设置 需要刷新此页面
          this.$router.replace('/refresh')
        } else {
          // 这个情况在刷新页面时触发
          this.$ELEMENT.size = val
        }
      },
      immediate: true
    },
    // 因为需要访问 this.$i18n 所以只能在这里使用这种方式
    languageValue: {
      handler(val, oldVal) {
        if (val === '') {
          return this.handleLanguageChange(this.$i18n.locale || setting.system.language)
        }
        if (oldVal) {
          // 这个情况在已经加载完页面 用户改变了国际化时触发
          this.$i18n.locale = val
          // 由于已经加载过设置 需要清空缓存设置
          this.pageKeepAliveClean()
          // 由于已经加载过设置 需要刷新此页面
          this.$router.replace('/refresh')
        } else {
          // 这个情况在刷新页面时触发
          this.$i18n.locale = val
        }
      },
      immediate: true
    }
  },
  methods: {
    handleControlItemClick(command) {
      switch (command) {
        case 'theme':// 主题
          this.themeDialogVisible = true
          break
        case 'locking':// 锁屏
          this.lockScreen()
          break
        case 'fullscreen':// 全屏
          this.fullScreen()
          break
      }
    },
    lockScreen() {
      this.$utils.cookies.set('redirect', this.$route.fullPath) // 本地存储锁屏之前打开的页面以便解锁后打开
      this.$utils.cookies.set('locking', 'locked')
      setTimeout(() => {
        this.$router.push({
          path: '/locking'
        })
      }, 800)
    },
    ...mapMutations({
      pageKeepAliveClean: 'ibps/page/keepAliveClean'
    }),
    ...mapActions({
      sizeSet: 'ibps/size/set',
      languageSet: 'ibps/language/set',
      fullscreenToggle: 'ibps/fullscreen/toggle'
    }),
    // //-----------------尺寸
    handleSizeChange(value) {
      this.sizeVisible = false
      this.sizeSet(value)
    },
    sizeIconName(name) {
      return name === this.sizeValue ? 'dot-circle-o' : 'circle-o'
    },
    // //-----------------语言
    handleLanguageChange(value) {
      this.languageVisible = false
      this.languageSet(value)
    },
    languageIconName(name) {
      return name === this.languageValue ? 'dot-circle-o' : 'circle-o'
    },
    fullScreen() {
      this.fullscreenToggle()
    }

  }
}
</script>
<style lang="scss">
.ibps-header-toolbar-popper{
   padding: 5px;
   min-width: 80px;
  .ibps-menu-list {
    .ibps-menu-item {
      padding: 5px;
      margin: 0;
      font-size: 14px;
      color: #606266;
      cursor: pointer;
      &.is-disabled {
        cursor: default;
        color: #bbb;
        pointer-events: none;
      }
      &:hover {
        background: #ecf5ff;
        color: #66b1ff;
      }
      .ibps-menu-item-label {
        margin-left: 10px;
      }

    }
  }
}

</style>

