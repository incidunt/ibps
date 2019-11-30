<template>
  <el-dialog
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :title="title"
    :width="width"
    class="edit-dialog"
    top="5vh"
    append-to-body
    @close="closeDialog"
  >
    <div slot="footer" class="el-dialog--center">
      <ibps-toolbar
        :actions="toolbars"
        @action-event="handleActionEvent"
      />
    </div>
  </el-dialog>
</template>
<script>
import _defaultsDeep from 'lodash.defaultsdeep'
export default {
  props: {
    title: {
      type: String
    },
    width: {
      type: String,
      default: '60%'
    },
    prop: {
      type: String
    },
    template: { // 模版
      type: Object,
      default: () => {}
    },
    fields: {// 字段
      type: Array,
      default: () => []
    },
    defaultValue: {// 默认值
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      dialogVisible: false,
      editData: {},
      editIndex: -1,
      dialogRightsVisible: false,
      toolbars: [
        { key: 'save' },
        { key: 'cancel' }
      ]
    }
  },
  computed: {
    columns: {
      get() {
        return this.template[this.prop] || []
      },
      set(value) {
        this.handleInput(value)
      }
    }
  },
  methods: {
    handleActionEvent({ key }) {
      switch (key) {
        case 'save':
          this.handleConfirm()
          break
        case 'cancel':
          this.closeDialog()
          break
        default:
          break
      }
    },
    // 添加字段
    addColumn(field) {
      const columns = this.columns

      columns.push({
        label: field.name,
        name: field.key
      })
      this.handleInput(columns)
    },
    //  添加过滤条件
    addFilterConditions() {
      this.dialogVisible = true
      this.editIndex = -1
      this.editData = _defaultsDeep({}, this.defaultValue)
    },
    // 设置字段
    settingColumn(i) {
      this.editData = _defaultsDeep(JSON.parse(JSON.stringify(this.columns[i])), this.defaultValue)
      this.editIndex = i
      this.dialogVisible = true
    },
    // 删除字段
    removeColumn(i) {
      this.columns.splice(i, 1)
      this.handleInput(this.columns)
    },
    // 设置排序
    settingSort(i, desc) {
      const column = this.columns[i]
      column.direction = desc ? 'asc' : 'desc'
      this.columns.splice(i, 1, column)
      this.handleInput(this.columns)
    },
    settingRights(type) {
      if (type === 'none' || type === 'all') {
        const data = [{ type: type }]
        this.setRightsData(data)
      } else {
        this.dialogRightsVisible = true
      }
    },
    handleRightsConfirm(data) {
      if (data.length === 0) {
        data = [{ type: 'none' }]
      }
      this.setRightsData(data)
    },
    setRightsData(data) {
      const columns = this.columns.map((column) => {
        column.rights = data
        return column
      })
      this.handleInput(columns)
      this.$message.closeAll()
      this.$message.success('设置权限成功')
    },
    // 是否禁用
    isDisabled(key) {
      return !!this.columns.find((column) => {
        return column.name === key
      })
    },
    // 关闭当前窗口
    closeDialog() {
      this.dialogVisible = false
    },
    handleConfirm() {
      this.columns.splice(this.editIndex, 1, this.editData)
      this.handleInput(this.columns)
      this.closeDialog()
    },
    handleInput(value) {
      this.$emit('input', this.prop, value)
    }
  }
}
</script>

