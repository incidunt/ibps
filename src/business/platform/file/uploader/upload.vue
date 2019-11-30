<template>
  <div
    :style="{
      height:height
    }"
    class="ibps-uplpad"
  >
    <div class="header">
      <div class="btns">
        <el-upload
          :file-list="fileList"
          :on-remove="handleRemove"
          :on-success="handleSuccess"
          :on-error="handleError"
          :before-upload="beforeUpload"
          :http-request="httpRequest"
          :limit="limit"
          :multiple="multiple"
          :accept="accept"
          :show-file-list="false"
          action="https://www.bpmhome.cn/post"
          list-type="picture"
          name="file"
        >
          <el-button slot="trigger" icon="el-icon-upload" type="primary">上传文件</el-button>
          <el-button
            type="danger"
            icon="ibps-icon-remove"
            @click="clearFiles"
          >全部删除</el-button>
        </el-upload>
      </div>
    </div>
    <div class="uploader">
      <el-upload
        ref="upload"
        :file-list="fileList"
        :on-remove="handleRemove"
        :on-success="handleSuccess"
        :on-error="handleError"
        :before-upload="beforeUpload"
        :http-request="httpRequest"
        :limit="limit"
        :multiple="multiple"
        :accept="accept"
        action="https://www.bpmhome.cn/post"
        name="file"
        drag
        list-type="picture-card"
      >
        <i class="el-icon-upload" />
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      </el-upload>

      <el-dialog :visible.sync="dialogVisible" append-to-body>
        <img :src="dialogImageUrl" width="100%" alt="">
      </el-dialog>
    </div>
  </div></template>
