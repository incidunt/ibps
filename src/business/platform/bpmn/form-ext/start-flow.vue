<template>
  <el-dialog
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :title="'启动流程'"
    class="bpmn-agree-dialog"
    append-to-body
    top="5vh"
    width="50%"
    height="50%"
    @close="closeDialog"
    @open="getFormData"
  >
    <table v-loading.fullscreen.lock="dialogLoading" class="table table-bordered table-hover table-striped">
      <thead>
        <tr>
          <th width="50%"><el-checkbox v-model="selectPathAll" @change="()=>{selectPathLine=''}">选择路径
            <el-tooltip>
              <div slot="content">
                1、指定路径只支持一条; <br>
                2、同步网关、分支同步网关不支持指定路径；
              </div>
              <i class="ibps-icon-help red" /></el-tooltip>
          </el-checkbox>
          </th>
          <th width="50%"><el-checkbox v-model="selectUserAll">指定执行人</el-checkbox></th>
        </tr>
      </thead>
      <tbody v-if="outgoingNodes&& outgoingNodes.length >0">
        <tr v-for="({nodeId,name}) in outgoingNodes" :key="nodeId">
          <td>
            <el-radio
              v-if="selectPathAll"
              v-model="selectPathLine"
              :label="nodeId"
              :disabled="!nodeSupportSelectPath[nodeId]"
            >{{ name }}</el-radio>
            <span v-else>{{ name }}</span>
          </td>
          <td>
            <el-switch
              v-if="selectUserAll && ( selectPathLine=='' ||selectPathLine ===nodeId)"
              v-model="selectNodeUserAll[nodeId]"
              @change="handleSelectNodeUserAll"
            />
            <div style="margin: 15px 0;" />
            <!---选择用户:--->
            <el-checkbox
              v-if="selectUserAll && selectNodeUserAll[nodeId]"
              v-model="checkAll[nodeId]"
              :indeterminate="isIndeterminate[nodeId]"
              size="mini"
              @change="(val)=>handleCheckAllChange(val,nodeId)"
            >全选</el-checkbox>

            <el-button
              v-if="selectUserAll && selectNodeUserAll[nodeId]"
              type="primary"
              plain
              @click="handleSelectEmployee(nodeId)"
            >选择用户</el-button>
            <div style="margin: 15px 0;" />
            <el-checkbox-group
              v-model="selectNodeUser1[nodeId]"
              :disabled="! (selectUserAll && selectNodeUserAll[nodeId])"
            >
              <el-checkbox
                v-for="nodeUser in outgoingNodesUsersMap[nodeId]"
                :key="nodeUser.id"
                :label="nodeUser.id+''"
                @change="handleCheckedUsersChange(nodeUser.id,nodeId)"
              >{{ nodeUser.name }}
              </el-checkbox>
            </el-checkbox-group>
          </td>
        </tr>
      </tbody>
    </table>
    <!-- 人员选择器 -->
    <ibps-employee-selector-dialog
      :visible="selectorVisible"
      :value="[]"
      multiple
      @close="visible => selectorVisible = visible"
      @action-event="handleSelectorActionEvent"
    />
    <div slot="footer" class="el-dialog--center">
      <el-button type="primary" icon="ibps-icon-send" @click="handleSave()">启动</el-button>
      <el-button type="danger" icon="el-icon-circle-close" @click="closeDialog()">取 消</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { startOutgoing } from '@/api/platform/bpmn/bpmInst'
/* 用户选择器*/
import IbpsEmployeeSelectorDialog from '@/business/platform/org/employee/dialog'

