<template>
  <el-dialog
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    class="form-print-edit-dialog"
    fullscreen
    append-to-body
    custom-class="no-dialog-header"
    @open="loadData"
    @close="closeDialog"
  >
    <el-row class="print-header">
      <el-col :span="8">
        <el-input v-model="templateName" placeholder="请输入内容" />
      </el-col>
      <el-col :span="16" style="text-align:right">
        <el-button type="primary">保存</el-button>
        <el-button type="danger" @click="closeDialog">关闭</el-button>
      </el-col>
    </el-row>
    <el-row v-if="show" class="hot-table-wrap">
      <el-col :span="4">
        <el-tabs v-model="activeName" class="hot-card" type="card">
          <el-tab-pane label="表单字段" name="formField">
            <vue-draggable
              v-model="formItems"
              :clone="onClone"
              element="ul"
              class="field-list"
              v-bind="draggableOptions"
            >
              <li v-for="item in formItems" :key="item.id" class="field-list-item"><i class="el-icon-menu" /><span>{{ item.name }}</span></li>
            </vue-draggable>
          </el-tab-pane>
          <el-tab-pane label="流程字段" name="flowField">
            <ul class="field-list">
              <li class="field-list-item"><i class="el-icon-menu" /><span>流程图</span></li>
            </ul>
          </el-tab-pane>
          <el-tab-pane label="系统字段" name="systemField">
            <ul class="field-list">
              <li class="field-list-item"><i class="el-icon-menu" /><span>条形码</span></li>
            </ul>
          </el-tab-pane>
        </el-tabs>
      </el-col>
      <el-col :span="20">
        <div class="hot-table-content">
          <Menu-tools
            :disabled="menuToolsDisable"
            :is-undo-available="isUndoAvailable"
            :is-redo-available="isRedoAvailable"
            :is-merge="isCellMerge"
            :is-bold="isBold"
            :is-italic="isItalic"
            :is-underline="isUnderline"
            :vertical-align="verticalAlign"
            :text-align="textAlign"
            @undoRedo="undoRedo"
            @merge="merge"
            @insertOrRemove="insertOrRemove"
            @setRangeCellStyle="setRangeCellStyle"
            @setBorder="setBorder"
            @rowHeightChange="rowHeightChange"
            @pageSizeChange="pageSizeChange"
            @setCellImage="setCellImage"
            @viewPrintHeaderAndFooter="viewPrintHeaderAndFooter"
          />
          <div
            class="hot-table-wrap"
            :class="{'hot-word-bread-normal':hotTableClassName}"
          >
            <hot-table
              ref="hotTableComponent"
              :root="root"
              :settings="hotSettings"
              license-key="non-commercial-and-evaluation"
            />
          </div>
        </div>
      </el-col>
    </el-row>
    <component :is="template" v-if="template" />
  </el-dialog>
</template>
<script>
import 'handsontable/dist/handsontable.full.css'
import { HotTable } from '@handsontable/vue'
import MenuTools from './component/menu-tools'
import Handsontable from 'handsontable'
import { isNull } from 'util'
import VueDraggable from 'vuedraggable'
import Dialog from '@/utils/dialog'
const PrintPage = require('./component/print-page').default

const hotOptions = {
  rows: [],
  rowHeight: 24,
  cols: [],
  colWidth: 100,
  style: {},
  image: {}
}

