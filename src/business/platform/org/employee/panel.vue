<template>
  <ibps-layout ref="layout">
    <div v-if="isTreeAll" slot="west" :style="{width:width+'px'}" class="ibps-employee-selector-tree">
      <div ref="searchForm" class="ibps-tree-search-form">
        <el-select
          v-model="partyType"
          :disabled="groundId===''?false:$store.getters.isSuper?false:true"
          placeholder="请选择"
          @change="changePartyType"
        >
          <el-option
            v-for="option in partyTypeOptions"
            :key="option.value"
            :value="option.value"
            :label="option.label"
          />
        </el-select>
        <el-checkbox v-model="inclueChild" :disabled="partyType==='role'||partyType==='group'" style="margin:5px 0 0 5px;">包含子项</el-checkbox>
        <!-- 重置 -->
      </div>
      <div v-if="toolbars" ref="toolbar" class="ibps-tree-toolbar">
        <ibps-toolbar
          :actions="toolbars"
          type="icon"
          @action-event="handleTreeAction"
        />
      </div>
      <div
        :style="{ height:(tableHeight-105)+'px'}"
      >
        <el-scrollbar
          style="height: 100%;width:100%;"
          wrap-class="ibps-tree-wrapper"
        >
          <el-tree
            ref="elTree"
            v-loading="loadingTree"
            :data="treeData"
            :expand-on-click-node="false"
            :props="{ children: 'children', label: 'name'}"
            node-key="id"
            pid-key="parentId"
            default-expand-all
            highlight-current
            @node-click="handleNodeClick"
          />
        </el-scrollbar>
      </div>
    </div>
    <ibps-crud
      ref="crud"
      :height="tableHeight"
      :data="listData"
      :toolbars="listConfig.toolbars"
      :search-form="listConfig.searchForm"
      :pk-key="pkKey"
      :columns="listConfig.columns"
      :pagination="pagination"
      :loading="loading"
      :selection-type="multiple?'checkbox':'radio'"
      @selection-change="handleSelectionChange"
      @action-event="handleAction"
      @sort-change="handleSortChange"
      @pagination-change="handlePaginationChange"
    />
    <more-search
      :title="title"
      :visible="dialogFormVisible"
      :is-tree-all="isTreeAll"
      class-name="org-panel-more-search-dialog"
      @callback="search"
      @close="visible => dialogFormVisible = visible"
      @action-event="handleMoreSearchAction"
    />
  </ibps-layout>
</template>
<script>
import { findTreeData as getOrgTreeData } from '@/api/platform/org/org'
import { findTreeData as getPositionTreeData } from '@/api/platform/org/entity'
import { getTreeData as getRoleTreeData } from '@/api/platform/org/role'
import { getTreeData as getGroupTreeData } from '@/api/platform/org/group'
import { findAllSubsystem } from '@/api/platform/auth/subsystem'
import { partyTypeOptions, statusOptions, genderOptions } from './constants'

import { query } from '@/api/platform/org/user'
import { queryPageList, queryWithOrg4Position } from '@/api/platform/org/employee'
import ActionUtils from '@/utils/action'
import TreeUtils from '@/utils/tree'
import MoreSearch from './more-search'

