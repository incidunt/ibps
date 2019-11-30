<template>
  <!--值来源-->
  <el-dialog
    :title="title"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    class="data-template-renderer-value-source-dialog"
    append-to-body
    @open="getFormData"
    @close="closeDialog"
  >
    <el-alert type="warning" :closable="false"> 实际是会返回数据到表单下拉：</el-alert>

    <ibps-highlight>{{ dataResult }}</ibps-highlight>
  </el-dialog>
</template>
<script>
import { queryDataTable } from '@/api/platform/data/dataTemplate'
import ActionUtils from '@/utils/action'
import TypeMixin from '../mixins/types'

export default {
  mixins: [TypeMixin],
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    data: {
      type: Object
    },
    dynamicParams: Object
  },
  data() {
    return {
      dialogVisible: this.visible,
      dataTemplate: {},
      template: {},
      dataResult: [],
      filterConditionKey: ''
    }
  },
  computed: {
    title() {
      return this.dataTemplate.name || '值来源'
    },
    pkKey() {
      return this.dataTemplate.unique || 'id_'
    }
  },
  watch: {
    visible: {
      handler: function(val, oldVal) {
        this.dialogVisible = val
      },
      immediate: true
    }
  },
  methods: {
    // 关闭当前窗口
    closeDialog() {
      this.$emit('close', false)
    },
    getFormData() {
      this.dataTemplate = JSON.parse(JSON.stringify(this.data))
      const templates = this.dataTemplate.templates || []
      this.template = templates[0] || {}
      this.loadData()
    },
    /**
     * 加载数据
     */
    loadData() {
      this.loading = true
      queryDataTable(this.getFormatParams()).then(response => {
        this.loading = false
        const data = response.data
        this.dataResult = data.dataResult || []
      }).catch(() => {
        this.loading = false
      })
    },
    /**
     * 获取格式化参数
     */
    getFormatParams() {
      let formParams = {}
      if (this.$refs['searchForm']) {
        formParams = this.$refs['searchForm'].getSearcFormData() || {}
      }
      const responseData = JSON.parse(JSON.stringify(this.template))
      responseData.datasetKey = this.dataTemplate.datasetKey
      responseData.unique = this.pkKey
      responseData['dynamic_params'] = this.dynamicParams
      formParams['response_data'] = JSON.stringify(responseData)
      formParams['filter_condition_key'] = this.filterConditionKey
      return ActionUtils.formatParams(formParams)
    }
  }
}
</script>
<style lang="scss" >
  .data-template-renderer-value-source-dialog{
    .el-dialog__body {
       height:  calc(70vh - 110px) !important;
    }
  }
</style>
