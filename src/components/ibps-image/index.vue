<template>
  <div class="ibps-image">
    <!--展示-->
    <ul class="ibps-p-0">
      <li
        v-for="(item, index) in fileList"
        :key="index"
        class="image-reader-item"
        :style="{
          'backgroundImage': 'url(' + getImageUrl(item.id) + ')' ,
          'backgroundPosition': 'center center',
          'backgroundRepeat': 'no-repeat',
          'backgroundSize': 'cover',
          'width':`${width}px`,
          'height':`${height}px`
        }"
        @click="showViewer(item, index)"
        @mouseover="showTips(item, index)"
        @mouseout="hideTips(item, index)"
      >
        <el-tag
          v-if="!disabled"
          class="image-reader-item-tag"
          @click.stop="onDeleteImage(index)"
        >
          <i class="el-icon-delete" />
        </el-tag>
        <el-tag
          class="image-reader-item-tag"
          @click.stop="onDownloadImage( index)"
        >
          <i class="el-icon-download" />
        </el-tag>
        <div
          :class="{'image-tip-visible':item.uid !== uid,'image-tip':item.uid === uid}"
          v-text="tip"
        />
      </li>
    </ul>
    <template v-if="!disabled">
      <!--ibps 附件上传方式-->
      <el-upload
        v-if="uploadType === 'attachment'"
        :style="uploadStyle"
        :action="action"
        :disabled="true"
        :file-list="fileList"
        list-type="picture-card"
        @click.native="clickAttachmentUpload"
      >
        <i class="el-icon-plus" />
      </el-upload>
      <!--默认附件上传方式-->
      <el-upload
        v-else
        :style="uploadStyle"
        action="action"
        list-type="picture-card"
        :http-request="httpRequest"
        :on-remove="handleRemove"
        :on-success="handleSuccess"
        :file-list="fileList"
        :multiple="multiple"
        :accept="accept"
        :limit="limit"
        :disabled="disabled"
        :on-change="handleChange"
        :on-exceed="handlePicAmount"
        :before-upload="beforeUpload"
      >
        <i class="el-icon-plus" />
      </el-upload>
    </template>
    <!--预览-->
    <el-dialog :visible.sync="dialogVisible" append-to-body title="查看图片">
      <el-carousel
        ref="carousel"
        trigger="click"
        indicator-position="outside"
        height="400px"
        :initial-index="viewerIndex"
        :autoplay="false"
      >
        <template v-if="dialogVisible">
          <el-carousel-item v-for="(item,index) in fileList" :key="index" :name="item.id">
            <img width="100%" height="100%" :src="getImageUrl(item.id)" alt="">
          </el-carousel-item>
        </template>
      </el-carousel>
    </el-dialog>

    <ibps-uploader-selector-dialog
      :visible="uploaderSelectorVisible"
      :value="value"
      :multiple="multiple"
      :accept="accept"
      @close="visible => uploaderSelectorVisible = visible"
      @action-event="handleUpload"
    />
  </div>
</template>

<script>
import { uploadFile, previewFile } from '@/api/platform/file/attachment'
import { downloadFile } from '@/business/platform/file/utils'
import { valueEquals } from 'element-ui/src/utils/util'
import emitter from 'element-ui/src/mixins/emitter'
import IbpsUploaderSelectorDialog from '@/business/platform/file/uploader'

