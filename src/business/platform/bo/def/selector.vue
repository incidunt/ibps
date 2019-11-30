<template>
  <div>
    <template v-if="!readonly">
      <ibps-selector
        v-bind="$props"
        :items="items"
        @click="handleSelectorClick"
        @remove="handleSelectorRemove"
      />
    </template>
    <template v-else>
      <el-tag>{{ value|optionsFilter(setDataInfoOptions,'label') }}</el-tag>
    </template>
    <!-- 选择器 -->
    <bo-def-selector-dialog
      :visible="selectorVisible"
      :value="selectorValue"
      :title="title"
      :multiple="multiple"
      :bo="bo"
      :height="height"
      :class="className"
      @close="visible => selectorVisible = visible"
      @action-event="handleSelectorActionEvent"
      @callback="callback"
    />
  </div>
</template>
<script>
import { get, queryByCode } from '@/api/platform/bo/boDef'
import { valueEquals } from 'element-ui/src/utils/util'
import emitter from 'element-ui/src/mixins/emitter'
import IbpsSelector from '@/components/ibps-selector/selector'
import BoDefSelectorDialog from './dialog'

export default {
  components: {
    IbpsSelector,
    BoDefSelectorDialog
  },
  inject: {
    elForm: {
      default: ''
    },
    elFormItem: {
      default: ''
    }
  },
  mixins: [emitter],
  props: {
    className: String,
    value: {
      type: [String, Number, Array]
    },
    // 存储类型 ,
    // ①、id:只存储id 字符串，
    // ②、json： json字符串,
    // ③、 array：存储数组数据(完整数据，包含key和value)。
    // ④、 bind：绑定ID，需要回调和返回
    store: {
      type: String,
      default: 'id',
      validator: function(value) {
        return ['id', 'json', 'array', 'arrayId', 'bind'].indexOf(value) !== -1
      }
    },
    storeSeparator: {// 存储值分割符,对应[多选]有效，对于设置字符串类型的分隔符
      type: String,
      default: ','
    },
    placeholder: {// 输入框占位文本
      type: String,
      default: '请选择业务对象'
    },
    multiple: { // 是否多选
      type: Boolean,
      default: false
    },
    disabled: { // 禁用
      type: Boolean,
      default: false
    },
    valueKey: {
      type: String,
      default: 'id'
    },
    labelKey: {
      type: String,
      default: 'name'
    },
    version: {
      type: [String, Number],
      default: '1'
    },
    readonly: { // 是否多选
      type: Boolean,
      default: false
    },
    bo: {
      type: Boolean,
      default: true
    },
    height: {// 高
      type: String,
      default: '400px'
    },
    title: {
      type: String,
      default: '业务对象选择器'
    }
  },
  data() {
    return {
      selectorVisible: false,
      selectorValue: this.multiple ? [] : {},
      cacheData: {},
      setDataInfoOptions: [],
      bindIdValue: ''
    }
  },
  computed: {
    items() {
      if (this.$utils.isEmpty(this.selectorValue)) return []
      if (this.multiple) {
        return this.selectorValue.map(data => {
          return data[this.labelKey]
        })
      } else {
        return [this.selectorValue[this.labelKey]]
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
    }
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
    getValue() {
      return this.getStoreValue(this.selectorValue)
    },
    /**
     * 通过ID获取数据
     */
    getDataInfo(id) {
      if (this.valueKey === 'id') {
        get({
          boDefId: id
        }).then(response => {
          const data = response.data
          this.setDataInfo(data)
        }).catch(() => {
        })
      } else if (this.valueKey === 'code') {
        queryByCode({
          code: id,
          version: this.version
        }).then(response => {
          const data = response.data
          if (data) {
            const dataResult = data.dataResult
            if (dataResult && dataResult.length > 0) {
              this.setDataInfo(dataResult[0])
            }
          }
        }).catch(() => {
        })
      }
    },
    setDataInfo(data) {
      this.setDataInfoOptions = [data].map(item => {
        return {
          value: item.id,
          label: item.name
        }
      })
      this.cacheData[data[this.valueKey]] = data
      this.setSelectorValue(data[this.valueKey])
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
      this.handleInput()
    },

    handleSelectorActionEvent(buttonKey, data) {
      switch (buttonKey) {
        case 'confirm':// 确定
          this.selectorVisible = false
          this.selectorValue = data
          this.setCacheData() // 设置缓存数据
          this.handleInput()
          this.handleChange(data)
          break
      }
    },
    handleInput() {
      this.$emit('input', this.getValue())
    },
    handleChange(data) {
      this.$emit('change', data)
    },
    callback(data) {
      this.$emit('callback', data)
    }

  }
}
</script>
