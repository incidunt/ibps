<template>
  <el-dialog
    v-if="dialogVisible"
    ref="dialog"
    :title="title"
    :show-close="showClose"
    :close-on-click-modal="closeOnClickModal"
    :close-on-press-escape="closeOnPressEscape"
    :visible.sync="dialogVisible"
    :width="width"
    :top="marginTop"
    append-to-body
    custom-class="ibps-selector-dialog"
    class="ibps-selector-dialog__wrapper"
    @close="handleClose"
  >
    <div
      :style="{
        height:multiple?'60px':'40px'
      }"
      class="ibps-selector-header"
    >
      <el-tag
        v-for="(item,index) in selectedItems"
        :key="index"
        closable
        @close="handleRemove(index,true)"
      >{{ item }}</el-tag>
    </div>
    <!-- <div :style="bodyStyle"> -->
    <div>
      <slot
        :multiple="multiple"
        :height="height"
        :value="value"
      />
    </div>
    <div
      v-if="buttonGroup && buttonGroup.length >0"
      slot="footer"
      class="el-dialog--center"
    >
      <el-button
        v-for="(button,index) in buttonGroup"
        :key="index"
        :type="button.type"
        :icon="button.icon"
        @click="button.action"
      >
        {{ button.label }}
      </el-button>
    </div>
  </el-dialog>
</template>
<script>
export default {
  props: {
    visible: Boolean, // 是否可见
    title: { // 标题
      type: String,
      default: '选择器'
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
      default: '400px'
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
      type: [String, Function],
      default: 'name'
    },
    value: { // 值
      type: [Object, Array],
      default() { return this.multiple ? [] : {} }
    },
    cleanClose: {// 按钮清空并关闭
      type: Boolean,
      default: false
    },
    defaultButton: {
      type: Boolean,
      default: true
    },
    buttons: { // 按钮组
      type: Array,
      default() {
        return []
      }
    },
    confirmButtonText: {
      type: String
    },
    cleanButtonText: {
      type: String
    },
    cancelButtonText: {
      type: String
    },
    multiple: {// 是否多选
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      dialogVisible: this.visible
    }
  },
  computed: {
    selectedItems() {
      if (this.$utils.isEmpty(this.value)) { return [] }
      if (this.multiple) {
        return this.value.map(item => this.handleLabel(item))
      } else {
        return [this.handleLabel(this.value)]
      }
    },
    bodyStyle() {
      return {
        height: this.height,
        overflow: 'hidden'
      }
    },
    buttonGroup() {
      let buttons = []
      if (this.$utils.isEmpty(this.buttons) && this.defaultButton) {
        buttons = buttons.concat([
          { key: 'confirm', label: this.confirmButtonText || '确定', icon: 'ibps-icon-ok', type: 'primary', action: () => this.handleOk() },
          { key: 'clean', label: this.cleanButtonText || '清空', icon: 'ibps-icon-clean', type: 'success', action: () => this.handleClean() },
          { key: 'cancel', label: this.cancelButtonText || '取消', icon: 'ibps-icon-cancel', action: () => this.handleCancel() }
        ])
      } else {
        buttons = this.buttons
      }
      if (this.$utils.isEmpty(buttons)) {
        return []
      }
      return buttons.map(button => {
        if (button.action) {
          const action = button.action
          button.action = (e) => action(() => {}, this, e)
        }
        return button
      })
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
  methods: {
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
    // 确定
    handleOk() {
      const data = this.multiple ? this.value.slice(0) : this.value
      if (this.$utils.isEmpty(data)) {
        this.$message.closeAll()
        this.$message.warning('请选择记录！')
        return
      }
      this.$emit('input', data)
      this.$emit('action-event', 'confirm', data)
    },
    // 清空
    handleClean() {
      const data = this.multiple ? [] : {}
      if (!this.cleanClose) {
        this.$emit('input', data)
      }
      this.$emit('action-event', 'clean', data)
    },
    // 取消
    handleCancel() {
      this.handleClose()
      this.$emit('action-event', 'cancel')
    },
    // 关闭窗口
    handleClose() {
      this.$emit('close', false)
    },
    /**
     * 删除
     */
    handleRemove(index, bool) {
      let res
      if (this.multiple) {
        const selected = JSON.parse(JSON.stringify(this.value))
        selected.splice(index, 1)
        res = selected
      } else {
        res = {}
      }
      this.$emit('input', res)
    }
  }
}
</script>

<style lang="scss">
@import '@/assets/styles/components/selector-dialog.scss';
.stop-dblclick{
  position: absolute;
  display:inline-block;
  width:75px;
  height:34px;
}
</style>

