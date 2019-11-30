<template>
  <el-dialog
    :visible.sync="visible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    title="会签特权设置"
    class="sign-privileges-setting"
    width="95%"
    top="5vh"
    append-to-body
    @close="closeDialog"
    @open="getFormData"
  >
    <el-table :data="privilegeData" border style="width: 100%">
      <el-table-column prop="privilegeLabel" label="权限类型" width="180" />
      <el-table-column prop="users" label="人员配置">
        <template slot-scope="scope">
          <user-rules
            :data="scope.row.users"
            title="人员规则设置"
          />
        </template>
      </el-table-column>
    </el-table>
    <div slot="footer" class="el-dialog--center">
      <ibps-toolbar
        :actions="toolbars"
        @action-event="handleActionEvent"
      />
    </div>
  </el-dialog>
</template>

<script>
import UserRules from './user-rules'
const privilegeTypes = [{
  value: 'all',
  label: '所有特权'
}, {
  value: 'direct',
  label: '直接处理'
}, {
  value: 'oneticket',
  label: '一票制'
},
{
  value: 'allowAddSign',
  label: '允许补签'
}]
const privilegeData = []
privilegeTypes.forEach((item) => {
  privilegeData.push({
    privilegeLabel: item.label,
    privilegeType: item.value,
    users: []
  })
})
const privilegeTypeMap = {}
privilegeTypes.forEach(item => {
  privilegeTypeMap[item.value] = item.label
})

export default {
  components: {
    UserRules
  },
  props: {
    data: Object,
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      dialogFormVisible: false,
      privilegeTypes: privilegeTypes,
      privilegeData: privilegeData,
      msgTypes: [],
      editId: '',
      title: '节点人员条件',
      toolbars: [
        { key: 'confirm' },
        { key: 'cancel' }
      ]
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
          this.handleSave()
          break
        case 'cancel':
          this.closeDialog()
          break
        default:
          break
      }
    },
    // 保存数据
    handleSave() {
      const data = {}
      this.privilegeData.forEach(item => {
        data[item.privilegeType] = item.users
      })
      this.$emit('callback', data)
      this.closeDialog()
    },
    // 关闭当前窗口
    closeDialog() {
      this.$emit('close', false)
    },
    getFormData() {
      if (this.$utils.isNotEmpty(this.data)) {
        const tableData = []
        for (const key in this.data) {
          tableData.push({
            privilegeLabel: privilegeTypeMap[key],
            privilegeType: key,
            users: this.data[key]
          })
        }
        this.privilegeData = JSON.parse(JSON.stringify(tableData))
      }
    }
  }

}
</script>
<style lang='scss' >
.sign-privileges-setting{
  .el-dialog__header{
    height: 30px;
    line-height: 30px;
    padding: 10px;
  }
  .el-dialog__body{
    padding: 10px !important;
    height: 450px;
    overflow-y: auto
  }
  .el-dialog__footer{
    border: none
  }
  .msg-checkbox .el-checkbox{
    display: block;
  }
}
</style>