<script>
import { uploadFile, remove } from '@/api/platform/file/attachment'
import { fileTypes, allFileTypes, accept as acceptTypes } from '@/business/platform/form/constants/fileTypes'
export default {
  props: {
    height: String,
    init: Boolean,
    limit: Number, // 个数
    multiple: Boolean,
    fileSize: Number, // 尺寸
    accept: String// 类型
  },
  data() {
    return {
      uploadData: {}, // 可以添加分类、文件等信息
      fileList: [],
      dialogVisible: false,
      otherType: false,
      dialogImageUrl: '',

      fileTypes: fileTypes,
      allFileTypes: allFileTypes,
      acceptTypes: acceptTypes
    }
  },
  watch: {
    init: {
      handler() {
        if (this.init) {
          this.fileList = []
        }
      },
      immediate: true
    }
  },
  methods: {
    /**
     * 文件上传
     */
    httpRequest(options) {
      return uploadFile(options.file, {})
    },
    // 做文件校验
    beforeUpload(file) {
      if (this.limit === 0) {
        this.$message({
          message: '上传文件个数不能为0，请重新设置',
          type: 'warning'
        })
        return false
      }
      if (this.fileSize && file.size > this.fileSize) {
        this.$message.closeAll()
        this.$message({
          message: '上传文件的尺寸大于' + this.$utils.formatSize(this.fileSize),
          type: 'warning'
        })
        return false
      }
      // accept中的中生成匹配正则。
      console.log(this.accept && this.handleAccpt(file), 'accept中的中生成匹配正则1。')
      console.log(this.fileExtType(file), 'accept中的中生成匹配正则2。')
      if (this.accept && this.handleAccpt(file) || this.fileExtType(file)) {
        this.$message.closeAll()
        this.$message({
          message: '不允许的文件类型',
          type: 'warning'
        })
        return false
      }
    },
    /**
     * 文件类型的检测
     */
    fileExtType(file) {
      const accept = this.accept
      const acceptTypes = this.acceptTypes
      const fileTypes = this.fileTypes
      const arr = file.name.split('.')
      const result = arr[1]
      let type = ''
      this.otherType = false
      for (const i in acceptTypes) {
        if (acceptTypes[i] === accept) {
          type = i
        }
      }
      if (type !== '' && this.accept !== '*') {
        // 现存的附件类型
        const targetFileTypes = fileTypes[type]
        this.otherType = !targetFileTypes.includes(result)
      } else {
        if (this.accept === '*') {
        // 不限制
          this.otherType = false
        } else {
        // 自定义
          const targetFileTypes = this.accept.split(',')
          this.otherType = !targetFileTypes.includes('.' + result)
        }
      }
      return this.otherType
    },
    /**
     * 文件类型的限制
     */
    handleAccpt(file) {
      const rExt = /\.\w+$/
      let accept = ''
      const arr = []
      const extensions = this.accept.split(',')

      const acceptTypes = this.acceptTypes
      const acceptArr = []
      for (var i in acceptTypes) {
        acceptArr.push(acceptTypes[i])
      }
      const inAcceptTypes = acceptArr.includes(this.accept)

      for (let i = 0, len = extensions.length; i < len; i++) {
        const item = extensions[i]
        if (item) {
          if (item.indexOf('/')) {
            const v = item.split('/')
            let k = item
            if (v.length > 0) {
              k = v[v.length - 1]
            }
            arr.push(k)
          } else {
            arr.push(item)
          }
        }
      }
      if (arr.length) {
        accept = '\\.' + arr.join(',')
          .replace(/,/g, '$|\\.')
          .replace(/\*/g, '.*') + '$'
      }
      accept = new RegExp(accept, 'i')
      return !file || !file.size || this.accept &&
      // 如果名字中有后缀，才做后缀白名单处理。
         rExt.exec(file.name) && !accept.test(file.name) && inAcceptTypes
    },
    handleSuccess(response, file, fileList) {
      let ext = this.getExtName(file.name)
      let url = ''
      if (this.$utils.isEmpty(ext)) {
        ext = 'file'
      }
      if (['jpg', 'jpeg', 'bmp', 'png'].includes(ext)) {
        url = file.url
      } else {
        url = `./static/images/file/${ext}.png`
      }
      file.url = url
      this.fileList = fileList
      this.emitCallback(fileList)
    },
    // 获取扩展名
    getExtName(name) {
      return name ? name.substring(name.lastIndexOf('.') + 1, name.length) : ''
    },
    handleError(err, file, fileList) {
      this.fileList = fileList
      if (!(err instanceof Error)) {
        const data = JSON.parse(err.message)
        this.$message.closeAll()
        this.$message({
          message: this.$utils.isNotEmpty(data.message) ? data.message : data.cause,
          type: 'error'
        })
      }
    },
    handleRemove(file, fileList) {
      this.fileList = fileList
      if (file && file.response) {
        this.handleRemoteRemove(file.response.data.id, () => {
          this.emitCallback(fileList)
        })
      }
    },
    emitCallback(list) {
      let rtn
      if (this.multiple) {
        rtn = this.$utils.isNotEmpty(list) ? this.getFileDataList(list) : []
      } else {
        rtn = this.$utils.isNotEmpty(list) ? list[list.length - 1].response.data : ''
      }
      this.$emit('callback', rtn)
    },
    getFileDataList(fileList) {
      return fileList.map((file) => {
        return file.response.data
      })
    },
    /**
     * 清空
     */
    clearFiles() {
      const ids = this.$refs.upload.uploadFiles.map((file) => {
        console.log(file.response.data.id)
        return file.response.data.id
      }).join(',')

      if (this.$utils.isEmpty(ids)) {
        this.$message.warning('请先上传文件！')
        return
      }
      this.handleRemoteRemove(ids, () => {
        this.$refs.upload.clearFiles()
      })
    },
    handleRemoteRemove(ids, callback) {
      remove({ attachmentIds: ids }).then(response => {
        callback(this)
      }).catch(() => {})
    },
    handlePreview(file) {
      this.dialogVisible = true
    //  this.dialogImageUrl = file.url
    }
  }
}
</script>
<style lang="scss" >
.ibps-uplpad{
  .header{
     height: 45px;
    border-bottom: 1px solid #dadada;
    margin: 0;
    padding: 0;
    line-height: 45px;
    vertical-align: middle;
    position: relative;
  }
  .btns{
    position: absolute;
    top: 7px;
    right: 0;
    line-height: 30px;
  }
  .uploader{
    list-style: none;
    margin: 0;
    padding-top: 5px;
  }
  .el-upload--picture-card{
    border: 0;
  }
  .el-upload-dragger{
    width: 148px;
    height: 148px;
  }
  .el-upload-list--picture-card .el-upload-list__item-name {
    display: block;
    position: absolute;
    top: 0px;
    background: rgba(0, 0, 0, 0.6);
    color: white;
    margin: 0;
    width: 100%;
  }
}
</style>
