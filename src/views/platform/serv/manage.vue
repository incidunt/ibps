<template>
  <ibps-layout ref="layout">
    <!--  -->
    <div slot="west">
      <ibps-tree
        :width="width"
        :height="height"
        :data="treeData"
        :options="treeOptions"
        :contextmenus="treeContextmenus"
        title="服务管理"
        @action-event="handleTreeAction"
        @node-click="handleNodeClick"
        @expand-collapse="handleExpandCollapse"
      />
    </div>

    <ibps-container
      :margin-left="width+'px'"
      class="page"
    >
      <edit
        :id="editId"
        ref="editForm"
        :service-type="serviceType"
        :visible="formVisible"
        :readonly="readonly"
        :parent-data="nodeData"
        display-type="edit"
        @callback="loadTreeData"
        @close="visible => formVisible = visible"
      />

      <post-event
        :id="editId"
        :visible="listVisible"
        :readonly="readonly"
        :parent-data="nodeData"
        display-type="edit"
        @callback="loadTreeData"
        @close="visible => listVisible = visible"
      />

      <el-alert
        v-show="!formVisible && !listVisible"
        :closable="false"
        title="请选择左边菜单右键进行操作！"
        type="warning"
        show-icon
        style="height:50px;"
      />
    </ibps-container>

  </ibps-layout>
</template>
<script>
import { findTreeData, remove } from '@/api/platform/serv/service'
import ActionUtils from '@/utils/action'
import FixHeight from '@/mixins/height'
import Edit from './edit'
import PostEvent from './event/list'

export default {
  components: {
    Edit,
    PostEvent
  },
  mixins: [FixHeight],
  data() {
    return {
      width: 200,
      height: document.clientHeight,
      formVisible: false,
      listVisible: false,
      editId: '0', // 编辑dialog需要使用
      serviceType: '',
      readonly: false, // 是否只读
      loading: false,
      // 树配置
      treeOptions: { 'rootPId': '-1' },
      treeContextmenus: [
        { icon: 'add', label: '添加', value: 'add', rights: function(menu, data, isRoot) {
          if (data.id === '1' || data.id === '2') return true
          if (data.isDir === 'Y') return true
          return false
        } },
        { icon: 'edit', label: '编辑', value: 'edit', rights: function(menu, data, isRoot) {
          if (isRoot) return false
          if (data.id === '1' || data.id === '2') return false
          return true
        } },
        { icon: 'delete', label: '删除', value: 'remove', rights: function(menu, data, isRoot) {
          if (isRoot) return false
          if (data.id === '1' || data.id === '2') return false
          return true
        } },
        { type: 'divided', rights: function(menu, data, isRoot) {
          if (isRoot) return false
          if (data.id === '1' || data.id === '2') return false
          return true
        } },
        { icon: 'setting', label: '设置后置事件', value: 'setting', rights: function(menu, data, isRoot) {
          if (isRoot) return false
          if (data.id === '1' || data.id === '2') return false
          return true
        } }
      ],
      treeData: [],
      nodeData: {}
    }
  },
  created() {
    this.loadTreeData()
  },
  methods: {
    // 加载具体分类数据
    loadTreeData(isEdit) {
      findTreeData({ localNeeded: true }).then(response => {
        const data = response.data
        this.treeData = data
        this.editId = null
        this.formVisible = false
        this.listVisible = false
      })
    },
    handleTreeAction(command, position, selection, data) {
      if (position === 'toolbar') {
        if (command === 'refresh') {
          this.loadTreeData()
        }
      } else {
        if (data.id === 0) return
        if (command === 'add') { // 添加
          this.serviceType = data.type
          this.nodeData = data
          this.handTreeEdit()
        } else if (command === 'edit') {
          this.handleNodeClick(data, false)
        } else if (command === 'remove') {
          this.handleTreeRemove(data.id)
        } else if (command === 'setting') {
          this.handSettingPostEvent(data)
        }
      }
    },
    handleNodeClick(data, readonly = true) {
      this.readonly = readonly
      if (data.parentId === '0' || data.parentId === '-1') return
      this.nodeData = data
      this.editId = data.id
      this.formVisible = true
      this.listVisible = false
    },
    handleExpandCollapse(isExpand, readonly = false) {
      this.width = isExpand ? 200 : 50
    },
    handTreeEdit(editId, readonly = false) {
      this.editId = editId || ''
      this.readonly = readonly
      this.formVisible = true
      this.listVisible = false
    },
    handSettingPostEvent(data) {
      this.nodeData = data
      this.editId = data.id || ''
      this.formVisible = false
      this.listVisible = true
    },
    handleTreeRemove(ids) {
      // 获取数据
      remove({ serviceIds: ids }).then(response => {
        ActionUtils.removeSuccessMessage()
        this.loadTreeData()
      }).catch(() => {

      })
    },
    callback(data) {
      this.loadTreeData()
    }
  }
}
</script>
