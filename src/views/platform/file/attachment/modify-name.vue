<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    top="25vh"
    class="dialog  attachment-modify-name-dialog"
    @close="closeDialog"
  >
    <el-form ref="fileForm" :model="fileName" label-width="100px">
      <el-form-item
        :rules="[{ required: true, message: '文件名不能为空', trigger: 'blur' }]"
        prop="fileName"
        label="修改文件名"
      >
        <el-input v-model="fileName.fileName" />
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
import { modifyName } from '@/api/platform/file/attachment'
import ActionUtils from '@/utils/action'

export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    id: String,
    file: Object
  },
  data() {
    return {
      formName: 'fileForm',
      title: '修改文件名',
      dialogVisible: this.visible,
      dialogLoading: false,
      toolbars: [
        { key: 'save' },
        { key: 'cancel' }
      ]
    }
  },
  computed: {
    formId() {
      return this.id
    },
    fileName() {
      return this.file
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
      modifyName({
        attachmentId: this.formId,
        fileName: this.fileName.fileName
      }).then(response => {
        this.$emit('callback', this)
        ActionUtils.saveSuccessMessage(response.message, (rtn) => {
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
    }
  }

}
</script>
<style lang="scss">
.attachment-modify-name-dialog{
  .el-dialog__body{
    height:  calc(17vh - 110px) !important;
  }
}
</style>
