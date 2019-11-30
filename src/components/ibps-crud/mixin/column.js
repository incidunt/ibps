
import Vue from 'vue'
// 列处理
export default {
  methods: {
    /**
     * 获取标签的值
     * @param {*} options
     * @param {*} val
     */
    getOption(options, val, column = {}) {
      return options.find(x => x[column['valueKey'] || 'value'] === val)
    },
    /**
     * 处理列表
     * @param {*} key
     * @param {*} options
     * @param {*} val
     */
    handleColumnOptions(key, options, val, column = {}) {
      const defaultLabel = column.defaultLabel
      const opt = this.getOption(options, val, column)
      if (!opt) { return defaultLabel || val }
      if (key === 'type') {
        return opt[column['typeKey'] || 'type'] || 'primary'
      } else if (key === 'label') {
        return opt[column['labelKey'] || 'label'] || defaultLabel || val
      }
      return defaultLabel || val
    },
    handleColumnDataConvert(data, separator = ',') {
      if (this.$utils.isEmpty(data)) {
        return []
      }
      return data.split(separator)
    },
    /**
     * 处理字段链接
     */
    handleColumnLink(column, row) {
      if (!column.linkType) {
        return this.$emit('column-link-click', row, column)
      }
      // default、默认是回调
      // open :打开新的页面
      // dialog、打开指定窗口
      // tab 、打开tab
      switch (column.linkType) {
        case 'tab':
          this.$router.push({
            path: column.link
          })
          break
        case 'open':
          this.$util.open(column.link)
          break
        case 'dialog':
          this.$emit('column-link-click', row, column)
          break
        default:
          this.$emit('column-link-click', row, column)
          break
      }
    },
    handleColumnFilter(filter, value) {
      return Vue.filter(filter)(value)
    }
  }
}
