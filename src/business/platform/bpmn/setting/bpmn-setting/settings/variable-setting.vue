<template>
  <div class="panel-body">
    <div class="buttons ibps-pb-5 ibps-tr">
      <el-button type="success" size="mini" plain @click="editVariable()">添加变量</el-button>
      <el-button type="danger" size="mini" plain @click="cleanVariable">清空变量</el-button>
    </div>
    <el-table :data="variables" border style="width: 100%">
      <el-table-column align="center" prop="name" label="变量名称" />
      <el-table-column align="center" prop="key" label="变量KEY" width="180" />
      <el-table-column align="center" label="管理" width="100">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="editVariable(scope.$index)">编辑</el-button>
          <el-button type="text" size="small" @click="removeVariable(scope.$index)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <edit-variable
      :visible="dialogFormVisible"
      :title="title"
      :data="editData"
      @callback="handleData"
      @close="visible => dialogFormVisible = false"
    />
  </div>
</template>
<script>
import _defaultsDeep from 'lodash.defaultsdeep'
import EditVariable from './../components/edit-variable'
import { mapActions } from 'vuex'

export default {
  components: {
    EditVariable
  },
  props: {
    data: Array
  },
  data() {
    return {
      defaultValue: {
        nodeId: '',
        name: '',
        key: '',
        isRequired: 'false',
        dataType: 'string',
        defaultVal: '',
        description: ''
      },
      editData: {},
      editIndex: -1,
      dialogFormVisible: false,
      title: '添加流程变量'
    }
  },
  computed: {
    variables() {
      return this.data
    }
  },
  watch: {
    variables: {
      handler(val, oldVal) {
        this.setVariables(val)
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    ...mapActions({
      setVariables: 'ibps/bpmn/setVariables'
    }),
    // 新增、编辑变量
    editVariable(index) {
      const data = this.$utils.isNotEmpty(index) ? this.variables[index] : {}
      this.editData = _defaultsDeep(JSON.parse(JSON.stringify(data)), this.defaultValue)
      this.editIndex = this.$utils.isNotEmpty(index) ? index : -1
      this.title = this.$utils.isNotEmpty(index) ? '编辑流程变量' : '添加流程变量'
      this.dialogFormVisible = true
    },
    // 删除变量
    removeVariable(index) {
      this.variables.splice(index, 1)
    },
    // 清空变量
    cleanVariable() {
      this.$confirm('是否清空流程变量?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.variables.splice(0, this.variables.length)
      })
    },
    /**
     * 处理数据
     */
    handleData(data) {
      if (this.editIndex > -1) {
        this.variables.splice(this.editIndex, 1, data)
      } else {
        this.variables.push(data)
      }
    }
  }
}
</script>
