<template>
  <div>
    <div class="buttons ibps-pb-5 ibps-tr">
      <el-button type="success" size="mini" plain @click="handleAddUser">添加人员</el-button>
      <el-button type="danger" size="mini" plain @click="cleanUser">清空人员</el-button>
    </div>
    <el-table :data="users" border style="width: 100%">
      <el-table-column
        type="index"
        width="50"
        label="序号"
      />
      <el-table-column prop="description" label="条件" />
      <el-table-column align="center" prop="groupNo" width="80" label="批次">
        <template slot-scope="scope">
          <el-input
            v-model="scope.row.groupNo"
            type="number"
            placeholder="批次"
          />
        </template>
      </el-table-column>
      <el-table-column align="center" label="管理" width="100">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="editUser(scope.$index)">编辑</el-button>
          <el-button type="text" size="small" @click="removeUser(scope.$index)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <user-condition-setting
      :title="title"
      :data.sync="editData"
      :visible="dialogFormVisible"
      @callback="handleUserData"
      @close="visible => dialogFormVisible = false"
    />
  </div>
</template>
<script>
import _defaultsDeep from 'lodash.defaultsdeep'
import UserConditionSetting from './user-condition-setting'
export default {
  components: {
    UserConditionSetting
  },
  props: {
    data: Array,
    title: String
  },
  data() {
    return {
      dialogFormVisible: false,
      defaultValue: {},
      editIndex: -1,
      editData: {},
      editTitle: ''
    }
  },
  computed: {
    users() {
      return this.data
    }
  },
  methods: {
    handleAddUser() {
      this.editData = {}
      this.editIndex = -1
      this.dialogFormVisible = true
    },
    // 新增编辑人员设置
    editUser(index) {
      const data = this.$utils.isNotEmpty(index) ? this.users[index] : {}
      this.editData = _defaultsDeep(JSON.parse(JSON.stringify(data)), this.defaultValue)
      this.editIndex = this.$utils.isNotEmpty(index) ? index : -1
      this.dialogFormVisible = true
    },
    // 删除单行人员设置
    removeUser(index) {
      this.users.splice(index, 1)
    },
    // 清空人员设置
    cleanUser() {
      this.$confirm('是否清空人员设置?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.users.splice(0, this.users.length)
      })
    },
    /**
     * 处理数据
     */
    handleUserData(data) {
      if (this.editIndex > -1) {
        this.users.splice(this.editIndex, 1, data)
      } else {
        this.users.push(data)
      }
    }
  }
}
</script>
