<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    class="dialog dictionary-import-dialog"
    @close="closeDialog"
  >
    <el-form
      ref="importForm"
      v-loading="dialogLoading"
      :element-loading-text="$t('common.loading')"
      :model="importForm"
      :label-width="formLabelWidth"
      class="import-form"
    >

      <el-form-item label="选择文件:" required>
        <el-upload
          ref="upload"
          action="https://www.bpmhome.cn/post"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :on-change="handleChange"
          :file-list="importForm.fileList"
          :auto-upload="false"
        >
          <el-button type="primary" icon="el-icon-upload">选择文件</el-button>
          <div slot="tip" class="el-upload__tip">请选择xml文件</div>
        </el-upload>
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
import { importXml } from '@/api/platform/cat/dictionary'
import ActionUtils from '@/utils/action'

export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    id: String
  },
  data() {
    return {
      title: '数据字典导入',
      formName: 'importForm',
      formLabelWidth: '120px',
      dialogVisible: this.visible,
      dialogLoading: false,
      importForm: {
        fileList: []
      },
      toolbars: [
        { key: 'import' },
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
        this.importForm.fileList = []
      },
      immediate: true
    }
  },
  methods: {
    handleActionEvent({ key }) {
      switch (key) {
        case 'import':
          this.handleImport()
          break
        case 'cancel':
          this.closeDialog()
          break
        default:
          break
      }
    },
    handleRemove(file, fileList) {
      console.log(file, fileList)
    },
    handlePreview(file) {
      console.log(file)
    },
    // 保存数据
    handleImport() {
      const file = this.$refs.upload.uploadFiles[0].raw
      if (this.$utils.isEmpty(file) || file.type !== 'text/xml') {
        ActionUtils.saveErrorMessage('请导入xml件！')
        return
      }
      this.saveData(file, this.formId)
    },
    // 提交保存数据
    saveData(file, id) {
      importXml(file, id).then(response => {
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
    handleChange(file, fileList) {
      if (fileList.length > 1) {
        fileList.splice(0, 1)
      }
    },
    // 关闭当前窗口
    closeDialog() {
      this.$emit('close', false)
      this.$refs[this.formName].resetFields()
    }
  }
}
</script>
<style lang="scss">
.dictionary-import-dialog{
  .el-dialog__body{
    height:  calc(27vh - 120px) !important;
  }
}
</style>

