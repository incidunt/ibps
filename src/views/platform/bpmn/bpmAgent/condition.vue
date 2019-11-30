<template>
  <el-dialog
    :visible.sync="dialogVisible"
    :close-on-click-modal="closeOnClickModal"
    title="添加条件"
    width="70%"
    class="dialog"
    append-to-body
    @open="open"
  >
    <el-form
      ref="form"
      v-loading="dialogLoading"
      :element-loading-text="$t('common.loading')"
      :model="form"
      :rules="rules"
      :label-width="formLabelWidth"
    >
      <el-form-item label="代理人" prop="agentId">
        <ibps-employee-selector
          v-model="form.agentId"
        />
      </el-form-item>
      <el-form-item label="条件名称" prop="name">
        <el-input v-model="form.name" placeholder="请输入内容" />
      </el-form-item>
      <el-form-item label="条件描述">
        <el-input v-model="form.desc" :rows="2" placeholder="请输入内容" type="textarea" />
      </el-form-item>
    </el-form>

    <form-rule
      :def-id="defId"
      :value="form.condition"
    />

    <div slot="footer" class="el-dialog--center">
      <ibps-toolbar
        :actions="toolbars"
        @action-event="handleActionEvent"
      />
    </div>
  </el-dialog>
</template>

<script>
import IbpsEmployeeSelector from '@/business/platform/org/employee/selector'
import FormRule from '@/business/platform/form/rule'
import ActionUtils from '@/utils/action'
export default {
  components: {
    IbpsEmployeeSelector,
    FormRule
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    defId: String
  },
  data() {
    return {
      dialogVisible: this.visible,
      closeOnClickModal: false,
      formLabelWidth: '120px',
      formName: 'form',
      dialogLoading: false,
      form: {
        id: '',
        agentId: '',
        agenterName: '',
        name: '',
        desc: '',
        condition: ''
      },
      rules: {
        agentId: [{ required: true, message: this.$t('validate.required') }],
        name: [{ required: true, message: this.$t('validate.required') }]
      },
      toolbars: [
        { key: 'save', label: '保存' },
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
    },
    form: {
      handler: function(val, oldVal) {
        if (val.agentId !== '') {
          this.$refs[this.formName].clearValidate('agentId')
        } else {
          this.formValidate()
        }
      },
      deep: true
    }
  },
  methods: {
    open() {
      this.formValidate()
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
    handleActionEvent({ key }) {
      switch (key) {
        case 'save':
          this.handleConfirm()
          break
        case 'cancel':
          this.closeDialog()
          break
        default:
          break
      }
    },
    // 关闭当前窗口
    closeDialog() {
      this.$emit('close', false)
      this.$refs[this.formName].resetFields()
    },
    handleConfirm() {
      this.$refs[this.formName].validate(valid => {
        if (valid) {
          this.$emit('callback', this.form)
        } else {
          ActionUtils.saveErrorMessage()
        }
      })
    }
  }
}
</script>
