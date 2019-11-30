<template>
  <ibps-layout ref="layout">
    <div slot="west">
      <ibps-tree
        ref="tree"
        :width="width"
        :height="height"
        :loading="loading"
        :data="orgTreeData"
        :contextmenus="orgTreeContextmenus"
        title="分级组织管理"
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
          :id="orgId"
          :is-auth="true"
          :org-name="orgName"
          :rights-arr="rightsArr"
          :is-tree-all="false"
        />
        <edit
          v-else-if="show==='edit'"
          :id="orgId"
          :parent-id="parentId"
          @callback="search"
          @success="successCallback"
        />

        <edit-position
          v-else-if="show==='addPosition'"
          :org-id="orgId"
          @callback="successCallback"
        />
        <el-alert
          v-else
          :closable="false"
          title="尚未指定一个组织"
          type="warning"
          show-icon
          style="height:50px;"
        />
      </ibps-container>
      <!--设置管理员-->
      <auth-edit
        :visible="authEditVisible"
        :org-id="orgId"
        :org-name="orgName"
        @close="visible => authEditVisible = false"
      />
      <!--移动节点-->
      <move-node
        :id="orgId"
        :visible="moveNodeVisible"
        :data="orgTreeData"
        @callback="search"
        @close="visible => moveNodeVisible = visible"
      />
    </div>
  </ibps-layout>
</template>
<script>
import { findTreeData, remove } from '@/api/platform/org/org'
import { findByCurrentUserId } from '@/api/platform/org/auth'
import ActionUtils from '@/utils/action'
import FixHeight from '@/mixins/height'

import Detail from './detail'
import Edit from './edit'
import AuthEdit from '../auth/edit'
import EditPosition from '../position/edit'
import MoveNode from './move-node'

export default {
  components: {
    Detail,
    Edit,
    AuthEdit,
    EditPosition,
    MoveNode
  },
  mixins: [FixHeight],
  data() {
    return {
      show: '',
      rightsArr: [],
      width: 230,
      height: document.clientHeight,
      orgId: '',
      positionId: '',
      orgName: '',
      // 设置分级管理员
      authEditVisible: false,
      // 移动节点
      moveNodeVisible: false,
      loading: false,
      orgTreeContextmenus: [
        { icon: 'add', label: '添加', value: 'add', rights: this.checkRights },
        { icon: 'edit', label: '编辑', value: 'edit', rights: this.checkRights },
        { icon: 'remove', label: '删除', value: 'remove', rights: this.checkRights },
        { type: 'divided', rights: this.rights },
        { icon: 'arrows-v', label: '移动节点', value: 'moveNode', rights: this.rights },
        { type: 'divided', rights: this.rights },
        { icon: 'cog', label: '设置分级管理员', value: 'authEdit', rights: this.rights },
        { icon: 'add', label: '新增岗位', value: 'addPosition', rights: this.rights }
      ],
      readonly: false,
      orgTreeData: [],
      partyOrgAuths: []
    }
  },
  created() {
    this.loadOrgAuthData()
    this.loadTreeData()
  },
  methods: {
    loadTreeData() {
      this.loading = true
      findTreeData({
        'type': '4'
      }).then(response => {
        this.loading = false
        const data = response.data
        this.orgTreeData = data
      }).catch(() => {
        this.loading = false
      })
    },
    loadOrgAuthData() {
      this.loading = true
      findByCurrentUserId().then(response => {
        this.loading = false
        const data = response.data
        this.partyOrgAuths = data
      }).catch(() => {
        this.loading = false
      })
    },
    // 查询
    search() {
      this.loadTreeData()
    },
    // 返回右明细模块未显示
    successCallback(rtn) {
      if (rtn) {
        this.orgId = ''
        this.show = 'no'
      }
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
            this.handleEdit(id)
            break
          case 'remove':// 删除
            ActionUtils.removeRecord(id).then((ids) => {
              this.handleRemove(ids)
            }).catch(() => { })
            break
          case 'moveNode':// 移动节点
            this.handleMoveNode(id)
            break
          case 'authEdit':// 设置分级管理员
            this.handleAuthEdit(id, data.name)
            break
          case 'addPosition':// 新增岗位
            this.handleAddPosition(id)
            break
          default:
            break
        }
      }
    },
    // 添加 编辑
    handleEdit(id = '', parentId) {
      this.show = 'edit'
      this.orgId = id
      this.parentId = parentId
    },
    // 处理删除
    handleRemove(ids) {
      remove({ orgIds: ids }).then(response => {
        ActionUtils.removeSuccessMessage()
        this.loadTreeData()
      }).catch(() => {})
    },
    // 设置分级管理员
    handleAuthEdit(id, orgName) {
      this.orgId = id
      this.orgName = orgName
      this.authEditVisible = true
    },
    // 移动节点
    handleMoveNode(id = '') {
      this.moveNodeVisible = true
      this.orgId = id
    },
    // 新增岗位
    handleAddPosition(id = '') {
      this.orgId = id
      this.show = 'addPosition'
    },
    // 树点击,鼠标左键点击
    handleNodeClick(data) {
      if (data.id === '0' || data.id === 0) {
        this.show = 'empty'
        return
      }
      this.rightsArr = ['detail']
      this.orgId = data.id

      this.orgName = data.name
      this.show = 'detail'
      const prem = this.getPrem(data)
      const arr = prem.split(',')
      arr.forEach(i => {
        if (i !== '') {
          this.rightsArr.push(i)
        }
      })
    },
    handleExpandCollapse(isExpand) {
      this.width = isExpand ? 230 : 30
    },
    getPrem(treeNode) {
      const findParent = function(tree, node) {
        for (const element of tree) {
          if (element.id === node.parentId) {
            return element
          }
        }
      }
      let prem = null
      let parent = findParent(this.orgTreeData, treeNode)

      const auths = this.partyOrgAuths
      if (!parent || (parent && (parent.id === 0 || parent.id === '0'))) {
        for (let i = 0; i < auths.length; i++) {
          const auth = auths[i]
          if (treeNode.id === auth.orgID) {
            prem = auth.orgPerms
            break
          }
        }
      } else {
        let pid = null
        for (; findParent(this.orgTreeData, parent).parentId && ((findParent(this.orgTreeData, parent)).parentId !== 0 || (findParent(this.orgTreeData, parent)).parentId !== '0');) {
          parent = findParent(this.orgTreeData, parent)
        }
        pid = parent.id
        for (let j = 0; j < auths.length; j++) {
          const auth = auths[j]

          if (pid === auth.orgID) {
            prem = auth.userPerms
            break
          }
        }
      }
      return prem
    },
    checkRights(menu, data, isRoot) {
      const prem = this.getPrem(data)
      if (this.$utils.isNotEmpty(prem) && prem.indexOf(menu.value) > -1) {
        return true
      } else {
        return false
      }
    },
    rights(menu, data, isRoot) {
      const prem = this.getPrem(data)
      const arr = prem.split(',')
      const index = arr.findIndex(item => item === '')
      arr.splice(index, 1)
      const addIndex = arr.findIndex(item => item === 'add')
      if (addIndex > -1) {
        return true
      } else {
        return false
      }
    }
  }
}
</script>

