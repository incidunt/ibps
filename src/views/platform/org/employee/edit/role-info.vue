<template>
  <el-row :gutter="10">
    <el-col v-if="!readonly" :span="8" border>
      <div class="grid-content">
        <tree
          ref="elTree"
          :height="height"
          :data="treeData"
          :check-strictly="checkStrictly"
          node-key="id"
          @action-event="handleTreeAction"
        />
      </div>
    </el-col>
    <el-col v-if="!readonly" :span="3">
      <el-button type="primary" icon="el-icon-d-arrow-right" @click="handleBelongTo">分配</el-button>
      <el-button type="primary" icon="el-icon-d-arrow-left" style="margin-top:10px;" @click="handleClear(newRoleData)">清空</el-button>
    </el-col>
    <el-col :span="spanNumber" border>
      <el-table
        :data="roleItemList"
        style="width: 100%"
        border
      >
        <el-table-column
          label="角色名称"
        >
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="子系统"
          width="150"
        >
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.subSystemName }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="角色来源"
          width="150"
        >
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.source ? scope.row.source : '自有' }}</span>
          </template>
        </el-table-column>
        <el-table-column
          v-if="!readonly"
          label="管理"
          width="110"
        >
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.source==='自有'||scope.row.source==='自有,其他'"
              size="mini"
              type="danger"
              @click.native.prevent="deleteRow(scope.$index,roleItemList)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-col>
  </el-row>
</template>
<script>
import { findAllSubsystem } from '@/api/platform/auth/subsystem'
import { getTreeData } from '@/api/platform/org/role'

import Tree from '../../components/tree'
import { concat } from '../utils'

export default {
  components: {
    Tree
  },
  props: {
    data: Array,
    readonly: {
      type: Boolean,
      default: false
    },
    span: [Number, String]
  },
  data() {
    return {
      subsystemList: [],
      checkStrictly: true,
      pkKey: 'id',
      nameKey: 'name',
      treeData: [],
      roleItemList: [],
      height: document.clientHeight,
      newRoleData: [],
      defaultTreeData: []
    }
  },
  computed: {
    spanNumber() {
      return this.span
    }
  },
  watch: {
    data: {
      handler: function(val, oldVal) {
        this.roleItemList = val
        const arr = JSON.parse(JSON.stringify(val))
        arr.forEach(item => {
          this.defaultTreeData.push(item.id)
        })
        this.$refs.elTree ? this.$refs.elTree.setCheckedKeys(this.defaultTreeData, true) : null
      },
      deep: true
    },
    roleItemList: {
      handler: function(val, oldVal) {
        if (val !== oldVal) {
          this.handleEmitEvent()
        }
      },
      deep: true
    }
  },
  created() {
    this.loadSubsystemData()
  },
  methods: {
    init() {
      this.$refs.elTree ? this.$refs.elTree.setCheckedNodes([]) : null
      this.defaultTreeData = []
    },
    loadSubsystemData() {
      findAllSubsystem().then(response => {
        this.subsystemList = response.data
        this.loadTreeData()
      }).catch(() => {
        // 异常
      })
    },
    // 树[数据]获取
    loadTreeData() {
      getTreeData().then(response => {
        const data = response.data
        this.subsystemList.forEach((item) => {
          data.push({
            id: item.id,
            name: item.name,
            parentId: 0
          })
        })

        data.unshift({
          id: '0',
          name: '角色树',
          parentId: null,
          disabled: true
        })
        this.treeData = data
      }).catch(() => {
      })
    },
    // 组织树事件
    handleTreeAction(command, position, selection, data) {
      if (position === 'toolbar') {
        if (command === 'refresh') {
          this.loadTreeData()
        }
      }
    },
    // 属于
    handleBelongTo() {
      const tree = this.$refs.elTree
      const postInfo = tree.getCheckedNodes() // 勾选
      this.result = []
      this.deresult = []
      if (this.$utils.isEmpty(postInfo)) {
        return
      }
      this.newRoleData = []
      for (let i = 0; i < postInfo.length; i++) {
        if (postInfo[i].type === 'role') {
          postInfo[i].source = '自有'
          this.newRoleData.push(postInfo[i])
        }
      }
      this.roleItemList = concat(this.roleItemList, this.newRoleData)
    },
    handleClear(data) {
      this.roleItemList = []
      // this.newRoleData.forEach(i => {
      //   this.roleItemList.forEach((l, index) => {
      //     if (i.id === l.id) {
      //       this.roleItemList.splice(index, 1)
      //     }
      //   })
      // })
    },
    deleteRow(index, row) {
      row.splice(index, 1)
    },
    handleEmitEvent() {
      this.$emit('input', this.roleItemList)
    }
  }
}
</script>
