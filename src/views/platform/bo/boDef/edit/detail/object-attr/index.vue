<template>
  <div class="main-container bo-attr">
    <ibps-crud
      ref="crud"
      :data="listData"
      :height="height-110"
      :toolbars="!isToolbars&&formData.boType!=='out'?listConfig.toolbars:false"
      :search-form="listConfig.searchForm"
      :pk-key="pkKey"
      :columns="listConfig.columns"
      :show-pagination="false"
      :selection-row="!readonly"
      selection-type="radio"
      @row-click="handleRowClick"
      @action-event="handleAction"
    />
    <edit
      :id="editId"
      :datas="editData"
      :title="title"
      :clear="clear"
      :is-create-table="formData.isCreateTable"
      :visible="dialogFormVisible"
      :readonly="readonly"
      @callback="callback"
      @close="visible => dialogFormVisible = visible"
    />
  </div>
</template>

<script>
import { typeOptions, defaultAttrs, subBoDefsAttrs } from '../../../constants'
import { checkSameNode } from '@/views/platform/bo/boDef/utils'
const uuid = require('uuid')
import ActionUtils from '@/utils/action'
import Edit from './edit'

export default {
  components: {
    Edit
  },
  props: {
    id: String,
    attrs: {
      type: Array,
      default: () => []
    },
    formData: Object,
    treeData: Array,
    review: Object,
    isMain: {
      type: String,
      default: 'Y'
    },
    toolbars: {
      type: Boolean,
      default: false
    },
    readonly: {
      type: Boolean,
      default: false
    },
    height: [String, Number]
  },
  data() {
    return {
      dialogFormVisible: false, // 弹窗
      editId: '', // 编辑dialog需要使用
      pkKey: 'id', // 主键  如果主键不是pk需要传主键
      editData: {},
      defaultData: [],
      title: '',
      loading: true,
      clear: false,
      isSame: false,
      selection: [],
      listData: this.attrs,
      listConfig: {
        toolbars: [
          {
            key: 'add'
          },
          {
            key: 'edit'
          },
          {
            key: 'moveUp',
            label: '上移',
            icon: 'ibps-icon-arrow-circle-up'
          },
          {
            key: 'moveDown',
            label: '下移',
            icon: 'ibps-icon-arrow-circle-down'
          },
          {
            key: 'remove'
          },
          {
            key: 'reset',
            label: '重置',
            icon: 'ibps-icon-undo'
          }
        ],
        searchForm: {},
        // 表格字段配置
        columns: [
          { prop: 'name', label: '名称' },
          { prop: 'code', label: '编码' },
          { prop: 'fieldName', label: '字段' },
          { prop: 'dataType', label: '属性类型', tags: typeOptions }
        ]
      }
    }
  },
  computed: {
    isToolbars() {
      return this.toolbars
    },
    reviewData() {
      return this.review
    }
  },
  watch: {
    attrs: {
      handler: function(val, oldVal) {
        if (this.$utils.isNotEmpty(this.attrs)) {
          this.listData = this.attrs
        }
      },
      deep: true
    },
    listData: {
      handler: function(val, oldVal) {
        this.checkNode(this.reviewData, this.treeData)
        this.$emit('change', this.listData)
      },
      deep: true
    }
  },
  methods: {
    /**
     * 处理按钮事件
     */
    handleAction(command, position, selection, data) {
      switch (command) {
        case 'add':// 添加
          this.handleEdit()
          this.title = '添加对象属性'
          break
        case 'edit':// 编辑
          ActionUtils.selectedRecord(selection).then((id) => {
            this.handleEdit(id)
            console.log(id)
            this.title = '编辑对象属性'
          }).catch(() => { })
          break
        case 'moveUp':// 上移
          ActionUtils.selectedRecord(selection).then((id) => {
            this.moveUp(id)
          }).catch(() => { })
          break
        case 'moveDown':// 下移
          ActionUtils.selectedRecord(selection).then((id) => {
            this.moveDown(id)
          }).catch(() => { })
          break
        case 'remove':// 删除
          ActionUtils.removeRecord(selection, '此操作将删除该数据, 是否确定?').then((id) => {
            this.handleRemove(id)
          }).catch(() => {})
          break
        case 'reset':// 重置
          this.$confirm('是否重置到初始属性？', '信息', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$refs['crud'].clearSelection()
            if (this.isMain !== 'Y') {
              this.defaultData = JSON.parse(JSON.stringify(defaultAttrs))
              this.defaultData.splice(1, 0, subBoDefsAttrs)
            } else {
              this.defaultData = JSON.parse(JSON.stringify(defaultAttrs))
            }
            this.listData = JSON.parse(JSON.stringify(this.defaultData))
            this.$message.closeAll()
            this.$message({
              type: 'success',
              message: '重置成功!'
            })
          }).catch(() => {})
          break
        default:
          break
      }
    },
    /**
     * 编辑回传
     */
    handleRowClick(row) {
      this.editData = row
    },
    /**
     * 处理添加||编辑
     */
    handleEdit(id = '', readonly = false) {
      this.editId = id
      this.readonly = readonly
      this.dialogFormVisible = true
      this.$refs['crud'].clearSelection()
    },
    // 添加||编辑 数据返回
    callback(value, buttonKey) {
      const codeIndex = this.listData.findIndex(i => i.code === value.code)
      const fieldNameIndex = this.listData.findIndex(i => i.fieldName === value.fieldName)
      const curIndex = this.listData.findIndex(i => i.id === value.id)
      this.clear = !!((codeIndex > -1 || fieldNameIndex > -1) && this.editId === '')
      if (curIndex > -1) {
        this.listData.splice(curIndex, 1, value)
      } else {
        if (codeIndex > -1 && this.editId === '') {
          this.$message.closeAll()
          this.$message({
            message: '编码【' + value.code + '】已存在',
            type: 'warning'
          })
          return
        }
        if (fieldNameIndex > -1 && this.editId === '') {
          this.$message.closeAll()
          this.$message({
            message: '字段【' + value.fieldName + '】已存在',
            type: 'warning'
          })
          return
        }
        value.id = uuid()
        this.listData.push(value)
      }
      this.$emit('change', this.listData)
    },
    // 上移
    moveUp(id) {
      const index = this.listData.findIndex((data) => data.id === id)
      if (index === 0) return
      const upDate = this.listData[index - 1]
      this.listData.splice(index - 1, 1)
      this.listData.splice(index, 0, upDate)
    },
    // 下移
    moveDown(id) {
      const index = this.listData.findIndex((data) => data.id === id)
      if ((index + 1) === this.listData.length) return
      const upDate = this.listData[index + 1]
      this.listData.splice(index + 1, 1)
      this.listData.splice(index, 0, upDate)
    },
    /**
     * 处理删除
     */
    handleRemove(id) {
      const index = this.listData.findIndex((data) => data.id === id)
      this.listData.splice(index, 1)
      this.$refs['crud'].clearSelection()
    },
    callbackListData() {
      return this.listData
    },
    getListData(value) {
      this.listData = value
    },
    checkNode(review, treeData) {
      this.isSame = checkSameNode(review, treeData)
      this.$emit('checkNode', this.isSame)
    }
  }
}
</script>
<style lang="scss">
.bo-attr{
  .toolbar-box{
    display: none;
  }
}

</style>

