<template>
  <ibps-container
    ref="dashboardContainer"
    v-loading="loading"
    :element-loading-text="$t('common.loading')"
    :scroll-delay="scrollDelay"
    type="full"
    @scroll="({x, y}) => { scrollTop = y }"
  >
    <template slot="header">
      <el-button type="primary" icon="ibps-icon-save" @click="handleSave()">保存</el-button>
      <el-button icon="ibps-icon-add" @click="handleAdd()">添加栏目</el-button>
      <el-button type="danger" icon="ibps-icon-undo" @click="handleReset()">重置</el-button>
      <el-button type="info" icon="ibps-icon-undo" @click="handleRestoreDefault()">还原默认</el-button>
    </template>
    <desktop-layout
      :data="layout"
      :ectypal="ectypal"
      :empty-text="emptyText"
      :visible="addColumnVisible"
      @init="loadData"
      @close="visible => addColumnVisible =visible"
      @change="changeLayout"
    />
  </ibps-container>
</template>

<script>
import DesktopLayout from './layout'
import { getMyLayout, save, remove } from '@/api/platform/desktop/myLayout'

export default {
  components: {
    DesktopLayout
  },
  data() {
    return {
      emptyText: '未设置个人桌面布局，请添加栏目，否则按默认布局设置您的首页。',
      scrollDelay: 0,
      scrollTop: 0,
      loading: false,
      layout: [],
      ectypal: [],
      addColumnVisible: false,
      defaultForm: {},
      desktopMyLayout: {
        id: '',
        sysAlias: '',
        templateHtml: ''
      }
    }
  },
  created() {
    this.defaultForm = JSON.parse(JSON.stringify(this.desktopMyLayout))
  },
  methods: {
    loadData() {
      this.loading = true
      const systemAlias = this.$store.getters.system ? this.$store.getters.system.alias : ''
      getMyLayout({
        systemAlias: systemAlias
      }).then(response => {
        this.desktopMyLayout = response.data || JSON.parse(JSON.stringify(this.defaultForm))
        if (this.$utils.isNotEmpty(this.desktopMyLayout.templateHtml)) {
          try {
            this.ectypal = this.layout = this.$utils.parseData(this.desktopMyLayout.templateHtml)
          } catch (error) {
            console.error(error)
            this.ectypal = this.layout = []
          }
        }
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    handleAdd() {
      this.addColumnVisible = true
    },
    changeLayout(data) {
      this.layout = data
    },
    handleReset() {
      this.loadData()
    },
    handleRestoreDefault() {
      const id = this.desktopMyLayout.id
      if (this.$utils.isEmpty(id)) {
        this.$message({
          message: '还原默认成功',
          type: 'success'
        })
        this.layout = []
        return
      }
      remove({
        desktopMyLayoutIds: id
      }).then(response => {
        this.$message({
          message: '还原默认成功',
          type: 'success'
        })
        this.layout = []
      }).catch(() => {
      })
    },
    handleSave() {
      const systemAlias = this.$store.getters.system ? this.$store.getters.system.alias : ''
      this.desktopMyLayout.sysAlias = systemAlias
      this.desktopMyLayout.templateHtml = JSON.stringify(this.layout)
      this.desktopMyLayout.designHtml = 'ibps'
      save(this.desktopMyLayout).then(response => {
        this.$alert('保存成功')
        this.$router.replace('/refresh')
      }).catch(() => {
      })
    }
  }
}
</script>
