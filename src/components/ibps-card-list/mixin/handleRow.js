
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
    }
  }
}
