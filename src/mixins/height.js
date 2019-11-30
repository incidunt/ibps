/**
 * 高度修复
 */
export default {
  mounted() {
    this.height = this.fixHeight()
    window.addEventListener('resize', this.handleResize)
  },
  methods: {
    handleResize() {
      this.height = this.fixHeight()
    },
    fixHeight() {
      const parentHeight = this.$parent.$el.offsetHeight
      // header 高度
      const header = this.$parent.$el.getElementsByClassName('ibps-theme-header')
      let headerHeight = 0
      if (header && header[0]) {
        headerHeight = header[0].offsetHeight || 60
      }
      // tab 高度
      const tabs = this.$parent.$el.getElementsByClassName('ibps-multiple-page-control-group')
      let tabHeight = 0
      if (tabs && tabs[0]) {
        tabHeight = 40
      }
      return parentHeight - headerHeight - tabHeight
    }
  }
}
