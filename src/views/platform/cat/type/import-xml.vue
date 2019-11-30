<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    class="dialog type-import-dialog"
    @close="closeDialog"
  >
    <el-form
      ref="importForm"
      v-loading="dialogLoading"
      :element-loading-text="$t('common.loading')"
      :label-width="formLabelWidth"
      class="import-form"
    >
      <el-form-item label="选择文件:">
        <el-upload
          ref="uploader"
          :name="'file'"
          :before-upload="beforeUpload"
          :on-success="handleSuccess"
          :on-error="handleError"
          :on-change="handleChange"
          :file-list="fileList"
          :auto-upload="false"
          action="https://www.bpmhome.cn/post"
          accept=".xml"
        >
          <el-button slot="trigger" size="small" type="primary" icon="el-icon-upload">选择文件</el-button>
          <div slot="tip" class="el-upload__tip">请导入xml文件！</div>
        </el-upload>
      </el-form-item>

      <el-form-item>
        <el-input v-model="formId" name="typeId" type="hidden" />
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
import { importXml } from '@/api/platform/cat/type'
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
      title: '分类导入',
      formName: 'importForm',
      formLabelWidth: '120px',
      dialogVisible: this.visible,
      dialogLoading: false,
      fileList: [],
      file: {},
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
        this.fileList = []
        this.file = {}
      },
      immediate: true
    },
    fileList: {
      handler: function(val, oldVal) {
        console.log(val)
      },
      deep: true
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
    /**
     * 文件上传
     */
    httpRequest(options) {
      return importXml(options.file, this.id)
    },
    // 保存数据
    handleSave(options) {
      const file = this.$refs.uploader.uploadFiles[0].raw
      if (this.$utils.isEmpty(file) || file.type !== 'text/xml') {
        ActionUtils.saveErrorMessage('请导入xml件！')
        return
      }
      importXml(file, this.id).then(response => {
        this.$emit('callback', this)
        this.closeDialog()
      }).catch((err) => {
        console.info(err)
      })
    },
    // 关闭当前窗口
    closeDialog() {
      this.$emit('close', false)
      this.$refs[this.formName].resetFields()
    },
    handleSuccess(res, file) {
      console.log('handleSuccess')
    },
    handleError(err, file, fileList) {
      if (!(err instanceof Error)) {
        const data = JSON.parse(err.message)
        this.$message.closeAll()
        this.$message({
          message: this.$utils.isNotEmpty(data.message) ? data.message : data.cause,
          type: 'error'
        })
      }
    },
    handleChange(file, fileList) {
      if (fileList.length > 1) {
        this.file = file
        fileList.splice(0, 1)
      }
    },
    beforeUpload(file) {
      return true
    }
  }

}
</script>

<style lang="scss" >
.type-import-dialog{
  .el-dialog__body{
    height:  calc(27vh - 80px) !important;
  }
}
  .avatar-uploader .el-upload {
      /* margin-top: 5px; */
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
  .emp-tab .el-button + .el-button {
    margin-left: 0px;
  }
  .import-form{
    .el-upload-list{
      position: relative;
      height: 40px;
      overflow: hidden;
      .el-upload-list__item{
        margin:0;
        position: absolute;
        top:0;
      }
    }
  }
</style>