export default {
  components: {
    IbpsEmployeeSelectorDialog
  },
  props: {
    visible: Boolean,
    defId: String,
    data: Object
  },
  data() {
    return {
      dialogVisible: this.visible,
      dialogLoading: false,

      curNodeId: '',
      selectorVisible: false,

      selectPathAll: false,
      selectUserAll: false,

      selectNodeUserAll: {},

      selectPathLine: '',
      selectNodeUser: { },
      isIndeterminate: { },
      checkAll: { },
      nodeSupportSelectPath: {}, // 节点支持选择路径
      outgoingNodes: [],
      outgoingNodesUsersMap: {}
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
    visible: {
      handler: function(val, oldVal) {
        this.dialogVisible = this.visible
      },
      immediate: true
    }
  },
  methods: {
    getFormData() {
      this.dialogLoading = true
      this.selectPathAll = false
      this.selectUserAll = false
      startOutgoing({
        defId: this.defId,
        data: JSON.stringify(this.data)
      }).then(response => {
        this.dialogLoading = false
        const variables = response.variables
        this.outgoingNodes = variables.outgoingNodes
        this.outgoingNodesUsersMap = variables.outgoingNodesUsersMap
        this.nodeSupportSelectPath = variables.nodeSupportSelectPath

        if (this.outgoingNodes && this.outgoingNodes.length > 0) {
          for (let i = 0; i < this.outgoingNodes.length; i++) {
            const node = this.outgoingNodes[i]
            const nodeId = node.nodeId
            const nodeUsers = this.outgoingNodesUsersMap[nodeId] || []
            const checkedUser = []
            nodeUsers.forEach(user => {
              checkedUser.push(user.id)
            })
            this.selectNodeUserAll[nodeId] = false
            this.selectNodeUser[nodeId] = checkedUser
            this.isIndeterminate[nodeId] = false
            this.checkAll[nodeId] = this.$utils.isNotEmpty(nodeUsers)
          }
        }
      }).catch(() => {
        this.dialogLoading = false
      })
    },
    closeDialog() {
      this.$emit('close', false)
    },
    handleSave() {
      const nodeUsers = []
      let destination = ''
      // this.selectPathAll ? this.selectPathLine : ''

      if (this.selectPathAll && this.$utils.isEmpty(this.selectPathLine)) {
        this.$message({
          message: '请选择一个路径',
          type: 'warning'
        })
        return
      }
      destination = this.selectPathAll ? this.selectPathLine : ''

      if (this.selectUserAll) {
        for (let i = 0; i < this.outgoingNodes.length; i++) {
          const nodeId = this.outgoingNodes[i].nodeId
          const outgoingNodesUsers = this.outgoingNodesUsersMap[nodeId] || []
          const selectNodeUser = this.selectNodeUser[nodeId]
          const executors = []
          outgoingNodesUsers.forEach(user => {
            if (selectNodeUser.indexOf(user.id) > -1) {
              user.groupType = ''
              executors.push(user)
            }
          })
          if (this.selectNodeUserAll[nodeId]) {
            nodeUsers.push({
              nodeId: nodeId,
              executors: executors
            })
          }
        }
      }

      this.$emit('action-event', {
        destination,
        nodeUsers: JSON.stringify(nodeUsers)
      })
    },
    handleSelectNodeUserAll() {
      this.selectNodeUserAll = JSON.parse(JSON.stringify(this.selectNodeUserAll))
    },
    handleCheckAllChange(val, nodeId) {
      const allValue = []
      this.outgoingNodesUsersMap[nodeId].forEach(user => {
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
      const allCount = this.outgoingNodesUsersMap[nodeId].length
      this.checkAll[nodeId] = checkedCount === allCount
      this.isIndeterminate[nodeId] = checkedCount > 0 && checkedCount < allCount
    },
    handleSelectEmployee(nodeId) {
      this.curNodeId = nodeId
      this.selectorVisible = true
    },
    handleSelectorActionEvent(buttonKey, data) {
      if (buttonKey === 'confirm') {
        const nodeUsers = this.outgoingNodesUsersMap[this.curNodeId]
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
        this.outgoingNodesUsersMap[this.curNodeId] = nodeUsers

        const updateData = JSON.parse(JSON.stringify(this.selectNodeUser))
        updateData[this.curNodeId] = ids
        this.selectNodeUser1 = updateData

        this.selectorVisible = false
      }
    }
  }
}
</script>
