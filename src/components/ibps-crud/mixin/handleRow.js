
export default {
  props: {
    /**
     * @description 管理列
     */
    rowHandle: {
      type: Object,
      default: null
    }
  },
  computed: {
    rowHandleActions() {
      return this.rowHandle ? this.rowHandle.actions : null
    },
    rowHandleDefaultWidth() {
      return this.$i18n.locale === 'en' ? 70 : 50
    }
  },
  methods: {
    /**
     * 是否有按钮
     * @param {*} row
     * @param {*} data
     */
    hasRowHandleActions(row, data) {
      if (!this.rowHandleActions) return false
      for (let i = 0; i < this.rowHandleActions.length; i++) {
        if (this.handleActionHidden(this.rowHandleActions[i].hidden, row, data)) {
          return true
        }
      }
      return false
    },
    /**
     * 处理按钮隐藏，显示
     */
    handleActionHidden(hidden = false, row, data) {
      let isHidden = !hidden
      if (typeof hidden === 'boolean') {
        isHidden = !hidden
      } else if (typeof hidden === 'function') {
        isHidden = !hidden.call(row, data)
      }
      return isHidden
    }
  }
}
