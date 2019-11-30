<template>
  <el-dialog
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :title="actionName"
    :class="className"
    class="bpmn-agree-dialog"
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
      :rules="rules"
    >
      <el-form-item label="审批意见:" prop="opinion">
        <approval-opinion
          v-model="form.opinion"
          :action="action"
        />
      </el-form-item>

    </el-form>
    <div slot="footer" class="el-dialog--center">
      <el-button type="primary" icon="ibps-icon-save" @click="handleSave()">{{ actionName }}</el-button>
      <el-button type="danger" icon="el-icon-circle-close" @click="closeDialog()">取 消</el-button>
    </div>
  </el-dialog>
</template>
<script>
import ApprovalOpinion from '@/business/platform/bpmn/components/approval-opinion'
import { queryIncludeNull } from '@/api/platform/bpmn/bpmCommonStatment'
import ActionUtils from '@/utils/action'
export default {
  components: {
    ApprovalOpinion
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
      form: {
        opinion: ''
      },
      rules: {
        opinion: [{ required: true, message: this.$t('validate.required') }]
      }
    }
  },
  computed: {
    actionName() {
      if (this.action === 'agree') {
        return '同意'
      } else {
        return '终止流程'
      }
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
      let action = this.action
      if (action === 'endProcess') {
        action = 'manualend'
      }
      queryIncludeNull(ActionUtils.formatParams(
        {
          'Q^ACTION_^S': action,
          'Q^CREATE_BY_^S': this.$store.getters.userId
        })).then(response => {
        const data = response.variables && response.variables.def ? response.variables.def.value || '' : ''
        if (this.$utils.isNotEmpty(data)) {
          this.form.opinion = data
        }
      })
    },
    handleSave() {
      this.$emit('action-event', this.action, {
        opinion: this.form.opinion
      })
    }
  }
}
</script>