export default {
  name: 'ibps-image',
  components: {
    IbpsUploaderSelectorDialog
  },
  mixins: [emitter],
  props: {
    value: {
      type: [String, Number, Array, Object]
    },
    size: [Number, String], // 限制大小
    accept: String, // 限制图片类型
    tip: String, // 提示消息
    limit: [Number, String], // 上传数量
    // quality: Number, // 压缩质量
    width: { // 宽
      type: String,
      default: '150'
    },
    height: { // 高
      type: String,
      default: '150'
    },
    disabled: { // 是否禁用
      type: Boolean,
      default: false
    },
    multiple: { // 是否支持选择多张
      type: Boolean,
      default: true
    },
    uploadType: { // 上传方式 （ default:直接打开上传，attachment：ibps上传附件打开上传 ）
      type: String,
      default: 'attachment'
    },

    store: {
      type: String,
      default: 'json',
      validator: function(value) {
        return ['id', 'json', 'array', 'arrayId', 'bind'].indexOf(value) !== -1
      }
    },
    labelKey: { // 展示的值
      type: String,
      default: 'fileName'
    },
    valueKey: { // 存储唯一值
      type: String,
      default: 'id'
    }
  },
  inject: {
    elForm: {
      default: ''
    },
    elFormItem: {
      default: ''
    }
  },
  data() {
    return {
      action: 'https://www.bpmhome.cn/post',
      fileList: [],
      viewerIndex: 0,
      dialogVisible: false,
      uploaderSelectorVisible: false,
      isActive: false,
      uid: ''
    }
  },
  computed: {
    uploadStyle() {
      const { width, height } = this
      return {
        'width': `${width}px`,
        'height': `${height}px`,
        'lineHeight': `${height}px`,
        'display': 'inline'
      }
    }
  },
  watch: {
    value(val, oldVal) {
      this.setValue()
      if (!valueEquals(val, oldVal)) {
        this.dispatch('ElFormItem', 'el.form.change', val)
      }
    },
    fileList: {
      handler(val, oldVal) {
        this.$emit('input', this.getValue())
      },
      deep: true
    }
  },
  mounted() {
    this.setValue()
    // console.log(this.accept, 'kkkk')
  },
  methods: {
    setValue() {
      if (this.$utils.isEmpty(this.value)) {
        this.fileList = []
        return
      }
      // TODO: id展示问题
      this.fileList = this.getArrayValue(this.value)
    },
    /**
     * 获得数组数据
     */
    getArrayValue(value) {
      if (this.$utils.isEmpty(value)) {
        return []
      }
      if (this.store === 'json') { // json
        try {
          return this.$utils.parseData(value)
        } catch (error) {
          console.warn(error)
          return []
        }
      } else if (this.store === 'id') { // id
        return this.$utils.isString(value) ? value.split(this.storeSeparator) : []
      } else { // array
        return value.map((d) => {
          return d[this.valueKey]
        })
      }
    },
    getStoreValue(value) {
      const res = []
      if (this.store === 'json') { // json
        if (this.$utils.isEmpty(value)) {
          return ''
        }
        value.forEach(v => {
          const o = {}
          o[this.valueKey] = v[this.valueKey]
          o[this.labelKey] = v[this.labelKey]
          res.push(o)
        })
        return JSON.stringify(res)
      } else if (this.store === 'id') { // id
        if (this.$utils.isEmpty(value)) {
          return ''
        }
        value.forEach(v => {
          res.push(v[this.valueKey])
        })
        return res.join(this.storeSeparator)
      } else { // 数组 array
        return value || []
      }
    },
    getValue() {
      return this.getStoreValue(this.fileList)
    },
    showTips(item, index) {
      this.uid = item.uid
      // item.isActive = true
    },
    hideTips(item, index) {
      this.uid = ''
    },
    /**
     * 文件上传
     */
    httpRequest(options) {
      return uploadFile(options.file, {})
    },
    /**
     * 上传方式为ibps附件上传时
     */
    clickAttachmentUpload() {
      this.uploaderSelectorVisible = true
    },
    handleSuccess(response, file, fileList) {
      if (this.dis) {
        this.fileList = fileList.map(item => {
          item.isActive = false
          return item
        })
      }
    },
    handleChange(file, fileList) {
      this.fileList = fileList
    },
    handleRemove(file, fileList) {
      this.fileList = fileList
    },
    // 预览
    showViewer(file, index) {
      this.viewerIndex = index
      this.dialogVisible = true
    },
    /**
     *  删除图片
     */
    onDeleteImage(index) {
      this.fileList.splice(index, 1)
    },
    // 下载
    onDownloadImage(index) {
      downloadFile(this.fileList[index])
    },
    // 图片上传数量限制
    handlePicAmount(files, fileList) {
      if (this.multiple && this.limit) {
        this.$message.closeAll()
        this.$message({
          message: `图片上传上限${this.limit}张`,
          type: 'warning'
        })
      }
    },
    // 格式、大小限制
    beforeUpload(file) {
      const isType = this.accept ? file.type.includes(this.accept) : true
      if (!isType) {
        this.$message.closeAll()
        this.$message.error(`上传图片的格式为${this.accept}`)
      }
      const isLimitSize = this.size ? (file.size / 1024 / 1024 < this.size) : true
      if (!isLimitSize) {
        this.$message.closeAll()
        this.$message.error(`上传图片的大小不能超过 ${this.size}M!`)
      }
      return isLimitSize && isType
    },
    handleUpload(buttonKey, data) {
      data.forEach(d => {
        this.fileList.push(d)
      })
      this.uploaderSelectorVisible = false
    },
    getImageUrl(id) {
      return previewFile(id)
    }
  }
}
</script>
<style lang="scss">
.ibps-image {
  .el-upload-list--picture-card {
    display: none;
  }
  .el-upload--picture-card{
    width: inherit;
    height: inherit;
    line-height: inherit;
  }
  .image-reader-item {
    position: relative;
    float: left;
    width: 23.5%;
    margin-bottom: 2%;
    margin-right: 2%;
    background: #FFF;
    box-shadow: 0 5px 20px rgba(197, 202, 213, .25);
    box-sizing: border-box;
    list-style: none;
    border-radius: 4px;
    background-size: cover;
    overflow: hidden;
    .image-reader-item-tag{
      background: #111A34;
      color: #fff;
      float: right;
      border-radius: 0;
      padding: 0 10px;
      border: 0;
    }
    .image-tip-visible {
      display: none
    }
    .image-tip {
      position: absolute;
      bottom: 0;
      color: #fff;
      background: #111A34;
      font-size: 12px;
      width: 100%;
    }
  }
  .el-dialog__header{
    background: #FFF;
  }
  .el-dialog__headerbtn{
    position:absolute;
    top:10px;
  }
}
</style>
