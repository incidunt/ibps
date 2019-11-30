<template>
  <div class="panel-body">
    <!-- <div class="panel-heading">c触发流程设置</div> -->
    <div>
      <div class="buttons ibps-pb-5 ibps-tr">
        <el-button type="success" size="mini" plain @click="editTrigerFlow()">添加流程</el-button>
        <el-button type="danger" size="mini" plain @click="cleanTrigerFlow()">清空流程</el-button>
      </div>
      <el-table :data="trigerFlows" border style="width: 100%">
        <el-table-column prop="trigerFlowName" label="流程名称" />
        <el-table-column prop="actionName" label="触发动作" width="180" />
        <el-table-column label="管理" width="120">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="setDefinition(scope.row)">设置</el-button>
            <el-button type="text" size="small" @click="editTrigerFlow(scope.$index)">编辑</el-button>
            <el-button type="text" size="small" @click="removeTrigerFlow(scope.$index)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <edit-trigger-flow
      :title="title"
      :data="editData"
      :bo-data="boData"
      :visible="dialogFormVisible"
      @callback="handleData"
      @close="visible => dialogFormVisible = false"
    />
    <!-- 流程设置-->
    <ibps-bpmn-def-setting
      :visible="settingFormVisible"
      :def-id="trigerFlowDefId"
      :def-key="trigerFlowDefKey"
      title="设置"
      @close="visible => settingFormVisible = visible"
    />
  </div>
</template>
<script>
import { getByDefKey } from '@/api/platform/bpmn/bpmDefinition'
import _defaultsDeep from 'lodash.defaultsdeep'
import EditTriggerFlow from '../components/edit-trigger-flow'

export default {
  name: 'trigger-flow',
  components: {
    EditTriggerFlow
  },
  props: {
    data: Array,
    boData: Object,
    defId: String,
    curNode: Object
  },
  data() {
    return {
      defaultValue: {
        defId: this.defId,
        nodeId: this.curNode.id,
        trigerFlowKey: '',
        trigerFlowName: '',
        action: 'agree',
        actionName: '同意',
        bpmTrigerParamPoList: []
      },
      editData: {},
      editIndex: -1,
      dialogFormVisible: false,
      title: '添加触发流程',

      settingFormVisible: false,
      trigerFlowDefId: '',
      trigerFlowDefKey: ''
    }
  },
  computed: {
    trigerFlows() {
      return this.data
    }
  },
  methods: {
    // 新增编辑触发流程
    editTrigerFlow(index) {
      if (this.boData && this.$utils.isEmpty(this.boData.code)) {
        this.$alert('流程未配置业务对象')
        return
      }
      const data = this.$utils.isNotEmpty(index) ? this.trigerFlows[index] : {}
      data.defId = this.defId
      data.nodeId = this.curNode.id
      this.editData = _defaultsDeep(JSON.parse(JSON.stringify(data)), this.defaultValue)
      this.editIndex = this.$utils.isNotEmpty(index) ? index : -1
      this.title = this.$utils.isNotEmpty(index) ? '编辑触发流程' : '添加触发流程'
      this.dialogFormVisible = true
    },
    // 删除单行触发流程
    removeTrigerFlow(index) {
      this.trigerFlows.splice(index, 1)
    },
    // 清空触发流程
    cleanTrigerFlow() {
      this.$confirm('是否清空触发流程?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.trigerFlows.splice(0, this.trigerFlows.length)
      })
    },
    /**
     * 处理数据
     */
    handleData(data) {
      if (this.editIndex > -1) {
        this.trigerFlows.splice(this.editIndex, 1, data)
      } else {
        this.trigerFlows.push(data)
      }
    },
    setDefinition(row) {
      this.trigerFlowDefKey = row.trigerFlowKey
      getByDefKey({
        defKey: this.trigerFlowDefKey
      }).then(response => {
        const data = response.data
        this.trigerFlowDefId = data.defId
        this.settingFormVisible = true
      }).catch(() => {
      })
    }

  }
}
</script>

