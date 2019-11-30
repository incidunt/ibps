<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    fullscreen
    append-to-body
    class="desktop-manage-dialog"
    @close="closeDialog"
  >
    <ibps-container
      ref="dashboardContainer"
      v-loading="loading"
      :element-loading-text="$t('common.loading')"
      :scroll-delay="scrollDelay"
      type="full"
      @scroll="({x, y}) => { scrollTop = y }"
    >
      <desktop-layout
        :data="layout"
        :empty-text="emptyText"
        :open="dialogVisible"
        :readonly="readonly"
        @init="getFormData"
      />
    </ibps-container>
  </el-dialog>
</template>

<script>
import { get } from '@/api/platform/desktop/manage'
import DesktopLayout from '../myLayout/layout'
export default {
  components: {
    DesktopLayout
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    readonly: {
      type: Boolean,
      default: false
    },
    id: String,
    data: {
      type: Object
    },
    title: String
  },
  data() {
    return {
      formName: 'desktopManageForm',
      formLabelWidth: '120px',
      dialogVisible: this.visible,
      dialogPreviewVisible: false,
      saveDialogVisible: false,

      defaultForm: {},
      desktopManage: {
        name: '',
        memo: '',
        templateHtml: '',
        isDef: 'N'
      },
      rules: {
        name: [{ required: true, message: this.$t('validate.required') }]
      },
      emptyText: '未设置个人桌面布局，请添加栏目。',
      scrollDelay: 0,
      scrollTop: 0,
      loading: false,
      layout: [],
      addColumnVisible: false,
      toolbars: [
        { key: 'save', hidden: () => { return this.readonly } },
        { key: 'cancel' }
      ]
    }
  },
  computed: {
    formId() {
      return this.id
    }
  },
  watch: {
    visible: {
      handler: function(val, oldVal) {
        this.dialogVisible = this.visible
        this.layout = []
      },
      immediate: true
    }
  },
  created() {
    this.defaultForm = JSON.parse(JSON.stringify(this.desktopManage))
  },
  methods: {

    // 关闭当前窗口
    closeDialog() {
      this.$emit('close', false)
    },
    getFormData() {
      if (this.$utils.isEmpty(this.formId)) {
        // 重置表单
        this.desktopManage = JSON.parse(JSON.stringify(this.defaultForm))
        this.layout = this.data || []
        return
      }
      this.loading = true
      get({
        desktopColumnId: this.formId
      }).then(response => {
        this.desktopManage = response.data
        if (this.$utils.isNotEmpty(this.desktopManage.templateHtml)) {
          try {
            this.layout = this.$utils.parseData(this.desktopManage.templateHtml)
          } catch (error) {
            console.error(error)
            this.layout = null
          }
        }

        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    }
  }

}
</script>
<style lang="scss">
.desktop-manage-dialog{
  .el-dialog__body{
    height:  calc(100vh - 110px) !important;
  }
}
</style>

