<template>
  <div>
    <ibps-selector
      v-bind="$props"
      :icon="icon"
      :items="items"
      :multiple="multiple"
      :disabled="disabled"
      :readonly="readonly"
      :readonly-text="readonlyText"
      @click="handleSelectorClick"
      @remove="handleSelectorRemove"
    />
    <data-template-dialog
      :visible.sync="selectorVisible"
      :data="dataTemplate"
      :dynamic-params="dynamicParams"
      :multiple="multiple"
      :value="selectorValue"
      :label-key="labelKey"
      type="dialog"
      @close="visible=>selectorVisible =visible"
      @action-event="handleSelectorActionEvent"
    />
  </div>
</template>
<script>
import { getByKey, queryDataById } from '@/api/platform/data/dataTemplate'
import { valueEquals } from 'element-ui/src/utils/util'
import emitter from 'element-ui/src/mixins/emitter'
import DataTemplateDialog from '../preview'
import IbpsSelector from '@/components/ibps-selector/selector'
import { buildLabelTitle } from '../utils'

export default {
  components: {
    DataTemplateDialog,
    IbpsSelector
  },
  mixins: [emitter],
  props: {
    value: { // value
      type: [String, Number, Object, Array],
      default() {
        return this.multiple ? [] : {}
      }
    },
    dynamicParams: {// 动态参数
      type: Object
    },
    // 存储类型 ,
    // ①、id:只存储id 字符串，
    // ②、json： json字符串,
    store: {
      type: String,
      default: 'id',
      validator: function(value) {
        return ['id', 'json'].indexOf(value) !== -1
      }
    },
    storeSeparator: {// 存储值分割符,对应[多选]有效，对于设置字符串类型的分隔符
      type: String,
      default: ','
    },
    placeholder: {// 输入框占位文本
      type: String,
      default: '请选择'
    },
    multiple: { // 是否多选
      type: Boolean,
      default: false
    },
    disabled: { // 禁用
      type: Boolean,
      default: false
    },
    readonly: { // 只读
      type: Boolean,
      default: false
    },
    readonlyText: { // 只读样式
      type: String,
      default: 'text'
    },
    icon: {
      type: String,
      default: 'search-plus'
    },
    templateKey: {
      type: String,
      require: true
    }

  },
  data() {
    return {
      dataTemplate: {},
      labelKey: '',
      valueKey: '',
      selectorVisible: false,
      selectorValue: this.multiple ? [] : {},
      cacheData: {},
      bindIdValue: ''
    }
  },
  computed: {
    items() {
      if (this.$utils.isEmpty(this.selectorValue)) return []
      if (this.multiple) {
        return this.selectorValue.map(data => {
          return this.handleLabel(data)
        })
      } else {
        return [this.handleLabel(this.selectorValue)]
      }
    }
  },
  watch: {
    value: {
      handler(val, oldVal) {
        this.initData()
        if (!valueEquals(val, oldVal)) {
          this.dispatch('ElFormItem', 'el.form.change', val)
        }
      },
      immediate: true
    },
    dynamicParams(val, oldVal) {
      if (val !== oldVal) {
        this.initData()
      }
    }
  },
  created() {
    this.loadData()
  },
  methods: {
    loadData() {
      getByKey({
        dataTemplateKey: this.templateKey
      }).then(response => {
        this.dataTemplate = this.$utils.parseData(response.data)
        this.initDataTemplate()
        this.initData()
      }).catch(() => {
      })
    },
    initDataTemplate() {
      this.valueKey = this.dataTemplate.unique
      this.labelKey = buildLabelTitle(this.dataTemplate)
    },
    handleLabel(data) {
      const config = this.labelKey
      if (typeof config === 'function') {
        return config(data)
      } else if (typeof config === 'string') {
        return data[config]
      } else if (typeof config === 'undefined') {
        const dataProp = data['name']
        return dataProp === undefined ? '' : dataProp
      }
    },
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
          return data.map((d) => {
            return d[this.valueKey]
          })
        } catch (error) {
          console.warn(error)
          return []
        }
      } else if (this.store === 'id') { // id
        return value.split(this.storeSeparator)
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
            if (typeof this.labelKey === 'string') {
              o[this.labelKey] = v[this.labelKey]
              o['#title#'] = v[this.labelKey]
            } else {
              o['#title#'] = this.labelKey(v)
            }
            res.push(o)
          })
          return JSON.stringify(res)
        } else {
          const o = {}
          o[this.valueKey] = value[this.valueKey]
          if (typeof this.labelKey === 'string') {
            o[this.labelKey] = value[this.labelKey]
            o['#title#'] = value[this.labelKey]
          } else {
            o['#title#'] = this.labelKey(value)
          }
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
    getValue() {
      return this.getStoreValue(this.selectorValue)
    },
    /**
     * 通过ID获取数据
     */
    getDataInfo(id) {
      queryDataById({
        key: this.templateKey,
        id: id,
        dynamicParams: this.$utils.isNotEmpty(this.dynamicParams) ? JSON.stringify(this.dynamicParams) : null
      }).then(response => {
        const responseData = response.data
        if (this.$utils.isNotEmpty(responseData) && this.$utils.isNotEmpty(responseData.data)) {
          const data = responseData.data[0]
          this.cacheData[data[this.valueKey]] = data
          this.setSelectorValue(data[this.valueKey])
        }
      }).catch(() => {
      })
    },
    // ===================事件处理=========

    handleSelectorClick() {
      this.selectorVisible = true
      this.initData()
    },
    handleSelectorRemove(index) {
      if (this.multiple) {
        this.selectorValue.splice(index, 1)
      } else {
        this.selectorValue = {}
      }
      this.handleInput('')
      this.emitChange('')
    },

    handleSelectorActionEvent(buttonKey, data) {
      let val
      switch (buttonKey) {
        case 'ok':// 确定
          this.selectorVisible = false
          this.selectorValue = data
          this.setCacheData() // 设置缓存数据
          val = this.getValue()
          this.handleInput(val)
          this.emitChange(val)
          break
        case 'cleanClose': // 清空关闭
          this.selectorVisible = false
          this.selectorValue = this.multiple ? [] : {}
          this.handleInput('')
          this.emitChange('')
          break
        case 'cancel':// 取消
          this.selectorVisible = false
          break
        // TODO:自定义
      }
    },
    emitChange(val) {
      if (!valueEquals(this.value, val)) {
        this.$emit('change', val, this.selectorValue)
      }
    },
    handleInput(val) {
      this.$emit('input', val)
    }
  }
}
</script>

