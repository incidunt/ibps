<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    class="dialog"
    @open="getFormData"
    @close="closeDialog"
  >
    <el-form
      ref="approveForm"
      v-loading="dialogLoading"
      :element-loading-text="$t('common.loading')"
      :model="approve"
      :rules="rules"
      :label-width="formLabelWidth"
    >
      <el-form-item :label="action==='agree'?'审批意见:':'终止原因:'" prop="opinion">
        <approval-opinion
          v-model="approve.opinion"
          :action="action"
        />
      </el-form-item>
    </el-form>
    <div slot="footer" class="el-dialog--center">
      <ibps-toolbar
        :actions="toolbars"
        @action-event="handleActionEvent"
      />
    </div>
  </el-dialog>
</template>

<script>
import { doEndProcess, completeBatch } from '@/api/platform/bpmn/bpmTask'
import { queryIncludeNull } from '@/api/platform/bpmn/bpmCommonStatment'
import ActionUtils from '@/utils/action'

import ApprovalOpinion from '@/business/platform/bpmn/components/approval-opinion'

export default {
  components: {
    ApprovalOpinion
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    taskId: String,
    title: String,
    action: String
  },
  data() {
    return {
      formName: 'approveForm',
      formLabelWidth: '120px',
      dialogVisible: this.visible,
      dialogLoading: false,
      defaultForm: {},
      approve: {
        opinion: ''
      },
      rules: {
        opinion: [{ required: true, message: this.$t('validate.required') }]
      },
      toolbars: [
        { key: 'save' },
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
      },
      immediate: true
    }
  },
  created() {
    this.defaultForm = JSON.parse(JSON.stringify(this.approve))
  },
  methods: {
    handleActionEvent({ key }) {
      switch (key) {
        case 'save':
          this.handleSave()
          break
        case 'cancel':
          this.closeDialog()
          break
        default:
          break
      }
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
      const loading = this.$loading({
        lock: true,
        text: this.$t('common.saving')
      })
      if (this.action === 'stop') {
        doEndProcess({
          taskId: this.taskId,
          endReason: this.approve.opinion
        }).then(response => {
          loading.close()
          this.$emit('callback', this)
          ActionUtils.saveSuccessAlert(response.message, (rtn) => {
            if (this.$utils.isEmpty(this.formId)) {
              this.$refs[this.formName].resetFields()
            }
            if (rtn) {
              this.closeDialog()
            }
          })
        }).catch((err) => {
          loading.close()
          console.info(err)
        })
      } else if (this.action === 'agree') {
        // TODO:nodeUsers:
        completeBatch({
          taskIds: this.taskId,
          actionName: this.action,
          opinion: this.approve.opinion
        }).then(response => {
          loading.close()
          this.$emit('callback', this)
          ActionUtils.saveSuccessAlert(response.message, (rtn) => {
            if (this.$utils.isEmpty(this.formId)) {
              this.$refs[this.formName].resetFields()
            }
            if (rtn) {
              this.closeDialog()
            }
          })
        }).catch((err) => {
          loading.close()
          console.info(err)
        })
      }
    },
    // 关闭当前窗口.
    closeDialog() {
      this.$emit('close', false)
      this.$refs[this.formName].resetFields()
    },
    /**
     * 表单验证
     */
    formValidate() {
      this.$nextTick(() => {
        this.$refs[this.formName].validate(() => {})
      })
    },
    useInfo() {
      let action = this.action
      if (action === 'endProcess' || action === 'stop') {
        action = 'manualend'
      }
      queryIncludeNull(ActionUtils.formatParams(
        {
          'Q^ACTION_^S': action,
          'Q^CREATE_BY_^S': this.$store.getters.userId
        })).then(response => {
        const data = response.variables !== {} && response.variables.def ? response.variables.def.value : ''
        this.approve.opinion = data
      })
    },
    /**
     * 获取表单数据
     */
    getFormData() {
      this.useInfo()
      if (this.$utils.isEmpty(this.formId)) {
        // 重置表单
        if (this.action === 'stop') {
          this.rules.opinion[0].required = true
        } else {
          this.rules.opinion[0].required = false
        }
        this.approve = JSON.parse(JSON.stringify(this.defaultForm))
        this.formValidate()
        return
      }
    }
  }

}
</script>