export default {
  components: {
    HotTable,
    MenuTools,
    VueDraggable
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    const self = this
    return {
      dialogVisible: this.visible,
      menuToolsDisable: true,
      template: null,
      activeName: 'formField',
      root: 'hot',
      hotSettings: {
        selectionMode: 'multiple',
        minRows: 100, // 最小行列
        minCols: 25,
        maxRows: 200,
        maxCols: 50,
        rowHeaderWidths: 50,
        columnHeaderHeights: 25,
        // colWidths: 100,
        colHeaders: true,
        allowInsertRow: true,
        allowInsertColumn: true,
        allowRemoveColumn: true,
        allowRemoveRow: true,
        autoWrapRow: false,
        // autoRowSize: true,
        // autoColumnSize: true,
        outsideClickDeselects: false,
        rowHeaders: true,
        headerTooltips: true,
        manualColumnMove: true,
        manualRowMove: true,
        hasEditor: true,
        hasPaperBorder: true,
        manualColumnResize: true, // 拖拽行头或列头改变行或列的大小
        manualRowResize: true, // 拖拽行头或列头改变行或列的大小
        mergeCells: true,
        renderAllRows: true,
        customBorders: true,
        className: 'fx_print_table',
        fillHandle: true,
        undo: true,
        contextMenu: {
          callback: function(key, options) {
            const type = {
              '_insert_row': 'insert_row',
              '_remove_row': 'remove_row',
              '_insert_col': 'insert_col',
              '_remove_col': 'remove_col'
            }
            switch (key) {
              case 'merge':
              case 'unMerge':
                self.merge(key === 'merge')
                break
              case '_insert_row':
              case '_remove_row':
              case '_insert_col':
              case '_remove_col':
                self.insertOrRemove(type[key])
                break
              case 'rowHeight':
              case 'colWidth':
                self.setSize(key)
                break
              case 'empty':
                self.clearCellData()
            }
          },
          items: {
            '_insert_row': {
              name: '插入行'
            },
            '_remove_row': {
              name: '删除行'
            },
            'rowHeight': {
              name: '行高(R)'
            },
            'hsep1': '---------',
            '_insert_col': {
              name: '插入列'
            },

            '_remove_col': {
              name: '删除列'
            },
            colWidth: {
              name: '列宽(C)'
            },
            'hsep2': '---------',
            merge: {
              name: '合并',
              disabled: function() {
                const cellRange = this.getSelectedRange()
                if (Array.isArray(cellRange) && cellRange.length) {
                  const range = {
                    row: cellRange[0].from.row,
                    col: cellRange[0].from.col,
                    row2: cellRange[0].to.row,
                    col2: cellRange[0].to.col
                  }
                  return self.checkCellMerge(range.row, range.col, range.row2, range.col2)
                }
                return false
              }
            },
            unMerge: {
              name: '取消合并',
              disabled: function() {
                const cellRange = this.getSelectedRange()
                if (Array.isArray(cellRange) && cellRange.length) {
                  const range = {
                    row: cellRange[0].from.row,
                    col: cellRange[0].from.col,
                    row2: cellRange[0].to.row,
                    col2: cellRange[0].to.col
                  }
                  return !self.checkCellMerge(range.row, range.col, range.row2, range.col2)
                }
                return true
              }
            },
            empty: {
              name: '清除内容'
            }
          }
        },
        // afterOnCellMouseOver(event, cellCoords, td) {
        //   this.selectCell(cellCoords.row, cellCoords.col)
        // },
        afterChange: function(changes, source) { // 数据改变时触发此方法
          self.menuToolsDisable = false
        },
        afterBeginEditing() {
          self.menuToolsDisable = true
        },
        afterInit() {
          self.menuToolsDisable = false
        },
        afterSelectionEnd: function(row, column, row2, column2) {
          self.checkCellMerge(row, column, row2, column2)
          self.checkCellFontStyle(this.getCell(row, column))
        },
        rowHeights(col) {
          const rows = hotOptions.rows
          return rows && rows.length > col && rows[col] ? rows[col] : hotOptions.rowHeight
        },
        colWidths: function(row) {
          var col = hotOptions.cols
          return col && col.length > row && col[row] ? col[row] : hotOptions.colWidth
        },
        cells(row, col) {
          const cellProperties = {}

          const image = hotOptions.image[`${row}:${col}`]
          cellProperties.readOnly = !!image
          return cellProperties
        },
        renderer: function(instance, TD, row, col, prop, value, cellProperties) {
          // console.log(arguments)
          const tdStye = hotOptions.style[`${row}:${col}`]
          const td = TD
          if (tdStye) {
            let tdClass = td.className
            tdClass = tdClass.replace(/ff-[a-zA-Z]{3,}/, '').replace(/fs-[0-9]{1,2}/, '')
            const classNmes = ''
            tdClass += Object.values(tdStye).join(' ')
            tdClass += ' '
            tdClass += classNmes
            td.className = tdClass
          }
          Handsontable.renderers.TextRenderer.apply(this, arguments)
          let text = isNull(value) ? '' : value
          const image = hotOptions.image[`${row}:${col}`]
          if (image) {
            text = `<div class="cell-image" style="background-image:url(${image})"></div>`
          }
          td.innerHTML = '<div class="content"><div class="data">' + text + '</div></div>'
          return td
        }
      },
      hotTableClassName: '',
      isUndoAvailable: false,
      isRedoAvailable: false,
      templateName: '未命名模版',
      hotTableComponentRef: null,
      isCellMerge: false,
      show: false,
      isBold: false,
      isItalic: false,
      isUnderline: false,
      verticalAlign: 'middle',
      textAlign: 'left',
      cellBorderStyle: '',
      paperHorizontal: {
        top: 0,
        left: 0
      },
      paperVertical: {
        top: 0,
        left: 0
      },
      formItems: [
        {
          name: '主键',
          id: 1
        },
        {
          name: '副键',
          id: 2
        }
      ],
      draggableOptions: {
        sort: false,
        ghostClass: 'ghost',
        draggable: '.field-list-item',
        group: {
          name: 'formItems',
          pull: 'clone',
          put: false
        }
      }
    }
  },
  watch: {
    visible: {
      handler: function(val, oldVal) {
        console.log(val)
        this.dialogVisible = this.visible
      },
      immediate: true
    }
  },
  mounted() {
    this.show = true
    this.initHotTableComponent()
  },
  methods: {
    async viewPrintHeaderAndFooter() {
      try {
        await Dialog(PrintPage, {
          dialog: {
            modalAppendToBody: false,
            width: '100%',
            top: '100px',
            center: true,
            title: '页眉页脚设置',
            'custom-class': 'print-page-dialog'
          },
          props: {

          }
        }, (template) => {
          this.template = template
        })
        this.template = null
      } catch (e) {
        this.template = null
      }
    },
    onClone() {
      console.log(arguments)
    },
    addValue() {
      console.log(arguments)
    },
    setCellImage(url = 'https://ss1.baidu.com/6ONXsjip0QIZ8tyhnq/it/u=1020177694,3459150734&fm=85&app=63&f=JPG?w=121&h=75&s=2B843A62FBF3B9EB1699D9020000E0E2') {
      const selected = this.hotTableComponentRef.hotInstance.getSelected()
      if (!selected) { return }
      const range = selected[0]
      const row = range[0]
      const col = range[1]
      if (!hotOptions.image[`${row}:${col}`]) {
        hotOptions.image[`${row}:${col}`] = ''
      }
      this.afterSetCellImage(row, col, url)
    },
    // 设置单元格图片后
    afterSetCellImage(row, col, url) {
      const e = new this.hotTableComponentRef.hotInstance.undoRedo.CellSetImageChangeAction({
        params: {
          row,
          col,
          value: hotOptions.image[`${row}:${col}`],
          newValue: url
        }
      })
      hotOptions.image[`${row}:${col}`] = url
      this.afterHotChange(e)
      this.hotTableComponentRef.hotInstance.render()
      this.checkRedoAndUndo()
    },
    // 标线变更
    pageSizeChange(params, size) {
      console.log(arguments)
      const countRows = this.hotTableComponentRef.hotInstance.countRows()
      const countCols = this.hotTableComponentRef.hotInstance.countCols()
      const s = size
      // let row = 0
      let height = 0
      // let col = 0
      let width = 0
      // const rows = []
      // const cols = []
      for (let r = 0; r < countRows; r++) {
        const rowHeight = this.hotTableComponentRef.hotInstance.getRowHeight(r)
        height += rowHeight
        if (height > s.height) {
          height -= rowHeight
          break
        }
        // rows.push(rowHeight)
        // row = r
      }

      for (let c = 0; c < countCols; c++) {
        const colWidth = this.hotTableComponentRef.hotInstance.getColWidth(c)
        width += colWidth
        if (width > s.width) {
          width -= colWidth
          break
        }
        // cols.push(colWidth)
        // col = c
      }

      // this.paperHorizontal = {
      //   top: height + this.hotSettings.columnHeaderHeights,
      //   left: this.hotSettings.rowHeaderWidths
      // }

      const paperHorizontal = {
        top: (height + this.hotSettings.columnHeaderHeights) + 'px',
        left: (this.hotSettings.rowHeaderWidths) + 'px'
      }

      const paperVertical = {
        top: (this.hotSettings.columnHeaderHeights) + 'px',
        left: (width + this.hotSettings.rowHeaderWidths) + 'px'
      }

      // this.paperVertical = {
      //   top: this.hotSettings.columnHeaderHeights,
      //   left: width + this.hotSettings.rowHeaderWidths
      // }

      const $el = document.querySelector(`.ht_master .wtHider`)

      this.createElement($el, 'paper-vertical', paperVertical)
      this.createElement($el, 'paper-horizontal', paperHorizontal)
    },
    // 生成标线
    createElement($el, className, styles) {
      const el = document.querySelector(`.${className}`)
      if (el) {
        for (const key in styles) {
          el.style[key] = styles[key]
        }
      } else {
        const div = document.createElement('div')
        div.className = className
        for (const key in styles) {
          div.style[key] = styles[key]
        }
        $el.appendChild(div)
      }
    },
    // 设置单元格是否换行
    rowHeightChange(className) {
      // this.hotTableClassName = className
      this.afterRowHeightChange(className)
    },
    // 移除所有边框
    removeAllborder(range, className, key) {
      for (let row = range.from.row; row <= range.to.row; row++) {
        for (let col = range.from.col; col <= range.to.col; col++) {
          // var className = this.hotTableComponentRef.hotInstance.getCell(row, col).className

          // if (className) {
          //   className = className.replace('cell-border-top', '').replace('cell-border-bottom', '').replace('cell-border-left', '').replace('cell-border-right', '')
          // }
          const cell = hotOptions.style[`${row}:${col}`]
          if (cell) {
            cell['cell-border-top'] = ''
            cell['cell-border-bottom'] = ''
            cell['cell-border-left'] = ''
            cell['cell-border-right'] = ''
            cell['cell-border-all'] = ''
          }
          this.afterSetCellMeta(row, col, key, className)

          // this.hotTableComponentRef.hotInstance.setCellMeta(row, col, key, className)
        }
      }
    },
    // 设置外边框
    setOuterBorder(range, className, key) {
      for (let row = range.from.row; row <= range.to.row; row++) {
        for (let col = range.from.col; col <= range.to.col; col++) {
          const border = []
          if (row === range.from.row) {
            border.push('cell-border-top')
          }
          if (row === range.to.row) {
            border.push('cell-border-bottom')
          }
          if (col === range.from.col) {
            border.push('cell-border-left')
          }
          if (col === range.to.col) {
            border.push('cell-border-right')
          }
          let className = this.hotTableComponentRef.hotInstance.getCellMeta(row, col).className || ''
          if (border.length) {
            if (className) {
              border.forEach(item => {
                if (!new RegExp(item).test(className)) {
                  className += ' ' + item
                }
              })
            } else {
              className = border.join(' ')
            }
          }
          this.afterSetCellMeta(row, col, key, className)
          // this.hotTableComponentRef.hotInstance.setCellMeta(row, col, key, className)
        }
      }
    },
    // 设置边框
    setBorder(className, key, type) {
      const cellRange = this.hotTableComponentRef.hotInstance.getSelectedRange()
      if (type === 'outer') {
        if (Array.isArray(cellRange) && cellRange.length) {
          this.setOuterBorder(cellRange[0], className, key)
        }
      } else if (type === 'none') {
        if (Array.isArray(cellRange) && cellRange.length) {
          this.removeAllborder(cellRange[0], className, key)
        }
      } else {
        this.setRangeCellStyle(className, key)
      }
      this.hotTableComponentRef.hotInstance.render()
      this.checkRedoAndUndo()
    },
    // 检查单元格样式
    checkCellFontStyle(td) {
      const className = td.className
      this.isBold = /font-style-bold/.test(className)
      this.isItalic = /font-style-italic/.test(className)
      this.isUnderline = /font-style-underline/.test(className)
      const verticalAlignMatch = className.match(/font-vertical-align-(.{0,7})/)
      if (verticalAlignMatch) {
        const verticalAlignValue = verticalAlignMatch[0]
        if (verticalAlignValue.indexOf('top') !== -1) {
          this.verticalAlign = 'top'
        } else if (verticalAlignValue.indexOf('bottom') !== -1) {
          this.verticalAlign = 'bottom'
        } else {
          this.verticalAlign = 'middle'
        }
      } else {
        this.verticalAlign = 'middle'
      }

      const textlAlignMatch = className.match(/font-text-align-(.{0,7})/)
      if (textlAlignMatch) {
        const textAlignValue = textlAlignMatch[0]
        if (textAlignValue.indexOf('center') !== -1) {
          this.textAlign = 'center'
        } else if (textAlignValue.indexOf('right') !== -1) {
          this.textAlign = 'right'
        } else {
          this.textAlign = 'left'
        }
      } else {
        this.textAlign = 'left'
      }
    },
    // 设置单个 单元格样式
    setCellStyle(row, col, key, className) {
      if (!hotOptions.style[`${row}:${col}`]) {
        hotOptions.style[`${row}:${col}`] = {}
      }
      this.afterSetCellMeta(row, col, key, className)
      // this.hotTableComponentRef.hotInstance.setCellMeta(row, col, key, className)
    },
    // 批量设置单元格样式
    setRangeCellStyle(className, key, needToBeCheckedFontStyle = false) {
      const selected = this.hotTableComponentRef.hotInstance.getSelected()
      if (!selected) { return }
      const range = selected[0]
      const row1 = range[0]
      const col1 = range[1]
      const row2 = range[2]
      const col2 = range[3]
      for (let r = row1; r <= row2; r++) {
        for (let c = col1; c <= col2; c++) {
          this.setCellStyle(r, c, key, className)
        }
      }
      // this.hotTableComponentRef.hotInstance.render()
      if (needToBeCheckedFontStyle) {
        this.checkCellFontStyle(this.hotTableComponentRef.hotInstance.getCell(row1, col1))
      }
      this.hotTableComponentRef.hotInstance.render()
      this.checkRedoAndUndo()
    },
    // 清除选中的内容
    clearCellData() {
      this.hotTableComponentRef.hotInstance.emptySelectedCells()
    },
    // 列宽/行高 输入框
    setSizePrompt(title, val) {
      return new Promise((resolve, reject) => {
        this.$prompt(title, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          closeOnClickModal: false,
          inputValue: val,
          inputPattern: /^[0-9]+(.[0-9]{1,3})?$/,
          inputErrorMessage: '请输入正确的数字格式'
        }).then(({ value }) => {
          resolve(value)
        }).catch(() => {
          reject()
        })
      })
    },
    // 设置尺寸(行高和列宽)
    async setSize(type) {
      const selected = this.hotTableComponentRef.hotInstance.getSelected()
      if (!selected) { return }
      const range = selected[0]
      const row1 = range[0]
      const col1 = range[1]
      const row2 = range[2]
      const col2 = range[3]
      if (type === 'rowHeight') {
        const h = this.hotTableComponentRef.hotInstance.getRowHeight(row1)
        const value = await this.setSizePrompt('行高', h)
        for (let r = row1; r <= row2; r++) {
          this.afterRowResize(r, value)
          // this.hotTableComponentRef.hotInstance.runHooks('afterRowResize', r, value)
        }
      } else {
        const w = this.hotTableComponentRef.hotInstance.getColWidth(col1)
        const value = await this.setSizePrompt('列宽', w)
        for (let c = col1; c <= col2; c++) {
          this.afterColumnResize(c, value)
          // this.hotTableComponentRef.hotInstance.runHooks('afterColumnResize', c, value)
        }
      }
      this.hotTableComponentRef.hotInstance.render()
      this.checkRedoAndUndo()
    },
    // 插入/移除 行/列
    insertOrRemove(action) {
      const cell = this.hotTableComponentRef.hotInstance.getSelected()
      let range = {
        row: 0,
        col: 0
      }
      if (cell) {
        let row = cell[0][0]
        let col = cell[0][1]
        if (action.indexOf('insert') !== -1) {
          row += 1
          col += 1
        }
        range = {
          row,
          col
        }
      }
      if (action === 'insert_row' || action === 'remove_row') {
        this.hotTableComponentRef.hotInstance.alter(action, range.row)
      } else {
        this.hotTableComponentRef.hotInstance.alter(action, range.col)
      }
      // console.log(this.hotTableComponentRef.hotInstance.alter)
    },
    // 判断选中的单元格能否合并
    checkCellMerge: function(row, column, row2, column2) {
      const mergeCells = this.hotTableComponentRef.hotInstance.getPlugin('MergeCells').mergedCellsCollection.mergedCells
      const isCellMerge = mergeCells.some(item => {
        return (item.col === column && (item.colspan + column - 1) === column2) && (item.row === row && (item.rowspan + row - 1) === row2)
      })
      this.isCellMerge = isCellMerge
      return isCellMerge
    },
    // 合并/取消合并单元格
    merge(flag) {
      const cellRange = this.hotTableComponentRef.hotInstance.getSelectedRange()
      if (Array.isArray(cellRange) && cellRange.length) {
        if (flag) {
          this.hotTableComponentRef.hotInstance.getPlugin('MergeCells').mergeSelection(cellRange[0])
        } else {
          this.hotTableComponentRef.hotInstance.getPlugin('MergeCells').unmergeSelection(cellRange[0])
        }
      }
    },
    // 检查 撤回/重做 的状态
    checkRedoAndUndo() {
      this.isRedoAvailable = this.hotTableComponentRef.hotInstance.isRedoAvailable()
      this.isUndoAvailable = this.hotTableComponentRef.hotInstance.isUndoAvailable()
    },
    afterHotChange(e) {
      this.hotTableComponentRef.hotInstance.undoRedo.done(e)
    },
    // 行高度变化后
    afterRowResize(row, value) {
      const e = new this.hotTableComponentRef.hotInstance.undoRedo.RowHeightAction({
        stateBefore: {
          row,
          size: hotOptions.rows[row] || hotOptions.rowHeight,
          newSize: value
        }
      })
      hotOptions.rows[row] = value
      this.afterHotChange(e)
      // this.hotTableComponentRef.hotInstance.render()
      // this.checkRedoAndUndo()
    },
    // 列宽度变化后
    afterColumnResize(col, value) {
      const e = new this.hotTableComponentRef.hotInstance.undoRedo.ColWidthAction({
        col,
        size: hotOptions.cols[col] || hotOptions.colWidth,
        newSize: value
      })
      hotOptions.cols[col] = value
      this.afterHotChange(e)
      // this.hotTableComponentRef.hotInstance.render()
      // this.checkRedoAndUndo()
    },
    // 单元格样式变化后
    afterSetCellMeta(row, column, key, newValue) {
      let value = ''
      const style = hotOptions.style[`${row}:${column}`]
      if (style) {
        if (style[key]) {
          value = style[key]
        }
      }
      const e = new this.hotTableComponentRef.hotInstance.undoRedo.CellStyleAction({
        params: {
          row,
          column,
          key,
          newValue,
          value
        }
      })
      if (!hotOptions.style[`${row}:${column}`]) {
        hotOptions.style[`${row}:${column}`] = {}
      }
      hotOptions.style[`${row}:${column}`][key] = newValue
      this.afterHotChange(e)
      // this.hotTableComponentRef.hotInstance.render()
      // this.checkRedoAndUndo()
    },
    // 单元格行高设置变化后
    afterRowHeightChange(className) {
      const e = new this.hotTableComponentRef.hotInstance.undoRedo.RowHeightChangeAction({
        params: {
          newValue: className,
          value: this.hotTableClassName
        }
      })
      this.hotTableClassName = className
      this.afterHotChange(e)
      // this.hotTableComponentRef.hotInstance.render()
      // this.checkRedoAndUndo()
    },

    // 初始化
    initHotTableComponent() {
      const self = this

      // 通用注册撤销/重做功能
      function registerRedoAndUndoAction({ action, undo, redo }) {
        self.hotTableComponentRef.hotInstance.undoRedo[action] = function(params) {
          for (const key in params) {
            this[key] = params[key]
          }
        }
        // 撤销
        self.hotTableComponentRef.hotInstance.undoRedo[action].prototype.undo = function(b, c) {
          undo && undo(this, b, c)
          b.addHookOnce('afterRender', c)
          b.render()
          self.checkRedoAndUndo()
        }
        // 重做
        self.hotTableComponentRef.hotInstance.undoRedo[action].prototype.redo = function(b, c) {
          redo && redo(this, b, c)
          b.addHookOnce('afterRender', c)
          b.render()
          self.checkRedoAndUndo()
        }
      }

      if (this.$refs.hotTableComponent && this.$refs.hotTableComponent.hotInstance) {
        console.log(this.$refs.hotTableComponent.hotInstance.getPlugin('undoRedo'))

        this.hotTableComponentRef = this.$refs.hotTableComponent

        this.hotTableComponentRef.hotInstance.addHook('afterChange', () => {
          self.checkRedoAndUndo()
        })

        // 设置单元格高度操作 支持撤销/重做
        registerRedoAndUndoAction({
          action: 'RowHeightAction',
          undo(context, b, c) {
            // b.getPlugin('ManualRowResize').setManualSize(context.stateBefore.row, context.stateBefore.size)
            hotOptions.rows[context.stateBefore.row] = context.stateBefore.size
          },
          redo(context, b, c) {
            // b.getPlugin('ManualRowResize').setManualSize(context.stateBefore.row, context.stateBefore.newSize)
            hotOptions.rows[context.stateBefore.row] = context.stateBefore.newSize
          }
        })

        // this.hotTableComponentRef.hotInstance.undoRedo.RowHeightAction = function(stateBefore) {
        //   this.stateBefore = stateBefore
        // }

        // this.hotTableComponentRef.hotInstance.undoRedo.RowHeightAction.prototype.undo = function(b, c) {
        //   b.getPlugin('ManualRowResize').setManualSize(this.stateBefore.row, this.stateBefore.size)
        //   hotOptions.rows[this.stateBefore.row] = this.stateBefore.size
        //   b.addHookOnce('afterRender', c)
        //   b.render()
        //   self.checkRedoAndUndo()
        // }

        // this.hotTableComponentRef.hotInstance.undoRedo.RowHeightAction.prototype.redo = function(b, c) {
        //   b.getPlugin('ManualRowResize').setManualSize(this.stateBefore.row, this.stateBefore.newSize)
        //   hotOptions.rows[this.stateBefore.row] = this.stateBefore.newSize
        //   b.addHookOnce('afterRender', c)
        //   b.render()
        //   self.checkRedoAndUndo()
        // }

        // 设置单元格宽度操作 支持撤销/重做
        registerRedoAndUndoAction({
          action: 'ColWidthAction',
          undo(context, b, c) {
            // b.getPlugin('ManualColumnResize').setManualSize(context.stateBefore.col, context.stateBefore.size)
            hotOptions.cols[context.stateBefore.col] = context.stateBefore.size
          },
          redo(context, b, c) {
          // b.getPlugin('ManualColumnResize').setManualSize(context.stateBefore.col, context.stateBefore.newSize)
            hotOptions.cols[context.stateBefore.col] = context.stateBefore.newSize
          }
        })

        // 单元格样式 撤销/重做
        registerRedoAndUndoAction({
          action: 'CellStyleAction',
          undo(context, a, b) {
            hotOptions.style[`${context.params.row}:${context.params.column}`][context.params.key] = context.params.value
          },
          redo(context, b, c) {
            hotOptions.style[`${context.params.row}:${context.params.column}`][context.params.key] = context.params.newValue
          }
        })

        // 单元格行高设置 撤销/重做
        registerRedoAndUndoAction({
          action: 'RowHeightChangeAction',
          undo(context, a, b) {
            self.rowHeightChange(context.params.value)
          },
          redo(context, b, c) {
            self.rowHeightChange(context.params.newValue)
          }
        })
        // 设置图片 撤销/重做
        registerRedoAndUndoAction({
          action: 'CellSetImageChangeAction',
          undo(context, a, b) {
            hotOptions.image[`${context.params.row}:${context.params.col}`] = context.params.value
          },
          redo(context, b, c) {
            hotOptions.image[`${context.params.row}:${context.params.col}`] = context.params.newValue
          }
        })

        // this.hotTableComponentRef.hotInstance.undoRedo.ColWidthAction = function(stateBefore) {
        //   this.stateBefore = stateBefore
        // }

        // this.hotTableComponentRef.hotInstance.undoRedo.ColWidthAction.prototype.undo = function(b, c) {
        //   b.getPlugin('ManualColumnResize').setManualSize(this.stateBefore.col, this.stateBefore.size)
        //   hotOptions.cols[this.stateBefore.col] = this.stateBefore.size
        //   b.addHookOnce('afterRender', c)
        //   b.render()
        //   self.checkRedoAndUndo()
        // }

        // this.hotTableComponentRef.hotInstance.undoRedo.ColWidthAction.prototype.redo = function(b, c) {
        //   b.getPlugin('ManualColumnResize').setManualSize(this.stateBefore.col, this.stateBefore.newSize)
        //   hotOptions.cols[this.stateBefore.col] = this.stateBefore.newSize
        //   b.addHookOnce('afterRender', c)
        //   b.render()
        //   self.checkRedoAndUndo()
        // }

        // 行高度变化后
        // this.hotTableComponentRef.hotInstance.addHook('afterRowResize', function(row, size) {
        //   const e = new this.undoRedo.RowHeightAction({
        //     stateBefore: {
        //       row,
        //       size: hotOptions.rows[row] || hotOptions.rowHeight,
        //       newSize: size
        //     }
        //   })
        //   hotOptions.rows[row] = size
        //   this.undoRedo.done(e)
        //   this.render()
        //   self.checkRedoAndUndo()
        // })
        // 列宽度变化后
        // this.hotTableComponentRef.hotInstance.addHook('afterColumnResize', function(col, size) {
        //   const e = new this.undoRedo.ColWidthAction({
        //     col,
        //     size: hotOptions.cols[col] || hotOptions.colWidth,
        //     newSize: size
        //   })
        //   hotOptions.cols[col] = size
        //   this.undoRedo.done(e)
        //   this.render()
        //   self.checkRedoAndUndo()
        // })
        // 单元格样式变化后
        // this.hotTableComponentRef.hotInstance.addHook('afterSetCellMeta', function(row, column, key, newValue) {
        //   let value = ''
        //   const style = hotOptions.style[`${row}:${column}`]
        //   if (style) {
        //     if (style[key]) {
        //       value = style[key]
        //     }
        //   }
        //   const e = new this.undoRedo.CellStyleAction({
        //     params: {
        //       row,
        //       column,
        //       key,
        //       newValue,
        //       value
        //     }
        //   })
        //   if (!hotOptions.style[`${row}:${column}`]) {
        //     hotOptions.style[`${row}:${column}`] = {}
        //   }
        //   hotOptions.style[`${row}:${column}`][key] = newValue
        //   this.undoRedo.done(e)
        //   this.render()
        // })
      } else {
        setTimeout(() => {
          this.initHotTableComponent()
        }, 800)
      }
    },
    // 撤销 / 重做
    undoRedo(type, cb) {
      if (type === 'undo') {
        if (this.hotTableComponentRef.hotInstance.isUndoAvailable()) {
          this.hotTableComponentRef.hotInstance.undo()
        }
      } else {
        if (this.hotTableComponentRef.hotInstance.isRedoAvailable()) {
          this.hotTableComponentRef.hotInstance.redo()
        }
      }
    },
    closeDialog() {
      this.dialogVisible = false
      this.$emit('close', false)
    },
    // 加载数据
    loadData() {
      // this.loading = true
    }
  }
}
</script>
<style lang="scss">
  .htContextMenu{
    z-index: 3000 !important;
  }
  .form-print-edit-dialog {
    .no-dialog-header {
      & >.el-dialog__header {
        display: none;
      }
    }

    .print-header {
      border-bottom: 1px solid #eee;
      padding-bottom: 5px
    }

    .el-tabs__item {
      padding: 0 24px;
    }

    .field-list {
      padding: 15px;
      overflow: auto;
      margin: 0;
      border: none;

      .field-list-item {
        background: #f9f9f9;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-size: 12px;
        display: block;
        height: 30px;
        line-height: 30px;
        text-align: left;
        border: 1px dashed #dbdbdb;
        margin-bottom: 5px;
        cursor: move;
        position: relative;

        i {
          color: #91ADCE;
          font-size: 14px;
          margin: 0 10px;
        }
      }
    }

  }
