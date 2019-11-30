<template>
  <el-dialog
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    title="人员预览"
    width="70%"
    top="10vh"
    class="user-preview"
    append-to-body
    @close="closeDialog"
  >
    <div class="user-preview-content">
      <div class="content">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="预览参数" name="preview">
            <el-form ref="form" :model="form" :rules="rules" label-width="120px">
              <el-form-item label="上一步执行人：" prop="prevUserName">
                <ibps-employee-selector
                  v-model="form.prevUserName"
                  placeholder="请选择上一步执行人"
                  :multiple="false"
                />
              </el-form-item>
              <el-form-item label="发起人：" prop="startUserName">
                <ibps-employee-selector
                  v-model="form.startUserName"
                  placeholder="请选择发起人"
                  :multiple="false"
                />
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="查询结果" name="result">
            <ibps-crud
              ref="crud"
              :height="tableHeight"
              :data="listData"
              :pk-key="pkKey"
              :columns="listConfig.columns"
              :pagination="pagination"
              :loading="loading"
              :selection-type="multiple?'checkbox':'radio'"
              @sort-change="handleSortChange"
              @pagination-change="handlePaginationChange"
            />
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
    <div slot="footer" class="el-dialog--center">
      <ibps-toolbar
        :actions="actions"
        @action-event="handleActionEvent"
      />
    </div>

  </el-dialog>
</template>

<script>
import { previewCondition } from '@/api/platform/bpmn/bpmNodeDef'
import ActionUtils from '@/utils/action'
import IbpsEmployeeSelector from '@/business/platform/org/employee/selector'

export default {
  components: {
    IbpsEmployeeSelector
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    height: {
      type: String,
      default: '400px'
    },
    multiple: {
      type: Boolean,
      default: false }
  },
  data() {
    return {
      form: {
        prevUserName: '',
        startUserName: ''
      },
      pagination: {},
      pkKey: 'id',
      loading: false,
      rules: {
        prevUserName: [
          { required: true, message: '请选择上一步执行人', trigger: 'blur' }
        ],
        startUserName: [
          { required: true, message: '请选择发起人', trigger: 'blur' }
        ]

      },
      listData: [],
      listConfig: {
        // 表格字段配置
        columns: [
          { prop: 'name', label: '姓名' },
          { prop: 'key', label: '账号' }
        ]
      },
      activeName: 'preview',
      dialogVisible: this.visible,
      actions: [
        { key: 'preview', icon: 'ibps-icon-eye', label: '预览' },
        { key: 'cancel' }
      ]
    }
  },
  computed: {
    tableHeight() {
      const h = this.height.substr(0, this.height.length - 2)
      return parseInt(h) - 10
    },
    types() {
      const userCondition = this.data.calcs
      const types = []
      userCondition.forEach(condition => {
        if (condition.source === 'prev') {
          types.push('prev')
        } else if (condition.source === 'start') {
          types.push('start')
        } else if (condition.source === 'var') {
          var varVal = condition['var']
          if (typeof varVal === 'string') {
            // varVal = eval('(' + condition['var'] + ')')
          }
        }
      })
      return types
    }
  },
  watch: {
    visible: {
      handler: function(val, oldVal) {
        this.dialogVisible = this.visible
      },
      immediate: true
    }
  },
  methods: {
    /**
     * 加载数据
     */
    loadListData() {
      this.loading = true
      previewCondition({
        conditionArray: '',
        variables: ''
      }).then(response => {
        ActionUtils.handleListData(this, response.data)
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    /**
     * 获取格式化参数
     */
    getFormatParams() {
      const params = this.$refs['crud'] ? this.$refs['crud'].getSearcFormData() : {}
      params.type = this.type
      return ActionUtils.formatParams(
        params,
        this.pagination,
        this.sorts)
    },

    /**
     * 处理分页事件
     */
    handlePaginationChange(page) {
      ActionUtils.setSorts(this.sorts)
      ActionUtils.setPagination(this.pagination, page)
      this.loadListData()
    },
    /**
     * 处理排序
     */
    handleSortChange(sort) {
      ActionUtils.setSorts(this.sorts, sort)
      ActionUtils.setPagination(this.pagination)
      this.loadListData()
    },
    handleClick(tab, event) {
      // console.log(tab, event)
    },
    handleActionEvent({ key }) {
      switch (key) {
        case 'preview':
          this.handlePreview()
          break
        case 'cancel':
          this.closeDialog()
          break
        default:
          break
      }
    },
    handlePreview() {
      this.loadListData()
      this.activeName = 'result'
    },
    closeDialog() {
      this.$emit('close', false)
    }
  }
}
</script>

<style lang="scss">
.user-preview{
.user-preview-content{
  height: 60vh;

}
}
</style>

