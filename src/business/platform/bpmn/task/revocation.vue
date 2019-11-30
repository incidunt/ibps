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
      ref="revocationForm"
      v-loading="dialogLoading"
      :element-loading-text="$t('common.loading')"
      :model="approve"
      :rules="rules"
      :label-width="formLabelWidth"
    >
      <el-form-item label="撤销意见" prop="opinion">
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
import { complete } from '@/api/platform/bpmn/bpmTask'
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
      formName: 'revocationForm',
      formLabelWidth: '120px',
      dialogVisible: this.visible,
      dialogLoading: false,
      defaultForm: {},
      approve: {
        taskId: '',
        actionName: 'revoke',
        opinion: '',
        destination: ''
      },
      rules: {
        opinion: [{ required: true, message: this.$t('validate.required') }]
      },
      toolbars: [
        { key: 'save', label: '撤销' },
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
      this.approve.taskId = this.taskId
      complete(this.approve).then(response => {
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
      this.$nextTick(() => {
        this.$refs[this.formName].validate(() => {})
      })
    },
    /**
     * 获取表单数据
     */
    getFormData() {
      if (this.$utils.isEmpty(this.formId)) {
        this.approve = JSON.parse(JSON.stringify(this.defaultForm))
        this.formValidate()
        return
      }
    }
  }

}
</script>
