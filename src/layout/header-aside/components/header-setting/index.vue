<template>
  <div class="ibps-header-setting">
    <el-tooltip
      :content="$t('navbar.setting')"
      effect="dark"
      placement="bottom"
    >
      <el-button class="btn-text can-hover" type="text" @click="handleClick">
        <ibps-icon name="ellipsis-v" size="18" />
      </el-button>
    </el-tooltip>
    <el-drawer class="ibps-header-setting-drawer" :visible.sync="settingVisible" :title="$t('navbar.setting')" width="30%">
      <el-scrollbar
        style="height: 100%;width:100%;"
        wrap-class="ibps-header-setting-wrapper"
      >
        <div class="panel panel-info">
          <div class="panel-heading">{{ $t('navbar.theme') }}</div>
          <div class="panel-body">
            <el-table :data="themeList" :show-header="false" border>
              <el-table-column width="120">
                <template slot-scope="scope">{{ $t('theme.'+scope.row.name) }}</template>
              </el-table-column>
              <el-table-column width="100">
                <div
                  slot-scope="scope"
                  :style="{'backgroundImage': `url(${$baseUrl}${scope.row.preview})`}"
                  class="theme-preview"
                />
              </el-table-column>
              <el-table-column prop="address" align="center">
                <template slot-scope="scope">
                  <el-button v-if="activeThemeName === scope.row.name" type="success" icon="el-icon-check" round>{{ $t('theme.status.activate') }}</el-button>
                  <el-button v-else round @click="handleSelectTheme(scope.row.name)">{{ $t('theme.status.select') }}</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
        <div class="panel panel-info">
          <div class="panel-heading">
            {{ $t('navbar.color') }}
          </div>
          <div class="panel-body">
            <el-color-picker
              v-model="color"
              :predefine="predefine"
              size="mini"
              @change="handleColorChange"
            />
          </div>
        </div>
        <div class="panel panel-info">
          <div class="panel-heading">{{ $t('navbar.language') }}</div>
          <div class="panel-body">
            <el-radio-group v-model="language">
              <el-radio
                v-for="item in languageList"
                :key="item.value"
                :label="item.value"
              >{{ item.label }}</el-radio>
            </el-radio-group>
          </div>
        </div>
        <div class="panel panel-info">
          <div class="panel-heading">{{ $t('navbar.size') }}</div>
          <div class="panel-body">
            <el-radio-group v-model="size">
              <el-radio
                v-for="item in sizes"
                :key="item"
                :label="item"
              >
                {{ $t('size.'+item) }}
              </el-radio>
            </el-radio-group>

          </div>
        </div>
      </el-scrollbar>
    </el-drawer>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import setting from '@/setting.js'
export default {
  data() {
    return {
      settingVisible: false,
      themeDialogVisible: false,
      languageList: [
        { value: 'zh-CN', label: '简体中文' },
        { value: 'en', label: 'English' }
      ],
      sizes: [
        'default',
        'medium',
        'small',
        'mini'
      ],
      predefine: setting.color.predefine
    }
  },
  computed: {
    ...mapState({
      themeList: state => state.ibps.theme.list,
      activeThemeName: state => state.ibps.theme.activeName,
      sizeValue: state => state.ibps.size.value,
      languageValue: state => state.ibps.language.value,
      colorValue: state => state.ibps.color.value
    }),
    language: {
      get() {
        return this.languageValue || 'zh-CN'
      },
      set(value) {
        this.handleLanguageChange(value)
      }
    },
    size: {
      get() {
        return this.sizeValue || this.$ELEMENT.size
      },
      set(value) {
        this.handleSizeChange(value)
      }
    },
    color: {
      get() {
        return this.colorValue || process.env.VUE_APP_ELEMENT_COLOR
      },
      set(value) {
        this.handleColorChange(value)
      }
    }
  },
  watch: {
    // // 注意 这里是关键
    // // 因为需要访问 this.$ELEMENT 所以只能在这里使用这种方式
    // sizeValue: {
    //   handler(val, oldVal) {
    //     if (val === '') {
    //       return this.handleSizeChange(this.$ELEMENT.size || setting.system.size)
    //     }
    //     if (oldVal) {
    //       // 这个情况在已经加载完页面 用户改变了尺寸时触发
    //       this.$ELEMENT.size = val
    //       // 由于已经加载过设置 需要清空缓存设置
    //       this.pageKeepAliveClean()
    //       // 由于已经加载过设置 需要刷新此页面
    //       this.$router.replace('/refresh')
    //     } else {
    //       // 这个情况在刷新页面时触发
    //       this.$ELEMENT.size = val
    //     }
    //   },
    //   immediate: true
    // },
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
    },
    //
    colorValue: {
      handler(val, oldVal) {
        if (val === '') {
          this.handleColorChange(val)
        }
      },
      immediate: true
    }

  },
  methods: {
    ...mapMutations({
      pageKeepAliveClean: 'ibps/page/keepAliveClean'
    }),
    ...mapActions({
      themeSet: 'ibps/theme/set',
      sizeSet: 'ibps/size/set',
      languageSet: 'ibps/language/set',
      colorSet: 'ibps/color/set'
    }),

    handleClick() {
      this.settingVisible = true
    },
    // -----------------主题---------------
    handleSelectTheme(value) {
      this.themeSet(value)
    },
    // -----------------尺寸---------------
    handleSizeChange(value) {
      this.sizeSet(value)
    },
    // -----------------语言---------------
    handleLanguageChange(value) {
      this.languageSet(value)
    },
    // -----------------颜色---------------
    handleColorChange(value) {
      this.colorSet(value)
    }

  }
}
</script>
<style lang="scss" scoped>
@import '~@/assets/styles/public.scss';
.theme-preview {
  height: 40px;
  width: 80px;
  border-radius: 4px;
  background-size: cover;
  border: 1px solid $color-border-1;
}

</style>
<style lang="scss">
  .ibps-header-setting-drawer{
     .el-drawer__header{
      margin-bottom: 10px;
      padding-bottom: 10px;
      border-bottom: 1px solid #dcdfe6;
    }
    .el-drawer__body{
      padding:5px;
    }

    .ibps-header-setting-wrapper{
      height:  calc(100vh - 65px) !important;
      .panel{
        border: 1px solid #dde7ee
      }
    }
  }
</style>
