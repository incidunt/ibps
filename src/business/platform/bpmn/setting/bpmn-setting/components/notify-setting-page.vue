<template>
  <el-dialog
    title="办结抄送设置"
    :visible.sync="visible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    class="notify-setting-page"
    width="95%"
    top="5vh"
    append-to-body
    @close="closeDialog"
  >
    <div class="buttons ibps-pb-5">
      <el-button type="success" class="el-icon-plus" plain @click="handleAddNotify()">添加</el-button>
    </div>
    <el-table :data="notifyData" border style="width: 100%">
      <el-table-column prop="msgTypes" label="通知类型" width="180">
        <template slot-scope="scope">
          <ibps-checkbox
            v-model="scope.row.msgTypes"
            :options="messageTypes"
            value-key="type"
            label-key="title"
            class="msg-checkbox"
          />
        </template>
      </el-table-column>
      <el-table-column prop="nodes" label="人员配置">
        <template slot-scope="scope">
          <div class="buttons ibps-pb-5">
            <el-button type="success" class="el-icon-plus" plain @click.native="handleAddUsers(scope.$index)">添加人员设置</el-button>
          </div>
          <!--用户设置-->
          <el-table :data="scope.row.userAssignRules" border style="width: 100%;">
            <el-table-column
              type="index"
              width="50"
              label="序号"
            />
            <el-table-column prop="description" label="条件" />
            <el-table-column align="center" prop="groupNo" width="80" label="批次">
              <template slot-scope="userScope">
                <el-input
                  v-model="userScope.row.groupNo"
                  type="number"
                  placeholder="批次"
                />
              </template>
            </el-table-column>
            <el-table-column align="center" label="管理" width="100">
              <template slot-scope="userScope">
                <el-button type="text" size="small" @click="editUser(scope.$index,userScope.$index)">编辑</el-button>
                <el-button type="text" size="small" @click="removeUser(scope.$index,userScope.$index)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <!--用户设置end-->
        </template>
      </el-table-column>
      <el-table-column label="管理" width="120">
        <template slot-scope="scope">
          <el-button type="danger" size="small" @click="handleRemoveNotify(scope.$index)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div slot="footer" class="el-dialog--center">
      <ibps-toolbar
        :actions="toolbars"
        @action-event="handleActionEvent"
      />
    </div>
    <user-condition-setting
      :title="title"
      :data="editData"
      :visible="dialogFormVisible"
      @callback="handleUserData"
      @close="visible => dialogFormVisible = false"
    />
  </el-dialog>
</template>

<script>
import { mapState } from 'vuex'
import _defaultsDeep from 'lodash.defaultsdeep'
import UserConditionSetting from './user-condition-setting'
export default {
  components: {
    UserConditionSetting
  },
  props: {
    data: Array,
    nodeId: { // 当前节点
      type: String,
      default: ''
    },
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      msgTypes: [],
      dialogFormVisible: false,
      defaultValue: {},
      editRowIndex: -1,
      editIndex: -1,
      editData: {},
      title: '节点人员条件',
      toolbars: [
        { key: 'confirm' },
        { key: 'cancel' }
      ]
    }
  },
  computed: {
    ...mapState({
      messageTypes: state => state.ibps.bpmn.messageTypes
    }),
    notifyData() {
      return this.data ? this.data : []
    }
  },
  watch: {
    visible: {
      handler: function(val, oldVal) {
        this.dialogVisible = this.visible
      }
    }
  },
  methods: {
    handleActionEvent({ key }) {
      switch (key) {
        case 'confirm':
          this.handleConfirm()
          break
        case 'cancel':
          this.closeDialog()
          break
        default:
          break
      }
    },
    // 确定
    handleConfirm() {
      this.$emit('callback', this.notifyData)
      this.closeDialog()
    },
    // 关闭当前窗口
    closeDialog() {
      this.$emit('close', false)
    },
    handleAddNotify() {
      const obj = {
        msgTypes: '',
        userAssignRules: []
      }
      this.notifyData.push(obj)
    },
    handleRemoveNotify(index) {
      this.notifyData.splice(index, 1)
    },
    handleAddUsers(index) {
      this.editRowIndex = index
      this.dialogFormVisible = true
    },
    // 新增编辑人员设置
    editUser(rowIndex, index) {
      const data = this.$utils.isNotEmpty(index) ? this.notifyData[rowIndex].userAssignRules[index] : {}
      this.editData = _defaultsDeep(JSON.parse(JSON.stringify(data)), this.defaultValue)
      this.editIndex = this.$utils.isNotEmpty(index) ? index : -1
      this.title = this.$utils.isNotEmpty(index) ? '节点人员设置' : '节点人员设置'
      this.dialogFormVisible = true
    },
    // 删除单行人员设置
    removeUser(rowIndex, index) {
      this.notifyData[rowIndex].userAssignRules.splice(index, 1)
    },
    // 清空人员设置
    cleanUser() {
      this.$confirm('是否清空人员设置?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.userAssignRules.splice(0, this.userAssignRules.length)
      })
    },
    /**
     * 处理数据
     */
    handleUserData(data) {
      if (this.editIndex > -1) {
        this.notifyData[this.editRowIndex].userAssignRules.splice(this.editIndex, 1, data)
      } else {
        this.notifyData[this.editRowIndex].userAssignRules.push(data)
      }
    }
  }
}
</script>
<style lang='scss' >
.notify-setting-page{
  .el-dialog__header{
    height: 30px;
    line-height: 30px;
    padding: 10px;
  }
  .el-dialog__body{
    padding: 10px !important;
    height: 450px;
  }
  .msg-checkbox .el-checkbox{
    display: block;
  }
}
</style>
