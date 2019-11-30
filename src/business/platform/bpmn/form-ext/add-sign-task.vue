<template>
  <el-dialog
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :title="actionName"
    append-to-body
    top="5vh"
    width="60%"
    @close="closeDialog"
    @opened="openedDialog"
  >
    <el-form
      ref="form"
      :element-loading-text="$t('common.loading')"
      :model="form"
      :label-width="formLabelWidth"
      :rules="rules"
    >
      <el-form-item label="补签人员:" prop="addSignTaskUserId">
        <ibps-employee-selector
          v-model="form.addSignTaskUserId"
          multiple
        />
      </el-form-item>
      <el-form-item label="提醒消息:" prop="messageType">
        <ibps-checkbox
          v-model="form.messageType"
          :options="messageTypes"
          value-key="type"
          label-key="title"
        />

      </el-form-item>
      <el-form-item label="补签原因:" prop="opinion">
        <approval-opinion
          v-model="form.opinion"
          :action="action"
        />
      </el-form-item>

    </el-form>
    <div slot="footer" class="el-dialog--center">
      <el-button type="primary" icon="ibps-icon-group" @click="handleSave()">{{ actionName }}</el-button>
      <el-button type="danger" icon="el-icon-circle-close" @click="closeDialog()">取 消</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { queryIncludeNull } from '@/api/platform/bpmn/bpmCommonStatment'
import ActionUtils from '@/utils/action'
import ApprovalOpinion from '@/business/platform/bpmn/components/approval-opinion'
import IbpsEmployeeSelector from '@/business/platform/org/employee/selector'
export default {
  components: {
    ApprovalOpinion,
    IbpsEmployeeSelector
  },
  props: {
    className: String,
    visible: Boolean,
    action: String,
    taskId: String,
    data: [String, Object]
  },
  data() {
    return {
      dialogVisible: this.visible,
      dialogLoading: false,
      formName: 'form',
      formLabelWidth: '130px',
      messageTypes: [{
        type: 'inner',
        title: '内部消息'
      }, {
        type: 'mail',
        title: '内部消息'
      }, {
        type: 'sms',
        title: '短信'
      }],
      form: {
        addSignTaskUserId: '',
        messageType: 'inner,mail',
        opinion: ''
      },
      rules: {
        addSignTaskUserId: [{ required: true, message: this.$t('validate.required') }],
        opinion: [{ required: true, message: this.$t('validate.required') }]
      }
    }
  },
  computed: {
    actionName() {
      return '补签'
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
    closeDialog() {
      this.$emit('close', false)
    },
    openedDialog() {
      queryIncludeNull(ActionUtils.formatParams(
        {
          'Q^ACTION_^S': this.action,
          'Q^CREATE_BY_^S': this.$store.getters.userId
        })).then(response => {
        const data = response.variables && response.variables.def ? response.variables.def.value || '' : ''
        if (this.$utils.isNotEmpty(data)) {
          this.form.opinion = data
        }
      })
    },
    handleSave() {
      this.$refs[this.formName].validate(valid => {
        if (valid) {
          this.$emit('action-event', this.action, this.form)
        } else {
          ActionUtils.saveErrorMessage()
        }
      })
    }
  }
}
</script>

