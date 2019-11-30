<template>
  <el-dialog
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    title="复制业务对象"
    class="dialog"
    width="60%"
    @open="getFormData"
    @close="closeDialog"
  >
    <el-form
      ref="form"
      v-loading="dialogLoading"
      :element-loading-text="$t('common.loading')"
      :model="form"
      :rules="rules"
      :label-width="formLabelWidth"
    >
      <el-row>
        <el-col :span="12">
          <el-form-item label="原业务对象名称：" prop="origname">
            <el-input v-model="form.origname" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="业务对象名称：" prop="name">
            <el-input v-model="form.name" v-pinyin="{vm:form,key:'code'}" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="原编码：" prop="origCode">
            <el-input v-model="form.origCode" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="编码：" prop="code">
            <el-input v-model="form.code" />
          </el-form-item>
        </el-col>
      </el-row>
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
import { saveCopy, checkCode } from '@/api/platform/bo/boDef'
import ActionUtils from '@/utils/action'

export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    id: String,
    copyData: Object
  },
  data() {
    return {
      formName: 'form',
      formLabelWidth: '130px',
      dialogVisible: this.visible,
      dialogLoading: false,
      form: {
        origname: '',
        name: '',
        origCode: '',
        code: ''
      },
      rules: {
        name: [{ required: true, message: this.$t('validate.required') }],
        code: [{ required: true, message: this.$t('validate.required') }]
      },
      toolbars: [
        { key: 'save', label: '保存' },
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
      if (this.form.origCode === this.form.code) {
        this.$message({
          message: 'BO定义Code【' + this.form.code + '】不能与原BO定义Code【' + this.form.origCode + '】一致',
          type: 'warning'
        })
        return
      }
      checkCode({
        boDefId: this.formId,
        boCode: this.form.code,
        isMain: 'Y'
      }).then(response => {
        saveCopy({
          boDefId: this.formId,
          boCode: this.form.code,
          defName: this.form.name,
          cascade: true
        }).then(response => {
          this.$emit('callback', this)
          this.closeDialog()
          this.$message.closeAll()
          this.$message({
            type: 'success',
            message: '复制业务对象成功!'
          })
        }).catch((err) => {
          console.info(err)
        })
      })
    },
    // 关闭当前窗口
    closeDialog() {
      this.$emit('close', false)
      this.$refs[this.formName] ? this.$refs[this.formName].resetFields() : null
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
      this.dialogLoading = false
      this.formValidate()
      this.form.origname = this.copyData.name
      this.form.origCode = this.copyData.code
    }
  }

}
</script>
