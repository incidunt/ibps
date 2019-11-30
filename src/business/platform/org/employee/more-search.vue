<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :class="className"
    append-to-body
    class="employee-more-search-dialog"
    @close="closeDialog"
  >
    <search-form
      ref="searchForm"
      :forms="form.forms||[]"
      :size="form.size"
      :fuzzy="form.fuzzy"
      :inline="form.inline"
      :label-width="form.labelWidth"
      :item-width="form.itemWidth"
      class="search-form"
      @search="handleActionEvent('search', 'toolbar')"
    />
    <!--  @search事件 -->
    <div slot="footer" class="el-dialog--center">
      <ibps-toolbar
        :actions="toolbars"
        @action-event="handleActionEvents"
      />
    </div>
  </el-dialog>
</template>

<script>
import SearchForm from '@/components/ibps-crud/components/search-form'
import { genderOptions } from './constants'
export default {
  components: {
    SearchForm
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    title: String,
    className: String
  },
  data() {
    return {
      dialogVisible: this.visible,
      defaultForm: {},
      form: {
        labelWidth: 100,
        forms: [
          { prop: 'Q^ACCOUNT_^SL', label: '账号', labelWidth: 115 },
          { prop: 'Q^EMAIL_^SL', label: '邮箱', labelWidth: 115 },
          { prop: 'Q^WC_ACCOUNT_^SL', label: '微信账户', labelWidth: 115 },
          { prop: 'Q^ADDRESS_^SL', label: '地址', labelWidth: 115 },
          { prop: 'Q^QQ_^SL', label: 'QQ', labelWidth: 115 },
          { prop: 'Q^MOBILE_^SL', label: '电话', labelWidth: 115 },
          {
            prop: 'Q^GENDER_^S',
            label: '性别',
            fieldType: 'select',
            options: genderOptions,
            labelWidth: 115
          }
          // { prop: 'QA^NAME_', label: '参与者属性管理', labelWidth: 115 }
        ]
      },
      toolbars: [
        { key: 'search', icon: 'ibps-icon-search', label: '搜索' },
        { key: 'clean', icon: 'ibps-icon-clean', type: 'danger', label: '重置' },
        { key: 'cancel' }
      ]
    }
  },
  computed: {
  },
  watch: {
    visible: {
      handler: function(val, oldVal) {
        this.dialogVisible = this.visible
      },
      immediate: true
    }
  },
  created() {
    this.defaultForm = JSON.parse(JSON.stringify(this.form))
  },
  methods: {
    handleActionEvents({ key }) {
      switch (key) {
        case 'search':
          this.handleSearch()
          break
        case 'clean':
          this.handleClean()
          break
        case 'cancel':
          this.closeDialog()
          break
        default:
          break
      }
    },
    /**
     * @description 处理按钮的事件 【包含增删改查】
     * @param {*} buttonKey
     * @param {*} position
     * @param {*} data
     */
    handleActionEvent(buttonKey, position, data) {
      // this.$emit('action-event', buttonKey, position, data)
      this.handleSearch()
      this.$emit('close', false)
    },
    /**
     * @description 搜索
     */
    handleSearch() {
      const params = {}
      this.$refs['searchForm'].getParams((error, formParams) => {
        if (!error) {
          return Object.assign(params, formParams)
        }
      })
      this.closeDialog()
      this.$emit('action-event', params)
    },
    handleClean() {
      this.closeDialog()
      this.$emit('action-event', {})
    },
    // 关闭当前窗口
    closeDialog() {
      this.$refs.searchForm.resetSearchForm()
      this.$emit('close', false)
    }
  }

}
</script>
<style lang="scss">
.employee-more-search-dialog{
  .search-form{
    .search-form-item{
      width: 94%;
    }
    .el-form-item__label{
      width:20% !important;
    }
    .el-form-item__content{
      width: 80%;
      .el-select{
        width: 100%;
      }
    }
  }
}

</style>