export default {
  components: {
    MoreSearch
  },
  props: {
    value: [Object, Array],
    multiple: Boolean,
    moduleType: String,
    height: {
      type: String,
      default: '400px'
    },
    typeId: {
      type: [String, Number],
      default: ''
    },
    groundId: {
      type: [String, Number],
      default: ''
    },
    isTreeAll: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      width: 200,
      dialogFormVisible: false, // 弹窗
      editId: '',
      title: '更多查询条件',
      partyTypeOptions: partyTypeOptions,
      statusOptions: statusOptions,
      genderOptions: genderOptions,
      partyType: 'org',
      inclueChild: true,
      partyId: '',

      // 树配置
      loadingTree: false,
      treeData: [],
      toolbars: [{
        key: 'refresh'
      }, {
        key: 'expand'
      }, {
        key: 'compress'
      }],
      // 列表配置
      pkKey: 'id', // 主键  如果主键不是pk需要传主键
      loading: false,
      listData: [],
      treeIds: [],
      listConfig: {
        // 工具栏
        toolbars: [
          { key: 'search' },
          { key: 'moreSearch' }
        ],
        // 查询条件
        searchForm: {
          labelWidth: 50,
          forms: [
            { prop: 'Q^FULL_NAME_^SL', label: '姓名', itemWidth: '200' },
            { prop: 'Q^ACCOUNT_^SL', label: '帐号', itemWidth: '200' }
          ]
        },
        // 表格字段配置
        columns: [
          { prop: 'name', label: '姓名', width: 150 },
          { prop: 'account', label: '帐号', width: 150 }
        ]
      },
      pagination: {},
      sorts: {},
      moreSearchParams: {}
    }
  },
  computed: {
    tableHeight() {
      const h = this.height.substr(0, this.height.length - 2)
      return parseInt(h)
    }
  },
  watch: {
    value(val, oldVal) {
      if (this.$utils.isEmpty(val)) {
        this.$refs['crud'].clearSelection()
      } else {
        if (!this.multiple) {
          const selectedValue = this.listData.find((data) => { return data[this.pkKey] === val[this.pkKey] })
          this.$refs['crud'].toggleRowSelection(selectedValue)
        } else {
          if (val.length < oldVal.length) {
            oldVal.forEach(row => {
              const index = val.find(item => { return item[this.pkKey] === row[this.pkKey] })
              if (!index) {
                this.$refs['crud'].toggleRowSelection(row, false)
              }
            })
          } else {
            val.forEach(row => {
              const index = this.listData.find(item => { return item[this.pkKey] === row[this.pkKey] })
              if (index) {
                this.$refs['crud'].toggleRowSelection(row, true)
              }
            })
          }
        }
      }
    },
    isTreeAll: {
      handler: function(val, oldVal) {
        if (val === false) {
          this.listConfig.searchForm.forms = [
            { prop: 'Q^STATUS_^S', label: '状态', itemWidth: '200', fieldType: 'select', options: statusOptions },
            { prop: 'Q^NAME_^SL', label: '姓名', itemWidth: '200' }
          ]
          this.listConfig.columns = [
            { prop: 'name', label: '姓名' },
            { prop: 'gender', label: '性别', tags: genderOptions },
            { prop: 'status', label: '状态', tags: statusOptions },
            { prop: 'createTime', label: '创建时间' }
          ]
        } else {
          this.listConfig.searchForm.forms = [
            { prop: 'Q^NAME_^SL', label: '姓名', itemWidth: '200' },
            { prop: 'Q^ACCOUNT_^SL', label: '帐号', itemWidth: '200' }
          ]
          this.listConfig.columns = [
            { prop: 'name', label: '姓名' },
            { prop: 'account', label: '帐号' }
          ]
        }
      },
      immediate: true
    }
  },
  created() {
    this.loadTreeData()
    this.loadListData()
  },
  methods: {
    // ==========================左侧的====================================
    checkTreeId(datas) {
      const filter = function(datas) {
        const arr = []
        datas.find(item => {
          if (item.children && item.children !== []) {
            item.children.forEach(i => {
              arr.push(i.id)
            })
            filter(item.children)
          } else {
            return
          }
        })
        return arr
      }
      this.treeIds = filter(datas)
    },
    loadTreeData() {
      if (!this.isTreeAll) return
      this.loadingTree = true
      this.inclueChild = true
      this.partyId = ''
      if (this.partyType === 'org') {
        let id = 1
        if (this.typeId !== '') {
          id = this.typeId
        }
        this.loadOrgTreeData(id)
      } else if (this.partyType === 'position') {
        this.loadPositionTreeData()
      } else if (this.partyType === 'role') {
        this.inclueChild = false
        this.loadRoleTreeData()
      } else if (this.partyType === 'group') {
        this.inclueChild = false
        this.loadGroupTreeData()
      }
    },
    // 加载机构树
    loadOrgTreeData(orgId) {
      getOrgTreeData({
        type: orgId
      }).then(response => {
        this.loadingTree = false
        const data = response.data
        this.treeData = TreeUtils.transformToArrayFormat(data)
        this.checkTreeId(this.treeData)
      }).catch(() => {
        this.loadingTree = false
      })
    },
    // 加载岗位树
    loadPositionTreeData() {
      getPositionTreeData({
        parameters: [],
        requestPage: {},
        sorts: []
      }).then(response => {
        this.loadingTree = false
        const data = response.data
        this.treeData = TreeUtils.transformToArrayFormat(data)
        this.checkTreeId(this.treeData)
      }).catch(() => {
        this.loadingTree = false
      })
    },
    // 加载角色树
    loadRoleTreeData() {
      getRoleTreeData().then(response => {
        const data = response.data
        data.unshift({
          id: 0,
          name: '角色树',
          parentId: null
        })
        findAllSubsystem().then(response => {
          this.loadingTree = false
          const subSystemList = response.data
          subSystemList.forEach(subSystem => {
            data.push({
              id: subSystem.id,
              name: subSystem.name,
              parentId: 0
            })
          })
          this.treeData = TreeUtils.transformToArrayFormat(data)
          this.checkTreeId(this.treeData)
        }).catch(() => {
          this.loadingTree = false
        })
      }).catch(() => {
        this.loadingTree = false
      })
    },
    // 加载用户组树
    loadGroupTreeData() {
      getGroupTreeData({
        type: '1'
      }).then(response => {
        this.loadingTree = false
        const data = response.data
        this.treeData = TreeUtils.transformToArrayFormat(data)
        this.checkTreeId(this.treeData)
      }).catch(() => {
        this.loadingTree = false
      })
    },
    handleTreeAction(command, position, selection, data) {
      if (position === 'toolbar' && command.key === 'refresh') {
        this.loadTreeData()
      }
      if (command.key === 'expand') {
        this.expandCompressTree(true)
      } else if (command.key === 'compress') {
        this.expandCompressTree(false)
      }
    },
    expandCompressTree(expanded) {
      for (let i = 0; i < this.$refs.elTree.store._getAllNodes().length; i++) {
        this.$refs.elTree.store._getAllNodes()[i].expanded = expanded
      }
    },
    // 点击节点
    handleNodeClick(data) {
      if (data.id === '0') return
      if (this.inclueChild) {
        const ids = []
        this.getChildrenIds(data, ids)
        this.partyId = ids.join(',')
      } else {
        this.partyId = data.id
      }
      console.log('panel.handleNodeClick() --> ', this.inclueChild, this.partyId)
      this.loadListData()
    },
    // ========================右侧======================================
    /**
     * 加载数据
     */
    loadListData() {
      let type = this.partyType
      this.loading = true
      if (this.isTreeAll) {
        if (this.$utils.isNotEmpty(this.partyId)) {
          type = this.partyType
        } else if (this.groundId && this.groundId !== '') {
          type = 'org'
        }
        query(type, this.getFormatParams()).then(response => {
          this.loading = false
          ActionUtils.handleListData(this, response.data)
        }).catch(() => {
          this.loading = false
        })
      } else if (this.moduleType === 'position') {
        queryWithOrg4Position(this.getFormatParams()).then(response => {
          this.loading = false
          ActionUtils.handleListData(this, response.data)
        }).catch(() => {
          this.loading = false
        })
      } else {
        queryPageList(this.getFormatParams()).then(response => {
          this.loading = false
          ActionUtils.handleListData(this, response.data)
        }).catch(() => {
          this.loading = false
        })
      }
    },
    /**
     * 获取查询条件格式化参数
     */
    getFormatParams() {
      const params = this.$refs['crud'] ? this.$refs['crud'].getSearcFormData() : {}
      const key = this.partyType === 'org' ? 'orgId' : this.partyType === 'position' ? 'positionId' : this.partyType === 'role' ? 'roleId' : this.partyType === 'group' ? 'groupId' : ''
      if (this.isTreeAll) {
        if (this.partyType === 'position') {
          params['inclueChild'] = !!this.inclueChild
        } else if (this.partyType === 'org') {
          params['inclueChild'] = this.inclueChild
        } else if (this.partyType === 'role') {
          params['inclueChild'] = false
        } else if (this.partyType === 'group') {
          params['inclueChild'] = false
        }
        if (this.$utils.isNotEmpty(this.partyId) || this.groundId !== '') {
          if (this.partyId !== 0 && this.partyId !== '0') {
            params[key] = this.partyId === '' ? this.groundId : this.partyId
          }
        } else {
          params[key] = this.treeIds.join(',')
        }
      }
      if (this.moduleType === 'position') {
        params['positionId'] = this.typeId
      }
      if (this.moreSearchParams) {
        Object.assign(params, this.moreSearchParams)
      }
      return ActionUtils.formatParams(
        params,
        this.pagination,
        this.sorts)
    },
    /**
     * 处理分页事件
     */
    handlePaginationChange(page) {
      ActionUtils.setSorts(this.sorts)
      ActionUtils.setPagination(this.pagination, page)
      this.loadListData()
    },
    /**
     * 处理排序
     */
    handleSortChange(sort) {
      ActionUtils.setSorts(this.sorts, sort)
      ActionUtils.setPagination(this.pagination)
      this.loadListData()
    },
    /**
     * 查询
     */
    search() {
      ActionUtils.setPagination(this.pagination)
      this.loadListData()
    },
    /**
     * 重置查询条件
     */
    reset() {
      this.$refs['crud'].handleReset()
    },
    /**
     * 处理按钮事件
     */
    handleAction(command, position, selection, data) {
      switch (command) {
        case 'search':// 查询
          this.loadListData()
          break
        case 'moreSearch':// 更多
          this.handleMoreSearch()
          break
        default:
          break
      }
    },
    /**
     * 处理按钮事件
     */
    handleMoreSearchAction(data) {
      ActionUtils.setPagination(this.pagination)
      this.moreSearchParams = data
      this.loadListData()
    },
    /**
     * 处理更多
     */
    handleMoreSearch() {
      this.dialogFormVisible = true
    },
    handleSelectionChange(selection) {
      if (this.multiple) {
        // 是否在原来 列表里面
        const noListData = []
        this.value.forEach((item) => {
          const index = this.listData.find((data) => { return data[this.pkKey] === item[this.pkKey] })
          if (!index) { noListData.push(item) }
        })
        this.$emit('selected', noListData.concat(selection))

        // 是否在原来 列表里面
        // const noListData = []
        // this.value.forEach((item) => {
        //   const index = this.listData.find((data) => { return data[this.pkKey] === item[this.pkKey] })
        //   if (index) { noListData.push(item) }
        // })
        // const arr = noListData.concat(selection)
        // const result = []
        // const obj = {}
        // for (const i of arr) {
        //   if (!obj[i]) {
        //     result.push(i)
        //   }
        // }
        // this.$emit('selected', result)
      } else {
        this.$emit('selected', selection)
      }
    },
    changePartyType(value) {
      this.partyType = value
      this.moreSearchParams = {}
      this.treeIds = []
      this.loadTreeData()
      this.loadListData()
    },
    getChildrenIds(data, list) {
      list.push(data.id)
      const children = data.children
      if (this.$utils.isNotEmpty(children)) {
        for (let i = 0; i < children.length; i++) {
          const element = children[i]
          this.getChildrenIds(element, list)
        }
      }
      return list
    }
  }
}
</script>
<style lang="scss" >
$border-color: #e5e6e7;
.org-panel-more-search-dialog{
  .el-dialog__body{
    height:  calc(40vh - 120px) !important;
  }
}
.ibps-employee-selector-tree{
  .ibps-tree-toolbar {
      border: 1px solid $border-color;
      height: 30px;
      padding: 5px;
    }
    .ibps-tree-search-form {
      padding: 5px;
      border-right: 1px solid $border-color;
      background: #ffffff;
    }
    .ibps-tree-main {
      border: 1px solid $border-color;
    }
    .ibps-tree-wrapper {
      background: #ffffff;
      .el-tree > .el-tree-node {
        display: inline-block;
      }
    }
}
</style>

