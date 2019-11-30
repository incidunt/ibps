
export default {
  props: {
    isTree: {
      type: Boolean,
      default: false
    },
    /**
     *  尺寸
     */
    size: {
      type: String
    },
    /**
     * @description 工具栏
     */
    toolbars: {
      type: [Array, Boolean]
    },
    /**
     * @description 查询表单
     */
    searchForm: {
      type: Object
    },
    /**
     *  @description 表格标题
     */
    title: {
      type: String,
      default: ''
    },
    /**
     * @description 主键
     */
    pkKey: {
      type: String
    },
    /**
     * @description 表头数据
     */
    columns: {
      type: Array,
      required: true
    },
    /**
     * @description 表格加载
     */
    loading: {
      type: Boolean,
      default: false
    },
    /**
     * @description 表格加载配置
     */
    loadingOptions: {
      type: Object,
      default: null
    },
    /**
     * @description 表格配置
     */
    options: {
      type: Object,
      default: () => {
        return {
          border: true,
          stripe: true
        }
      }
    },
    /**
     * @description 索引
     */
    indexRow: {
      type: [Object, Boolean],
      default: true
    },
    /**
     * @description 多选
     */
    selectionRow: {
      type: [Object, Boolean],
      default: true
    },
    /**
     * @description 类型
     * [可选值] radio/checkbox
     */
    selectionType: {
      type: String,
      default: 'checkbox'
    }
  },
  methods: {
    clearSelection() {
      if (this.selectionType === 'radio') {
        this.selectionRadio = ''
      } else {
        this.$refs.elTable.clearSelection()
      }
    },
    toggleRowSelection(row, selected) {
      if (this.selectionType === 'radio') {
        this.selectionRadio = row ? row[this.pkKey] : ''
      } else {
        this.$refs.elTable.toggleRowSelection(row, selected)
      }
    },
    toggleAllSelection() {
      this.$refs.elTable.toggleAllSelection()
    },
    /**
     * @description 处理工具栏收缩/展开
     */
    handleCollapseExpandToolbar() {
      this.showToolbar = !this.showToolbar
      this.handleTableHeight(true)
      this.$emit('collapse-expand-toolbar', this.showToolbar)
    },
    /**
     * @description 行选中状态
     */
    handleCurrentChange(currentRow, oldCurrentRow) {
      this.$emit('current-change', currentRow, oldCurrentRow)
    },
    /**
     * @description 勾选数据时触发的事件
     */
    handleSelect(selection, row) {
      this.$emit('select', selection, row)
    },
    /**
     * @description 勾选全选时触发的事件
     */
    handleSelectAll(selection) {
      this.$emit('select-all', selection)
    },
    /**
     * @description 复选框选择项发生变化时触发的事件
     */
    handleSelectionChange(selection) {
      this.$selections = selection
      this.$emit('selection-change', selection)
    },
    /**
     * @description 单元格 hover 进入时触发的事件
     */
    handleCellMouseEnter(row, column, cell, event) {
      this.$emit('cell-mouse-enter', row, column, cell, event)
    },
    /**
     * @description 单元格 hover 退出时触发的事件
     */
    handleCellMouseLeave(row, column, cell, event) {
      this.$emit('cell-mouse-leave', row, column, cell, event)
    },
    /**
     * @description 单元格点击时触发的事件
     */
    handleCellClick(row, column, cell, event) {
      this.$emit('cell-click', row, column, cell, event)
    },
    /**
     * @description 单元格双击时触发的事件
     */
    handleCellDblclick(row, column, cell, event) {
      this.$emit('cell-dblclick', row, column, cell, event)
    },
    /**
     * @description 行点击时触发的事件
     */
    handleRowClick(row, event, column) {
      // 点击行，触发选中
      if (this.selectionType === 'radio') {
        this.selectionRadio = row[this.pkKey]
        this.$emit('selection-change', row)
      } else {
        this.$refs.elTable.toggleRowSelection(row)
      }
      this.$emit('row-click', row, event, column)
    },
    /**
     * @description 行右键点击时触发的事件
     */
    handleRowContextmenu(row, event) {
      this.$emit('row-contextmenu', row, event)
    },
    /**
     * @description 行双击时触发的事件
     */
    handleRowDblclick(row, event) {
      this.$emit('row-dblclick', row, event)
    },
    /**
     * @description 表头点击时触发的事件
     */
    handleHeaderClick(column, event) {
      this.$emit('header-click', column, event)
    },
    /**
     * @description 表头右键点击时触发的事件
     */
    handleHeaderContextmenu(column, event) {
      this.$emit('header-contextmenu', column, event)
    },
    /**
     * @description 处理按钮的事件 【包含增删改查】
     * @param {*} button
     * @param {*} position
     * @param {*} data
     */
    handleActionEvent(action, position, data, index) {
      if (action.emit) {
        this.$emit(action.emit, {
          key: action.key,
          index: index,
          row: data,
          position: position,
          action: action })
      }
      const buttonKey = action.key
      let selection = null// 选中数据
      if (position === 'toolbar') { // 工具栏
        selection = this.getSelectedIds()
      } else { // 管理列
        selection = data ? data[this.pkKey || 'id'] : null
      }
      this.$emit('action-event', buttonKey, position, selection, data, index)
    },
    /**
     * @description 获取选中的值
     */
    getSelectedIds() {
      if (this.selectionType === 'radio') {
        if (this.selectionRadio === null || this.selectionRadio === undefined) {
          return
        }
        return this.selectionRadio
      } else {
        if (this.$selections === null || this.$selections === undefined) {
          return
        }
        const pkKey = this.pkKey || 'id'
        const ids = []
        this.$selections.map((item) => {
          ids.push(item[pkKey])
        })
        return ids
      }
    }

  }
}
