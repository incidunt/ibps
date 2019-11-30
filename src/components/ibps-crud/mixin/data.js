import _clonedeep from 'lodash.clonedeep'
import _debounce from 'lodash.debounce'
import _snakecase from 'lodash.snakecase'

import _get from 'lodash.get'
import _set from 'lodash.set'

export default {
  props: {
    /**
     * @description 表格数据
     */
    data: {
      type: Array,
      required: true
    },
    height: {
      type: [Number, String]
    }
  },
  data() {
    return {
      /**
       * @description 表格内部数据
       */
      ibpsData: [],
      /**
       *  @description 搜索框是否显示
       */
      showToolbar: true,
      /**
       * @description 表格的高度
       */
      tableHeight: null,
      /**
       * @description 工具栏的高度
       */
      toolbarBoxHeight: 0,
      /**
       * @description 选中的列
       */
      $selections: null,
      /**
       * @description 选中的选项
       */
      selectionRadio: ''
    }
  },
  computed: {
    ibpsDataLength() {
      return this.ibpsData.length
    },
    thatSocpe() {
      return this
    }
  },
  watch: {
    data() {
      this.handleDataChange()
    },
    ibpsData: {
      handler(val) {
        this.$emit('ibps-data-change', val)
      },
      deep: true
    },
    height() {
      this.handleTableHeight()
    }
  },
  mounted() {
    this.toolbarBoxHeight = this.$refs.toolbarBox ? this.$refs.toolbarBox.offsetHeight : 0
    this.handleDataChange()
    this.handleTableHeight()
    window.addEventListener('resize', this.handleResize)
  },
  methods: {
    /**
     * @description lodash.get
     */
    _get,
    /**
     * @description lodash.set
     */
    _set,
    /**
     * @description 同步外部表格数据到ibpsData内部
     */
    handleDataChange() {
      if (this.ibpsData !== this.data) {
        this.ibpsData = _clonedeep(this.data)
      }
    },
    /**
     * @description 排序状态
     */
    handleSortChange({ column, prop, order }) {
      let name = column ? column.sortBy : null
      if (!name && prop) { // 格式化默认排序字段
        name = _snakecase(prop).toUpperCase() + '_'
      }
      this.$emit('sort-change', { column, name, order })
    },
    /**
     * @description 更新行数据
     * @param {Number} index 表格数据索引
     * @param {Object} row 更新的表格行数据
     */
    updateRow(index, row) {
      this.$set(this.ibpsData, index, row)
    },
    /**
     * @description 新增行数据
     * @param {Object} row 新增的表格行数据
     */
    addRow(row) {
      this.$set(this.ibpsData, this.ibpsData.length, row)
    },
    /**
     * @description 删除行
     * @param {Object} index 被删除行索引
     */
    removeRow(index) {
      this.$delete(this.ibpsData, index)
    },
    handleResize() {
      this.handleTableHeight()
    },
    handleTableHeight(showToolbar) {
      if (this.height) {
        this.tableHeight = this.height
      } else if (this.$refs.ibpsCrud) {
        this.tableHeight = this.$refs.ibpsCrud.clientHeight
      }
      if (this.$refs.ibpsCrudHeader) {
        this.tableHeight -= this.$refs.ibpsCrudHeader.clientHeight
      }
      if (this.$refs.ibpsCrudFooter) {
        this.tableHeight -= this.$refs.ibpsCrudFooter.clientHeight
      }

      if (!this.tableHeight || this.tableHeight <= 0) { // 页面加载完成后设置高度
        _debounce(this.handleTableHeight, 100)()
      } else {
        if (showToolbar) {
          if (this.showToolbar) {
            this.tableHeight -= this.toolbarBoxHeight
          } else {
            this.tableHeight += this.toolbarBoxHeight
          }
        }
      }
    }
  }
}
