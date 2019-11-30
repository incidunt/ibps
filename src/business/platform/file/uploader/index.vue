<template>
  <el-dialog
    v-if="dialogVisible"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :title="title"
    :top="marginTop"
    append-to-body
    custom-class="ibps-uploader-dialog"
    @close="closeDialog"
  >
    <el-tabs
      v-model="activeName"
      class="uploader-tab"
      @tab-click="onTabClick"
    >
      <el-tab-pane label="上传附件" name="upload">
        <upload
          ref="upload"
          :multiple="multiple"
          :file-size="fileSize"
          :accept="acceptRule"
          :height="height"
          :init="dialogVisible"
          :limit="limit"
          @callback="uploadCallback"
        />
      </el-tab-pane>
      <el-tab-pane label="已上传附件" name="online">
        <online
          ref="online"
          :multiple="multiple"
          :height="height"
          :accept="accept"
          :limit="limit"
          :load="onlineLoad"
          @format="onFormat"
          @callback="onlineCallback"
        />
      </el-tab-pane>
    </el-tabs>
    <div slot="footer" class="el-dialog--center">
      <ibps-toolbar
        :actions="toolbars"
        @action-event="handleActionEvent"
      />
    </div>
  </el-dialog>
</template>

<script>
import { fileTypes, allFileTypes, accept as acceptTypes } from '@/business/platform/form/constants/fileTypes'
import upload from './upload'
import online from './online'

export default {
  components: {
    upload,
    online
  },
  props: {
    multiple: {
      type: Boolean,
      default: false
    },
    visible: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: '文件上传'
    },
    marginTop: {
      type: String,
      default: '0vh'
    },
    height: {
      type: String,
      default: '400px'
    },
    fileSize: { // 上传尺寸
      type: Number
    },
    limit: {
      type: Number
    },
    accept: {
      type: String,
      default: ''
    },
    fileExt: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      dialogVisible: this.visible,
      activeName: 'upload',
      buttonKey: 'confirm',
      onlineLoad: false,
      format: true,

      fileTypes: fileTypes,
      allFileTypes: allFileTypes,
      acceptTypes: acceptTypes,
      otherType: false,
      acceptRule: '',
      fileList: this.multiple ? [] : {},
      toolbars: [
        { key: 'confirm' },
        { key: 'cancel' }
      ]
    }
  },
  watch: {
    visible: {
      handler: function(val, oldVal) {
        this.dialogVisible = this.visible
        this.activeName = 'upload'
      },
      immediate: true
    },
    accept: {
      handler: function(val, oldVal) {
        if (val === '*' && this.fileExt.length !== 0) {
          const str = '.' + this.fileExt.join(',').replace(/,/g, ',.')
          this.acceptRule = str
        } else {
          this.acceptRule = val
        }
      },
      immediate: true
    }
  },
  methods: {
    handleActionEvent({ key }) {
      switch (key) {
        case 'confirm':
          this.handleConfirm()
          break
        case 'cancel':
          this.closeDialog()
          break
        default:
          break
      }
    },
    uploadCallback(data) {
      this.fileList = data
    },
    onlineCallback(data) {
      this.fileList = data
    },
    // 关闭当前窗口
    closeDialog() {
      this.$emit('close', false)
    },
    onTabClick(tab) {
      if (tab.name === 'online') {
        this.onlineLoad = !this.onlineLoad
      }
    },
    onFormat(format) {
      this.format = format
    },
    /**
     * 文件类型的限制
     */
    handleAccpt() {
      const accept = this.accept
      const acceptTypes = this.acceptTypes
      const fileTypes = this.fileTypes
      let type = ''
      this.otherType = false
      for (const i in acceptTypes) {
        if (acceptTypes[i] === accept) {
          type = i
        }
      }
      if (type !== '' && this.accept !== '*') {
        const targetFileTypes = fileTypes[type]
        const fileList = this.fileList
        fileList.forEach(i => {
          const index = targetFileTypes.findIndex(l => l === i.ext)
          if (index === -1) {
            this.otherType = true
          }
        })
      }
      return this.otherType
    },
    handleConfirm() {
      if (this.handleAccpt()) {
        this.$message.closeAll()
        this.$message({
          message: '选择的附件中存在不符合规定类型的文件，请重现选择！',
          type: 'warning'
        })
        return
      }
      if (!this.format) {
        this.$message.closeAll()
        this.$message.error('选择文件格式不允许！')
      } else {
        if (this.$utils.isEmpty(this.fileList)) {
          this.$message.closeAll()
          this.$message({
            message: '请上传或选择文件，或待文件上传成功后在继续操作！',
            type: 'warning'
          })
          return
        }
        this.$emit('action-event', this.buttonKey, this.fileList)
      }
    }
  }
}
</script>
