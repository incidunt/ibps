<template>
  <ibps-selector-dialog
    :value="selectedValue"
    :visible="selectorVisible"
    v-bind="$props"
    @input="value => selectedValue = value"
    @close="handleClose"
    @action-event="handleActionEvent"
  >
    <template slot-scope="scope">
      <bo-def-selector-panel
        v-bind="scope"
        @selected="value => selectedValue = value"
      />
    </template>
  </ibps-selector-dialog>
</template>
<script>
import IbpsSelectorDialog from '@/components/ibps-selector/dialog'
import BoDefSelectorPanel from './panel'
export default {
  components: {
    IbpsSelectorDialog,
    BoDefSelectorPanel
  },
  props: {
    visible: Boolean, // 是否可见
    title: { // 标题
      type: String,
      default: '表配置选择器'
    },
    marginTop: {// Dialog CSS 中的 margin-top 值
      type: String,
      default: '5vh'
    },
    width: {// 宽
      type: String,
      default: '60%'
    },
    height: {// 高
      type: String,
      default: '330px'
    },
    closeOnClickModal: {// 是否可以通过点击 modal 关闭 Dialog
      type: Boolean,
      default: false
    },
    closeOnPressEscape: {// 是否可以通过按下 ESC 关闭 Dialog
      type: Boolean,
      default: false
    },
    showClose: {// 是否显示关闭按钮
      type: Boolean,
      default: true
    },
    beforeClose: {// 关闭前的回调，会暂停 Dialog 的关闭
      type: Function
    },
    fullscreen: {// 是否为全屏 Dialog
      type: Boolean,
      default: false
    },
    labelKey: {// 展示的值
      type: String,
      default: 'tableComment'
    },
    value: { // value
      type: [Object, Array],
      default() { return this.multiple ? [] : {} }
    },
    cleanClose: {// 按钮清空并关闭
      type: Boolean,
      default: false
    },
    buttons: { // 按钮组
      type: Array
    },
    confirmButtonText: {
      type: String,
      default: '选择'
    },
    cleanButtonText: String,
    cancelButtonText: String,
    multiple: {// 是否多选
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      selectorVisible: false,
      selectedValue: this.multiple ? [] : {}
    }
  },
  watch: {
    visible: {
      handler: function(val, oldVal) {
        this.selectorVisible = this.visible
      },
      immediate: true
    },
    value() {
      this.selectedValue = this.value
    }
  },
  methods: {
    handleClose(visible) {
      this.$emit('close', visible)
    },
    handleActionEvent(key, data) {
      this.$emit('action-event', key, data)
    }
  }
}
</script>
