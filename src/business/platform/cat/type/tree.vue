<template>
  <div>
    <ibps-tree
      :title="title"
      :width="width"
      :height="height"
      :data="treeData"
      :options="treeOptions"
      :contextmenus="hasContextmenu?treeContextmenus:[]"
      :position="position"
      @action-event="handleTreeAction"
      @node-click="handleNodeClick"
      @expand-collapse="handleExpandCollapse"
    />
    <!-- 分类编辑 -->
    <type-edit
      :id="editId"
      :parent-data="typeData"
      :is-private="isPrivate"
      :category-key="categoryKey"
      :visible="typeFormVisible"
      title="编辑分类"
      @callback="loadTreeData"
      @close="visible => typeFormVisible = visible"
    />
    <!-- 分类排序 -->
    <type-sort
      :id="editId"
      :visible="sortFormVisible"
      title="分类排序"
      @callback="loadTreeData"
      @close="visible => sortFormVisible = visible"
    />
  </div>
</template>

<script>
import { findTreeData, remove } from '@/api/platform/cat/type'
import ActionUtils from '@/utils/action'

import TypeEdit from '@/views/platform/cat/type/edit'
import TypeSort from '@/views/platform/cat/type/sort'

export default {
  components: {
    TypeEdit,
    TypeSort
  },
  props: {
    title: {
      type: String
    },
    categoryKey: {
      type: String,
      required: true
    },
    hasContextmenu: {// 是否有右键菜单
      type: Boolean,
      default: false
    },
    width: {
      type: [String, Number],
      default: 200
    },
    height: {
      type: [String, Number],
      default: 500
    },
    position: {
      type: String,
      default: 'west'
    }
  },
  data() {
    return {
      typeFormVisible: false,
      sortFormVisible: false,
      editId: '', // 编辑dialog需要使用

      // 树配置
      treeOptions: { 'rootPId': '-1' },
      treeContextmenus: [
        { icon: 'add', label: '增加分类', value: 'add' },
        { icon: 'edit', label: '编辑分类', value: 'edit', rights: ['node'] },
        { icon: 'delete', label: '删除分类', value: 'remove', rights: ['node'] },
        { type: 'divided' },
        { icon: 'sort', label: '分类排序', value: 'sort' }
      ],
      treeData: [],

      isPrivate: false,
      typeData: {} // 记录分类信息
    }
  },
  created() {
    this.loadTreeData()
  },
  methods: {
    loadTreeData() {
      findTreeData({ 'categoryKey': this.categoryKey }).then(response => {
        this.treeData = response.data || []
      })
    },
    handleTreeAction(command, position, selection, data) {
      switch (command) {
        case 'refresh':// 查询
          this.loadTreeData()
          break
        case 'add':// 添加
          this.typeData = data // { 'name': data.name, 'id': data.id }
          this.isPrivate = false
          this.handTreeEdit()
          break
        case 'addPrivate':// 添加
          this.typeData = data // { 'name': data.name, 'id': data.id }
          this.isPrivate = true
          this.handTreeEdit()
          break
        case 'edit':// 编辑
          this.typeData = data
          this.isPrivate = true
          this.handTreeEdit(data.id)
          break
        case 'remove':// 删除
          this.handleTreeRemove(data.id)
          break
        case 'export':// 导出
          this.handTreeExport(data.id, data.name)
          break
        case 'sort':// 排序
          this.handTreeSort(data.id)
          break
      }
    },
    handleNodeClick(data) {
      this.$emit('node-click', data.parentId === '-1' ? '' : data.id)
    },
    handleExpandCollapse(isExpand) {
      this.$emit('expand-collapse', isExpand)
    },
    handTreeEdit(editId) {
      this.editId = editId || ''
      // this.title = '分类编辑'
      this.typeFormVisible = true
    },
    handTreeSort(editId) {
      this.editId = editId || ''
      this.sortFormVisible = true
    },
    handleTreeRemove(ids) {
      this.$confirm(this.$t('common.dialog.removeRecord')).then(() => {
        remove({ typeId: ids }).then(response => {
          ActionUtils.removeSuccessMessage()
          this.loadTreeData()
        }).catch((err) => {
          console.err(err)
        })
      }).catch(() => {})
    }
  }
}
</script>
