<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    append-to-body
    class="delegate-dialog"
    top="1vh"
    width="80%"
    @open="getFormData"
    @close="closeDialog"
  >
    <el-form
      ref="form"
      v-loading="dialogLoading"
      class="form"
      :element-loading-text="$t('common.loading')"
      :model="form"
      :label-width="formLabelWidth"
    >
      <el-row>
        <el-col :span="12">
          <el-form-item label="事项标题:">
            {{ form.taskSubject |removeHtmlTag }}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="任务名称:">
            {{ form.taskName }}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="更改类型:">
            <el-tag :color="form.changeType|optionsFilter(changeTypeOptions,'type')">
              {{ form.changeType|optionsFilter(changeTypeOptions,'label') }}
            </el-tag>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="状态:">
            <el-tag :color="form.status|optionsFilter(changeTypeStatusOptions,'type')">
              {{ form.status|optionsFilter(changeTypeStatusOptions,'label') }}
            </el-tag>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="委托人:">
            <ibps-employee-selector
              v-model="form.ownerId"
              disabled
              multiple
              readonly-text="text"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="执行人:">
            <ibps-employee-selector
              v-model="form.executorId"
              :disabled="true"
              placeholder=" "
              multiple
            />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="描述:">
            <el-input v-model="form.comment" type="textarea" readonly="readonly" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <div>
            <div class="buttons ibps-mb-5 ibps-tr">
              <el-row>
                <el-col :span="18">
                  <p class="ibps-tl">任务变更候选人</p>
                </el-col>
                <el-col :span="6" style="margin-top:10px;">
                  <el-button v-if="!readonly" class="add" type="primary" icon="ibps-icon-add" @click="handleAdd">添加</el-button>
                  <el-button v-if="!readonly" class="remove" type="danger" icon="ibps-icon-remove" @click="handleRemove(selection)">删除</el-button>
                </el-col>
              </el-row>
            </div>
          </div>
          <el-table
            key="editTable"
            border
            stripe
            :data="form.bpmTaskChangeAssignPoList"
            empty-text="请添加任务变更候选人"
            style="width: 100%;margin-top:10px;"
            @selection-change="handleSelectionChange"
          >
            <el-table-column
              v-if="!readonly"
              type="selection"
            />
            <el-table-column
              label="候选人类型"
            >
              <template slot-scope="scope">
                <span>{{ scope.row.type|optionsFilter(typeOptions,'label') }}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="执行人"
            >
              <template slot-scope="scope">
                <span>{{ scope.row.executorName }}</span>
              </template>
            </el-table-column>
            <el-table-column v-if="!readonly" label="管理" width="90">
              <template slot-scope="scope">
                <el-button
                  key="button"
                  class="column-remove"
                  size="mini"
                  type="danger"
                  icon="ibps-icon-delete"
                  @click="handleDelete(scope.$index, form.bpmTaskChangeAssignPoList)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="el-dialog--center">
      <el-button v-if="!readonly" type="primary" icon="ibps-icon-mail-forward" @click="handleSave">转办</el-button>
      <el-button icon="el-icon-circle-close" @click="closeDialog()">取 消</el-button>
    </div>
    <!-- 人员选择器 -->
    <ibps-employee-selector-dialog
      :visible="selectorVisible"
      :value="[]"
      multiple
      @close="visible => selectorVisible = visible"
      @action-event="handleSelectorActionEvent"
    />
  </el-dialog>
</template>

<script>
import { changeTypeOptions, changeTypeStatusOptions } from '../constants'
import { save, edit as get } from '@/api/platform/bpmn/bpmTaskChange'
import IbpsEmployeeSelector from '@/business/platform/org/employee/selector'
import IbpsEmployeeSelectorDialog from '@/business/platform/org/employee/dialog'
import ActionUtils from '@/utils/action'

