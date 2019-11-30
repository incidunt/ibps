<template>
  <div>
    <ibps-file-attachment-selector
      v-bind="$props"
      :items="items"
      @action-event="handleActionEvent"
    />
    <!-- 选择器 -->
    <ibps-uploader-selector-dialog
      :visible="selectorVisible"
      :value="selectorValue"
      :multiple="selectorMultiple"
      :file-size="fileSize"
      :limit="limit"
      :accept="accept"
      :file-ext="fileExt"
      @close="visible => selectorVisible = visible"
      @action-event="handleSelectorActionEvent"
    />
    <file-preview
      :file="attachment"
      :visible="filePreviewVisible"
      @close="visible => filePreviewVisible = visible"
    />
  </div>
</template>
<script>
import { get } from '@/api/platform/file/attachment'
import { downloadFile } from '@/business/platform/file/utils'
import IbpsFileAttachmentSelector from './index'
import IbpsUploaderSelectorDialog from '@/business/platform/file/uploader'
import FilePreview from '@/business/platform/file/file-preview'

export default {
  components: {
    IbpsFileAttachmentSelector,
    IbpsUploaderSelectorDialog,
    FilePreview
  },
  inject: {
    elForm: {
      default: ''
    },
    elFormItem: {
      default: ''
    }
  },
  props: {
    value: {
      type: [String, Number, Array]
    },
    store: {// / 存储类型 ，json： json字符串,id:只存储id， array：存储数组数据 ，arrayId: 字符串类型。
      type: String,
      default: 'id',
      validator: function(value) {
        return ['json', 'id', 'array', 'arrayId', 'bind'].indexOf(value) !== -1
      }
    },
    storeSeparator: {// 存储值分割符,对应[多选]有效，对于设置字符串类型的分隔符
      type: String,
      default: ','
    },
    placeholder: {// 输入框占位文本
      type: String,
      default: '请选择附件'
    },
    multiple: { // 是否多选
      type: Boolean,
      default: false
    },
    limit: { // 最大允许上传个数
      type: Number
    },
    accept: String, // 类型,
    fileExt: {
      type: Array,
      default: () => []
    },
    disabled: { // 禁用
      type: Boolean,
      default: false
    },
    readonly: { // 只读
      type: Boolean,
      default: false
    },
    download: {// 允许下载
      type: Boolean,
      default: true
    },
    fileSize: { // 上传尺寸
      type: Number
    },
    labelKey: {
      type: String,
      default: 'fileName'
    },
    valueKey: {
      type: String,
      default: 'id'
    },
    showExtName: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      selectorVisible: false,
      selectorValue: this.multiple ? [] : {},
      reselect: false, // 重新选择
      selectorMultiple: this.multiple,
      index: -1,
      cacheData: {},
      attachment: {},
      filePreviewVisible: false
    }
  },
  computed: {
    items() {
      if (this.$utils.isEmpty(this.selectorValue)) return []
      if (this.multiple) {
        return this.selectorValue.map(data => {
          return data[this.labelKey] + this.getExtName(data)
        })
      } else {
        return [this.selectorValue[this.labelKey] + this.getExtName(this.selectorValue)]
      }
    }
  },
  watch: {
    value() {
      if (this.$utils.isEmpty(this.value)) {
        this.selectorValue = []
      } else {
        this.initData()
      }
    }
  },
  mounted() {
    this.initData()
  },
  methods: {
    /**
     * 初始化数据
     */
    initData() {
      const data = this.getArrayValue(this.value)
      this.selectorValue = this.multiple ? [] : {}
      if (this.$utils.isEmpty(data)) {
        return
      }
      data.forEach(v => {
        if (this.cacheData[v]) {
          this.setSelectorValue(v)
        } else {
          this.getDataInfo(v)
        }
      })
    },
    setCacheData() {
      if (this.$utils.isEmpty(this.selectorValue)) return
      const data = this.multiple ? this.selectorValue : [this.selectorValue]
      data.forEach(v => {
        this.cacheData[v[this.valueKey]] = v
      })
    },
    setSelectorValue(v) {
      if (this.multiple) {
        this.selectorValue.push(this.cacheData[v])
      } else {
        this.selectorValue = JSON.parse(JSON.stringify(this.cacheData[v]))
      }
    },
    /**
     * 获得数组数据
     */
    getArrayValue(value, bindId) {
      if (this.$utils.isEmpty(value)) {
        return []
      }
      if (this.store === 'json') { // json
        try {
          const data = this.$utils.parseData(value)
          if (this.multiple) {
            return data.map((d) => {
              return d[this.valueKey]
            })
          } else {
            return [data]
          }
        } catch (error) {
          console.warn(error)
          return []
        }
      } else if (this.store === 'id') { // id
        return this.$utils.isString(value) ? value.split(this.storeSeparator) : []
      } else if (this.store === 'bind') { // 绑定id
        if (this.$utils.isEmpty(bindId)) {
          return []
        }
        return bindId.split(this.storeSeparator)
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
        if (this.multiple) {
          value.forEach(v => {
            const o = {}
            o[this.valueKey] = v[this.valueKey]
            o[this.labelKey] = v[this.labelKey]
            res.push(o)
          })
          return JSON.stringify(res)
        } else {
          const o = {}
          o[this.valueKey] = value[this.valueKey]
          o[this.labelKey] = value[this.labelKey]
          return JSON.stringify(o)
        }
      } else if (this.store === 'id') { // id
        if (this.$utils.isEmpty(value)) {
          return ''
        }
        if (this.multiple) {
          value.forEach(v => {
            res.push(v[this.valueKey])
          })
        } else {
          res.push(value[this.valueKey])
        }
        return res.join(this.storeSeparator)
      } else if (this.store === 'bind') { // 绑定id
        const res = []
        const bindIdValue = []
        value.forEach(v => {
          bindIdValue.push(v[this.valueKey])
          res.push(v[this.labelKey])
        })
        this.bindIdValue = bindIdValue.join(this.storeSeparator)

        return res.join(this.storeSeparator)
      } else { // 数组 array
        return value || []
      }
    },
    /**
     * 通过ID获取数据
     */
    getDataInfo(id) {
      get({
        attachmentId: id
      }).then(response => {
        const data = response.data
        this.cacheData[data[this.valueKey]] = data
        this.setSelectorValue(data[this.valueKey])
      }).catch(() => {
      })
    },
    getExtName(data) {
      if (!data) { return '' }
      if (this.showExtName && data['ext']) {
        return '.' + data['ext']
      }
      return ''
    },
    // ===================事件处理=========

    handleActionEvent(action, index) {
      this.index = index
      switch (action) {
        case 'select': // 选择
          this.selectorVisible = true
          this.selectorMultiple = this.multiple
          this.reselect = false
          break
        case 'reselect':// 重新选择
          this.selectorVisible = true
          this.selectorMultiple = false
          this.reselect = true
          break
        case 'remove' :// 删除
          this.handleRemove(index)
          break
        case 'download' :// 下载
          this.handleDownload(index)
          break
        case 'preview' : // 预览
          this.handlePreview(index)
          break
      }
    },
    /**
     * 处理删除
     */
    handleRemove(index) {
      if (this.multiple) {
        this.selectorValue.splice(index, 1)
      } else {
        this.selectorValue = {}
      }
      this.handleInput()
    },
    /**
     * 处理下载
     */
    handleDownload(index) {
      downloadFile(this.multiple ? this.selectorValue[index] : this.selectorValue)
    },
    /**
     * 处理预览
     */
    handlePreview(index) {
      this.attachment = this.multiple ? this.selectorValue[index] : this.selectorValue
      this.filePreviewVisible = true
    },
    /**
     *  确定
     */
    handleSelectorActionEvent(buttonKey, data) {
      switch (buttonKey) {
        case 'confirm':// 确定
          this.selectorVisible = false
          if (this.reselect) {
            this.selectorValue.splice(this.index, 1, data)
          } else {
            this.selectorValue = data
          }
          this.setCacheData()
          this.handleInput()
          break
      }
    },
    handleInput() {
      this.$emit('input', this.getStoreValue(this.selectorValue))
      // 提供一个返回实体，提供调用
      this.$emit('callback', this.selectorValue)
    }
  }
}
</script>
