<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    class="dialog attachment-detail-dialog"
    top="6vh"
    @close="closeDialog"
    @open="getFormData"
  >
    <el-form :label-width="formLabelWidth" class="attachment-from">
      <el-form-item label="文件名:">
        <span>{{ attachment.fileName }}</span>
      </el-form-item>
      <el-form-item label="附件分类:">
        <span>{{ attachment.typeId }}</span>
      </el-form-item>
      <el-form-item label="附件类型:">
        {{ attachment.fileType }}
      </el-form-item>
      <el-form-item label="文件路径">
        {{ attachment.filePath }}
      </el-form-item>
      <el-form-item label="创建时间:">
        {{ attachment.createTime |dateFormat }}
      </el-form-item>
      <el-form-item label="存储类型">
        {{ attachment.storeType }}
      </el-form-item>
      <el-form-item label="总字节数">
        {{ attachment.totalBytes |numberFormatter }}
      </el-form-item>
      <el-form-item label="扩展名:">
        <span>{{ attachment.ext }}</span>
      </el-form-item>
      <el-form-item label="说明:">
        <span>{{ attachment.note }}</span>
      </el-form-item>
      <el-form-item label="上传者">
        {{ attachment.creatorName }}
      </el-form-item>
    </el-form>
    <div slot="footer" class="el-dialog--center">
      <ibps-toolbar
        :actions="toolbars"
        @action-event="handleActionEvent"
      />
    </div>
    <file-preview
      :file="attachment"
      :visible="filePreviewVisible"
      @close="visible => filePreviewVisible = visible"
    />
  </el-dialog>
</template>

<script>
import { get } from '@/api/platform/file/attachment'
import { downloadFile } from '@/business/platform/file/utils'
import FilePreview from '@/business/platform/file/file-preview'

export default {
  components: {
    FilePreview
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    id: String,
    data: [Object, String]
  },
  data() {
    return {
      formName: 'attachmentForm',
      title: '系统附件明细',
      formLabelWidth: '120px',
      dialogVisible: this.visible,
      dialogLoading: false,
      filePreviewVisible: false,
      attachment: {
        fileName: '',
        typeId: '',
        fileType: '',
        filePath: '',
        createTime: '',
        storeType: '',
        totalBytes: '',
        ext: '',
        note: '',
        creatorName: ''
      },
      toolbars: [
        { key: 'primary', icon: 'ibps-icon-eye', label: '预览' },
        { key: 'download', icon: 'ibps-icon-download', label: '下载' },
        { key: 'cancel' }
      ]
    }
  },
  computed: {
    formId() {
      return this.id
    },
    formData() {
      return this.data
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
    this.getFormData()
  },
  methods: {
    handleActionEvent({ key }) {
      switch (key) {
        case 'primary':
          this.handlePreview()
          break
        case 'download':
          this.handleDownload()
          break
        case 'cancel':
          this.closeDialog()
          break
        default:
          break
      }
    },
    handlePreview() {
      this.filePreviewVisible = true
    },
    handleDownload() {
      downloadFile(this.attachment)
    },
    // 获取明细数据
    getFormData() {
      if (this.$utils.isEmpty(this.formId)) {
        return
      }
      get({ attachmentId: this.formId }).then(response => {
        this.attachment = response.data
      }).catch(() => {
      })
    },
    // 关闭当前窗口
    closeDialog() {
      this.$emit('close', false)
    }
  }

}
</script>
<style lang="scss">
.attachment-detail-dialog{
  .el-dialog__body{
    height:  calc(57vh - 100px) !important;
  }
}
.attachment-from>div{
    margin-bottom: 13px !important;
}
</style>
