<template>
  <div class="panel-default">
    <div class="panel-body">
      <div class="buttons ibps-pb-5 ibps-tr">
        <el-button type="success" size="mini" plain @click="editRule()">添加规则</el-button>
        <el-button type="danger" size="mini" plain @click="cleanRule">清空规则</el-button>
      </div>
      <el-table :data="rules" border style="width: 100%">
        <el-table-column align="center" prop="ruleName" label="规则名称" />
        <el-table-column align="center" label="目标节点" width="180">
          <template slot-scope="scope">{{ scope.row.targetNode|optionsFilter(targetNodeList) }}</template>
        </el-table-column>
        <el-table-column align="center" label="管理" width="100">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="editRule(scope.$index)">编辑</el-button>
            <el-button type="text" size="small" @click="removeRule(scope.$index)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <edit-jump-rule
      :node-list="targetNodeList"
      :title="title"
      :data="editData"
      :visible="dialogFormVisible"
      @callback="handleData"
      @close="visible => dialogFormVisible = false"
    />
  </div>
</template>
<script>
import { mapState } from 'vuex'
import _defaultsDeep from 'lodash.defaultsdeep'
import EditJumpRule from './../components/edit-jump-rule'
export default {
  components: {
    EditJumpRule
  },
  props: {
    data: Array
  },
  data() {
    return {
      defaultValue: {
        ruleName: '',
        targetNode: '',
        targetName: '',
        condition: 'return true;'
      },
      editData: {},
      editIndex: -1,
      dialogFormVisible: false,
      title: '添加跳转规则'
    }
  },
  computed: {
    rules() {
      return this.data
    },
    ...mapState({
      nodeList: state => state.ibps.bpmn.nodeList
    }),
    /**
     * 目标节点列表
     */
    targetNodeList() {
      const list = []
      this.nodeList.forEach((node) => {
        if (node.nodeType === 'userTask' ||
          node.nodeType === 'signTask' ||
          node.nodeType === 'end') {
          list.push(node)
        }
      })
      return list
    }
  },
  methods: {
    // 新增编辑规则
    editRule(index) {
      const data = this.$utils.isNotEmpty(index) ? this.rules[index] : {}
      this.editData = _defaultsDeep(JSON.parse(JSON.stringify(data)), this.defaultValue)
      this.editIndex = this.$utils.isNotEmpty(index) ? index : -1
      this.title = this.$utils.isNotEmpty(index) ? '编辑跳转规则' : '添加跳转规则'
      this.dialogFormVisible = true
    },
    // 删除单行规则
    removeRule(index) {
      this.rules.splice(index, 1)
    },
    // 清空规则
    cleanRule() {
      this.$confirm('是否清空规则?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.rules.splice(0, this.rules.length)
      })
    },
    /**
     * 处理数据
     */
    handleData(data) {
      if (this.editIndex > -1) {
        this.rules.splice(this.editIndex, 1, data)
      } else {
        this.rules.push(data)
      }
    }
  }
}
</script>
