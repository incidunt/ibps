<template>
  <ibps-layout ref="layout">
    <div slot="west">
      <ibps-tree
        ref="tree"
        :width="width"
        :height="height"
        :data="orgTreeData"
        :options="orgTreeoptions"
        :contextmenus="orgTreeContextmenus"
        title="岗位管理"
        @action-event="handleTreeAction"
        @node-click="handleNodeClick"
        @expand-collapse="handleExpandCollapse"
      />
      <ibps-container
        :margin-left="width+'px'"
        class="page"
      >
        <detail
          v-if="show==='detail'"
          :id="positionId"
          :readonly="readonly"
        />
        <edit
          v-else-if="show==='edit'"
          :id="positionId"
          :level-id="levelId"
          :parent-id="parentId"
          @callback="loadTreeData"
        />

        <edit-position
          v-else-if="show==='addPosition'"
          @callback="callback"
        />

        <el-alert
          v-else
          :closable="false"
          title="尚未指定一个岗位"
          type="warning"
          show-icon
          style="height:50px;"
        />
      </ibps-container>

      <move-node
        :id="positionId"
        :visible="moveNodeVisible"
        :data="orgTreeData"
        @callback="loadTreeData"
        @close="visible => moveNodeVisible = visible"
      />
      <!--节点排序-->
      <node-sort
        :data="sortData"
        :visible="nodeSortVisible"
        title="岗位排序"
        @close="visible => nodeSortVisible = visible"
        @callback="search"
      />
    </div>
  </ibps-layout>
</template>
<script>
import { remove } from '@/api/platform/org/position'
import { findTreeData as getTreeData } from '@/api/platform/org/entity'
import ActionUtils from '@/utils/action'
import FixHeight from '@/mixins/height'
import Detail from './detail'
import Edit from './edit'
import MoveNode from './move-node'
import NodeSort from './sort'

export default {
  components: {
    Detail,
    Edit,
    MoveNode,
    NodeSort
  },
  mixins: [FixHeight],
  data() {
    return {
      show: '',
      width: 230,
      height: document.clientHeight,
      positionId: '',
      levelId: '',
      editName: '',
      // 移动节点
      settingGradeAdminVisible: false,
      moveNodeVisible: false,
      // 节点排序
      sortData: [],
      nodeSortVisible: false,

      // 组织树配置
      orgTreeoptions: {},
      orgTreeContextmenus: [
        { icon: 'add', label: '添加', value: 'add' },
        { icon: 'edit', label: '编辑', value: 'edit', rights: ['node'] },
        { icon: 'remove', label: '删除', value: 'remove', rights: ['node'] },
        { type: 'divided', rights: ['node'] },
        { icon: 'arrows-v', label: '移动节点', value: 'moveNode', rights: ['node'] },
        { type: 'divided' },
        { icon: 'sort', label: '节点排序', value: 'nodeSort' }
      ],
      orgTreeData: []
    }
  },
  created() {
    this.loadTreeData()
  },
  methods: {
    // 返回右明细模块未显示
    back() {
      this.positionId = ''
      this.show = 'detail'
    },
    // 获取ID后显示右明细模块
    showDetail() {
      this.positionId = this.gainId
      this.show = 'detail'
    },

    handleTreeAction(command, position, selection, data) {
      if (position === 'toolbar') {
        if (command === 'refresh') {
          this.loadTreeData()
        }
      } else {
        const id = data.id
        switch (command) {
        // 组织负责人
          case 'add':// 添加
            this.handleEdit('', id)
            break
          case 'edit':// 编辑
            this.levelId = data.levelID
            this.handleEdit(id)
            break
          case 'remove':// 删除
            ActionUtils.removeRecord(id).then((ids) => {
              this.handleRemove(ids, data)
            }).catch(() => { })
            break
          case 'moveNode':// 移动节点
            this.handleMoveNode(id)
            break
          case 'nodeSort':// 排序
            this.handleNodeSort(data)
            break
          default:
            break
        }
      }
    },
    // 添加 编辑
    handleEdit(id = '', parentId) {
      this.show = 'edit'
      this.positionId = id
      this.parentId = parentId
    },
    // 处理删除
    handleRemove(ids, data) {
      if (data.children && data.children !== []) {
        this.$message({
          message: '请先删除子节点！',
          type: 'warning'
        })
        return
      }
      remove({ positionIds: ids }).then(response => {
        ActionUtils.removeSuccessMessage()
        this.loadTreeData()
      }).catch(() => {})
    },
    // 移动节点
    handleMoveNode(id = '') {
      this.moveNodeVisible = true
      this.positionId = id
    },
    // 树点击
    handleNodeClick(data) {
      if (data.id === 0 || data.id === '0') {
        this.show = 'empty'
        return
      }
      this.readonly = true
      this.positionId = data.id + ''
      this.show = 'detail'
    },
    handleExpandCollapse(isExpand) {
      this.width = isExpand ? 230 : 30
    },
    loadTreeData() {
      getTreeData({
        parameters: [],
        requestPage: {},
        sorts: []
      }).then(response => {
        const data = response.data
        this.orgTreeData = data
      }).catch(() => {
      })
    },
    // 查询
    search() {
      this.loadTreeData()
    },
    handleNodeSort(data) {
      if (data.children && data.children.length > 0) {
        if (data.children.length === 1) {
          this.$message.closeAll()
          this.$message.warning('只有一个节点无需排序')
        } else {
          this.nodeSortVisible = true
          this.sortData = data.children
        }
      } else {
        this.$message.closeAll()
        this.$message.warning('无子节点排序')
      }
    }
  }
}
</script>

