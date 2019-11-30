<template>
  <div v-if="actions && actions.length >0" class="form-toolbar hidden-print">
    <div
      :class="['ibps-toolbar--' +$ELEMENT.size]"
      class="ibps-toolbar"
    >
      <div class="header">
        <div class="buttons">
          <ibps-toolbar
            :actions="actions"
            @action-event="handleButtonEvent"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    /**
     * @description 工具栏
     */
    buttons: {
      type: Array
    }
  },
  data() {
    return {
      actions: []
    }
  },
  watch: {
    /**
     * 功能按钮
     */
    buttons: {
      handler: function(val, oldVal) {
        if (this.$utils.isEmpty(this.buttons)) {
          return null
        }
        const actions = []
        this.buttons.forEach((btn, i) => {
          const button = {
            key: btn.getAlias(),
            label: btn.getLabel(),
            icon: btn.getIcon(),
            type: btn.getStyle(),
            callback: () => {
              // 前置事件
              const result = this.beforeScript(btn.getAlias())
              if (!result) {
                return btn.action.apply(this, [btn])
              } else {
                return
              }
            }
          }
          actions.push(button)
        })
        this.actions = actions
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    handleButtonEvent(button, position, data, index) {
      var action = this.actions.find((action) => {
        return button.key === action.key
      })
      if (action) {
        action.callback()
      }
    },
    handleActionEvent(actionKey, args = {}) {
      this.$emit('action-event', actionKey, args)
    },
    beforeScript() {

    },
    getFormData() {
      // TODO
    },
    /**
     * 获取表单验证
     */
    validate(callback) {
      this.$emit('validate', callback)
    },
    // 处理表单提交验证
    getFormSubmitVerify() {
      return
    }
  }
}
</script>