export default {
  components: {
    IbpsEmployeeSelector,
    IbpsEmployeeSelectorDialog
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
    taskId: String,
    title: String
  },
  data() {
    return {
      formName: 'form',
      formLabelWidth: '90px',
      dialogVisible: this.visible,
      dialogLoading: false,
      selectorVisible: false,
      loading: false,
      sameExecutor: true,
      selection: [],
      typeOptions: [
        {
          value: 'employee',
          label: '用户'
        }
      ],
      changeTypeOptions: changeTypeOptions,
      changeTypeStatusOptions: changeTypeStatusOptions,
      defaultForm: {},
      form: {
        taskSubject: '',
        taskName: '',
        changeType: '',
        status: '',
        ownerName: '',
        executorName: '',
        comment: '',
        bpmTaskChangeAssignPoList: []
      }
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
      },
      immediate: true
    }
  },
  created() {
    this.defaultForm = JSON.parse(JSON.stringify(this.form))
  },
  methods: {
    handleAdd() {
      this.selectorVisible = true
    },
    handleRemove(selection = []) {
      if (selection.length === 0) {
        this.$message.closeAll()
        this.$message({
          message: '请选择记录!',
          type: 'warning'
        })
        return
      }
      const data = this.form.bpmTaskChangeAssignPoList
      selection.forEach(l => {
        const index = data.findIndex(item => item.executor === l.executor)
        data.splice(index, 1)
      })
    },
    handleDelete(index, row) {
      row.splice(index, 1)
    },
    handleSelectionChange(value) {
      this.selection = value
    },
    handleSelectorActionEvent(value, data) {
      const arr = data.map(item => {
        return {
          id: '',
          taskChangeId: '',
          type: 'employee',
          executor: item.id,
          executorName: item.name
        }
      })
      if (this.form.bpmTaskChangeAssignPoList.length > 0) {
        this.form.bpmTaskChangeAssignPoList.forEach(l => {
          arr.forEach((i, index) => {
            if (i.executor === l.executor) {
              arr.splice(index, 1)
            }
          })
        })
      }
      this.form.bpmTaskChangeAssignPoList = this.form.bpmTaskChangeAssignPoList.concat(arr)
      this.selectorVisible = false
    },
    // 保存数据
    handleSave() {
      this.$refs[this.formName].validate(valid => {
        if (valid) {
          this.saveData()
        } else {
          ActionUtils.saveErrorMessage()
        }
      })
    },
    // 提交保存数据
    saveData() {
      const data = JSON.parse(JSON.stringify(this.form))
      if (this.$utils.isEmpty(data.bpmTaskChangeAssignPoList)) {
        ActionUtils.warning('任务变更候选人数据不能为空，请选择！')
        return
      }
      const ownerIndex = data.bpmTaskChangeAssignPoList.findIndex(item => item.executor === data.ownerId)
      if (ownerIndex > -1) {
        ActionUtils.warning('任务变更候选人不能包含委托人，请检查设置！')
        return
      }
      save(data).then(response => {
        this.$emit('callback', this)
        ActionUtils.saveSuccessMessage(response.message, (rtn) => {
          if (this.$utils.isEmpty(this.formId)) {
            this.$refs[this.formName].resetFields()
          }
          if (rtn) {
            this.closeDialog()
          }
        })
      }).catch((err) => {
        console.info(err)
      })
    },
    // 关闭当前窗口
    closeDialog() {
      this.$emit('close', false)
      this.$refs[this.formName].resetFields()
    },
    /**
     * 表单验证
     */
    formValidate() {
      if (this.readonly) return
      this.$nextTick(() => {
        this.$refs[this.formName].validate(() => {})
      })
    },
    /**
     * 获取表单数据
     */
    getFormData() {
      this.dialogLoading = true
      get({
        id: this.formId,
        taskId: this.taskId
      }).then(response => {
        const data = response.data
        this.form = data
        this.formValidate()
        this.dialogLoading = false
      }).catch(() => {
        this.dialogLoading = false
      })
    }
  }
}
</script>
<style lang="scss">
.delegate-dialog{
  .form{
    margin-top: 10px;
  }
  .el-dialog__body{
    padding: 10px 20px;
    height: calc(100vh - 160px) !important;
  }
}
</style>