</style>
<style lang="scss" >
  .hot-table-wrap{
    display: flex;
    height: 88vh;
    &.hot-word-bread-normal{
      .content{
        word-break: break-all !important;
        white-space: normal !important;
      }
    }
    .hot-card{
      height: 100%;
    }
    .hot-table-content{
      position: relative;
      height: 100%;
      display: flex;
      flex-direction: column;
      td.fx_print_table{
        flex: 1;
        /*position: absolute;*/
        /*left: 0;*/
        /*right: 0;*/
        /*top: 0;*/
        /*bottom: 0;*/
        overflow: auto;
        line-height: 1.2;
        padding: 0;
        // border: 1px solid transparent;
        // border-right-color:  #CCC;
        // border-bottom-color:  #CCC;
        vertical-align: middle;
        position: relative;
        overflow: visible;
        &::before{
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          margin: -1px;
          border: none #000 1px;
          z-index: 10;
        }
        &.cell-border-top{
          &::before{
            border-top-style: solid;
          }
        }
        &.cell-border-bottom{
          &::before{
            border-bottom-style: solid;
          }
        }
        &.cell-border-left{
          &::before{
            border-left-style: solid;
          }
        }
        &.cell-border-right{
          &::before{
            border-right-style: solid;
          }
        }
        &.cell-border-none{
          &::before{
            border-style: none;
          }
        }
        &.cell-border-width-none{
          &::before{
            border-width: 0;
          }
        }
        &.cell-border-width-1{
          &::before{
            border-width: 1px;
          }
        }
        &.cell-border-width-2{
          &::before{
            border-width: 2px;
          }
        }
        &.cell-border-width-3{
          &::before{
            border-width: 3px;
          }
        }
        &.cell-border-width-4{
          &::before{
            border-width: 4px;
          }
        }
        .wtHider{
          max-height: 100%;
          .htCore{
            border-collapse: collapse;
          }
        }
        .content{
          overflow: hidden;
          outline-width: 0;
          white-space: pre-line;
          background-clip: padding-box;
          word-break: keep-all;
          height: 100%;
        }
        .cell-image{
          background-size: contain;
          background-repeat: no-repeat;
          height: 100%;
          display: block;
        }
        .data{
          display: inline-block;
          width: 100%;
          height: 100%;
          &::after{
            content: "";
            display: inline-block;
            height: 100%;
            vertical-align: middle;
          }
        }
      }
    }
  }
  .hot-table-wrap{
    flex: 1;
    overflow: auto;
    position: relative;
    .paper-vertical{
      width: 0;
      bottom: 0;
      position: absolute;
      border-left: dashed 1px #D91E18;
      z-index: 50;
    }
    .paper-horizontal{
      height: 0;
      right: 0;
      position: absolute;
      border-top: dashed 1px #D91E18;
      z-index: 50;
    }
  }
  .handsontableInput{
    line-height: 1.2;
  }
  .font-family-SimSun{
    font-family: 'SimSun';
  }
  .font-family-KaiTi{
    font-family: 'KaiTi';
  }
  .font-family-SimHei{
    font-family: 'SimHei';
  }

  .font-size-9{
    font-size: 9px;
  }
  .font-size-10{
    font-size: 10px;
  }
  .font-size-11{
    font-size: 11px;
  }
  .font-size-12{
    font-size: 12px;
  }
  .font-size-14{
    font-size: 14px;
  }
  .font-size-18{
    font-size: 18px;
  }
  .font-size-24{
    font-size: 24px;
  }
  .font-size-30{
    font-size: 30px;
  }
  .font-size-36{
    font-size: 36px;
  }

  .font-style-bold{
    font-weight: bold;
  }
  .font-style-italic{
    font-style: italic;
  }
  .font-style-underline{
    text-decoration: underline;
  }
  .font-vertical-align-top{
    .data{
      &::after{
        vertical-align: top !important;
      }
    }
    .cell-image{
      background-position-y: top;
    }
  }
  .font-vertical-align-middle{
    .data{
      &::after{
        vertical-align: middle !important;
      }
    }
    .cell-image{
      background-position-y: center;
    }
  }
  .font-vertical-align-bottom{
    .data{
      &::after{
        vertical-align: bottom !important;
      }
    }
    .cell-image{
      background-position-y: bottom;
    }
  }
  .font-text-align-left{
    text-align: left !important;
    .cell-image{
      background-position-x: left;
    }
  }
  .font-text-align-center{
    text-align: center !important;

    .cell-image{
      background-position-x: center;
    }
  }
  .font-text-align-right{
    text-align: right !important;
    .cell-image{
      background-position-x: right;
    }
  }

  .print-page-dialog{
    .el-dialog__body{
      padding: 0;
    }
  }

</style>

