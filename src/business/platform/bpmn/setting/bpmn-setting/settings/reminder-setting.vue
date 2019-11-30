<template>
  <div class=" panel-body">
    <div class="buttons ibps-pb-5 ibps-tr">
      <el-button type="success" size="mini" plain @click="editReminder()">添加催办</el-button>
      <el-button type="danger" size="mini" plain @click="cleanReminder">清空催办</el-button>
    </div>
    <el-table :data="reminders" border style="width: 100%">
      <el-table-column prop="name" label="催办名称" />
      <el-table-column label="管理" width="100">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="editReminder(scope.$index)">编辑</el-button>
          <el-button type="text" size="small" @click="removeReminder(scope.$index)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <edit-reminder
      :visible="dialogFormVisible"
      :title="title"
      :data="editData"
      :cur-node="curNode"
      @callback="handleData"
      @close="visible => dialogFormVisible = false"
    />
  </div>
</template>
<script>
import _defaultsDeep from 'lodash.defaultsdeep'
import EditReminder from './../components/edit-reminder'
export default {
  components: {
    EditReminder
  },
  props: {
    data: Array,
    defId: String,
    curNode: Object
  },
  data() {
    return {
      defaultValue: {
        procDefId: '',
        nodeId: '',
        name: '',
        relNodeId: '',
        relNodeEvent: 'create',
        relTimeType: 'caltime',
        cronExpression: '',
        dueTime: '',
        dueAction: 'no-action',
        startTime: '',
        interval: '',
        sendTimes: '',
        msgTypeHtml: '', // 发送类型
        html: '',
        plainText: '',
        needSendMsg: false
      },
      editData: {},
      editIndex: -1,
      dialogFormVisible: false,
      title: '添加催办'
    }
  },
  computed: {
    reminders() {
      return this.data
    }
  },
  methods: {
    // 新增、编辑催办
    editReminder(index) {
      const isAdd = this.$utils.isEmpty(index)
      const data = isAdd ? {} : this.reminders[index]
      if (isAdd) {
        this.defaultValue.nodeId = this.curNode.id
        this.defaultValue.procDefId = this.defId
      }
      this.editData = _defaultsDeep(JSON.parse(JSON.stringify(data)), this.defaultValue)
      this.editIndex = isAdd ? -1 : index
      this.title = isAdd ? '添加催办' : '编辑催办'
      this.dialogFormVisible = true
    },
    // 删除催办
    removeReminder(index) {
      this.reminders.splice(index, 1)
    },
    // 清空催办
    cleanReminder() {
      this.$confirm('是否清空催办?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.reminders.splice(0, this.reminders.length)
      })
    },
    /**
     * 处理数据
     */
    handleData(data) {
      if (this.editIndex > -1) {
        this.reminders.splice(this.editIndex, 1, data)
      } else {
        this.reminders.push(data)
      }
    }
  }
}
</script>
