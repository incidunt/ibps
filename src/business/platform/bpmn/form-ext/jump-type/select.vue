<template>
  <div>
    <el-form-item :label="jumpType==='select'?'选择路径:':'目标节点'">
      <el-select v-model="curNodeId">
        <el-option
          v-for="({nodeId,name}) in outgoingNodes"
          :key="nodeId"
          :value="nodeId"
          :label="name"
        />
      </el-select>
    </el-form-item>
    <el-form-item v-if="nodeTypeMap[curNodeId] !=='end'" label="选择执行人:">
      <div>
        <el-checkbox
          v-model="checkAll[curNodeId]"
          :indeterminate="isIndeterminate[curNodeId]"
          size="mini"
          @change="(val)=>handleCheckAllChange(val,curNodeId)"
        >全选</el-checkbox>

        <el-button
          type="primary"
          plain
          @click="handleSelectEmployee(curNodeId)"
        >选择用户</el-button>
        <div style="margin: 15px 0;" />
        <el-checkbox-group
          v-model="selectNodeUser1[curNodeId]"
        >
          <el-checkbox
            v-for="nodeUser in nodesUsersMap[curNodeId]"
            :key="nodeUser.id"
            :label="nodeUser.id+''"
            @change="handleCheckedUsersChange(nodeUser.id,curNodeId)"
          >{{ nodeUser.name }}
          </el-checkbox>
        </el-checkbox-group>
      </div>
    </el-form-item>
    <!-- 人员选择器 -->
    <ibps-employee-selector-dialog
      :visible="selectorVisible"
      :value="[]"
      multiple
      @close="visible => selectorVisible = visible"
      @action-event="handleSelectorActionEvent"
    />
  </div>
</template>
<script>
/* 用户选择器*/
import IbpsEmployeeSelectorDialog from '@/business/platform/org/employee/dialog'
export default {
  components: {
    IbpsEmployeeSelectorDialog
  },
  props: {
    jumpType: String,
    outgoingNodes: Array,
    outgoingNodesUsersMap: Object
  },
  data() {
    return {
      selectorVisible: false,
      curNodeId: '',

      selectNodeUserAll: {},
      selectNodeUser: { },
      isIndeterminate: { },
      checkAll: { },
      nodesUsersMap: {},
      nodeTypeMap: {}
    }
  },
  computed: {
    selectNodeUser1: {
      get() {
        return JSON.parse(JSON.stringify(this.selectNodeUser))
      },
      set(val) {
        this.selectNodeUser = JSON.parse(JSON.stringify(val))
      }
    }
  },
  watch: {
    outgoingNodesUsersMap: {
      handler(val) {
        this.nodesUsersMap = val
        this.initData()
      },
      immediate: true
    },
    nodesUsersMap: {
      handler(val) {
        this.$emit('update:outgoingNodesUsersMap', val)
      },
      deep: true
    }
  },
  methods: {
    initData() {
      if (this.$utils.isEmpty(this.outgoingNodes)) {
        return
      }
      this.curNodeId = this.outgoingNodes[0].nodeId
      for (let i = 0; i < this.outgoingNodes.length; i++) {
        const node = this.outgoingNodes[i]
        const nodeId = node.nodeId
        this.nodeTypeMap[nodeId] = node.type.key// 节点类型
        const nodeUsers = this.nodesUsersMap[nodeId] || []
        const checkedUser = []
        nodeUsers.forEach(user => {
          checkedUser.push(user.id)
        })
        this.selectNodeUserAll[nodeId] = false
        this.selectNodeUser[nodeId] = checkedUser
        this.isIndeterminate[nodeId] = false
        this.checkAll[nodeId] = this.$utils.isNotEmpty(nodeUsers)
      }
    },
    handleSelectNodeUserAll() {
      this.selectNodeUserAll = JSON.parse(JSON.stringify(this.selectNodeUserAll))
    },
    handleCheckAllChange(val, nodeId) {
      const allValue = []
      this.nodesUsersMap[nodeId].forEach(user => {
        allValue.push(user.id)
      })
      this.selectNodeUser[nodeId] = val ? allValue : []
      this.isIndeterminate[nodeId] = false
    },
    handleCheckedUsersChange(value, nodeId) {
      const data = JSON.parse(JSON.stringify(this.selectNodeUser[nodeId]))
      const index = data.findIndex((v) => {
        return v === value
      })
      if (index > -1) {
        data.splice(index, 1)
      } else {
        data.push(value)
      }
      const updateData = JSON.parse(JSON.stringify(this.selectNodeUser))
      updateData[nodeId] = data
      this.selectNodeUser1 = updateData

      const checkedCount = data.length
      const allCount = this.nodesUsersMap[nodeId].length
      this.checkAll[nodeId] = checkedCount === allCount
      this.isIndeterminate[nodeId] = checkedCount > 0 && checkedCount < allCount
    },
    handleSelectEmployee(nodeId) {
      this.curNodeId = nodeId
      this.selectorVisible = true
    },
    handleSelectorActionEvent(buttonKey, data) {
      if (buttonKey === 'confirm') {
        const nodeUsers = this.nodesUsersMap[this.curNodeId]
        const ids = []
        for (let i = 0; i < data.length; i++) {
          const d = data[i]
          if (!this.$utils.oneOfObj(d.id, nodeUsers, 'id')) {
            nodeUsers.push({
              id: d.id,
              name: d.name,
              type: 'employee'
            })
          }
        }
        for (let i = 0; i < nodeUsers.length; i++) {
          const d = nodeUsers[i]
          ids.push(d.id)
        }
        this.nodesUsersMap[this.curNodeId] = nodeUsers

        const updateData = JSON.parse(JSON.stringify(this.selectNodeUser))
        updateData[this.curNodeId] = ids
        this.selectNodeUser1 = updateData

        this.selectorVisible = false
      }
    },
    getData() {
      const nodeUsers = []
      const destination = this.curNodeId || ''
      const outgoingNodesUsers = this.nodesUsersMap[this.curNodeId] || []
      const selectNodeUser = this.selectNodeUser[this.curNodeId]
      const executors = []
      outgoingNodesUsers.forEach(user => {
        if (selectNodeUser.indexOf(user.id) > -1) {
          user.groupType = ''
          executors.push(user)
        }
      })
      nodeUsers.push({
        jumpType: this.jumpType,
        nodeId: this.curNodeId,
        executors: executors
      })
      return {
        destination,
        nodeUsers: JSON.stringify(nodeUsers)
      }
    }
  }
}
</script>
