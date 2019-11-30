<template>
  <div>
    <ibps-selector
      v-bind="$props"
      :items="items"
      @click="handleClick"
      @remove="handleRemove"
    />
    <!-- 选择器 -->
    <app-key-selector-dialog
      :visible="selectorVisible"
      :value="selectorValue"
      :multiple="multiple"
      @close="visible => selectorVisible = visible"
      @action-event="handleSelectorActionEvent"
    />
  </div>
</template>
<script>
import { get } from '@/api/platform/auth/client'

import IbpsSelector from '@/components/ibps-selector/selector'
import AppKeySelectorDialog from './dialog'
export default {
  components: {
    IbpsSelector,
    AppKeySelectorDialog
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
      default: '请选择授权'
    },
    multiple: { // 是否多选
      type: Boolean,
      default: false
    },
    disabled: { // 禁用
      type: Boolean,
      default: false
    }

  },
  data() {
    return {
      selectorVisible: false,
      selectorValue: this.multiple ? [] : {},
      labelKey: 'clientKey',
      valueKey: 'id'
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
    value() {
      if (this.$utils.isEmpty(this.value)) {
        this.selectorValue = []
      } else {
        this.initSelectedValue()
      }
    }
  },
  mounted() {
    this.initSelectedValue()
  },
  methods: {
    initSelectedValue() {
      if (this.$utils.isEmpty(this.value)) {
        return
      }
      if (this.store === 'id') {
        get({
          authAppApiId: this.value
        }).then(response => {
          this.selectorValue = response.data
        }).catch(() => {
        })
      }
    },
    handleClick() {
      this.selectorVisible = true
    },
    handleRemove(index) {
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
          this.handleInput()
          break
      }
    },
    handleInput() {
      this.$emit('input', this.getValue())
    },
    getValue() {
      if (this.$utils.isEmpty(this.selectorValue)) return ''
      if (this.multiple) {
        return this.selectorValue.map((v) => {
          return v[this.labelKey]
        }).join(',')
      } else {
        return this.selectorValue[this.labelKey]
      }
    }
  }
}
</script>
