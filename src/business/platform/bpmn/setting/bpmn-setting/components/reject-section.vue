<template>
  <el-dialog
    :title="`【${nodeName}】驳回指定范围`"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    class="select-reject-dialog"
    append-to-body
    @close="closeDialog"
  >
    <template>
      <el-checkbox v-model="checkAll" class="check-all" :indeterminate="isIndeterminate" @change="handleCheckAllChange">全选</el-checkbox>
      <el-checkbox-group v-model="checkedNodes" @change="handleCheckedNodesChange">
        <el-checkbox
          v-for="item in nodeList"
          :key="item.value"
          :label="item.value"
        >{{ item.label }}</el-checkbox>
      </el-checkbox-group>
    </template>
    <div slot="footer" class="el-dialog--center">
      <ibps-toolbar
        :actions="toolbars"
        @action-event="handleActionEvent"
      />
    </div>
  </el-dialog>
</template>
<script>
import { mapState } from 'vuex'

export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    data: String,
    nodeName: String
  },
  data() {
    return {
      checkAll: false,
      isIndeterminate: false,
      checkedNodes: [],
      dialogVisible: this.visible,
      toolbars: [
        { key: 'confirm' },
        { key: 'cancel' }
      ]
    }
  },
  computed: {
    ...mapState({
      nodeList: state => state.ibps.bpmn.userNodeList
    })
  },
  watch: {
    visible: {
      handler: function(val, oldVal) {
        this.dialogVisible = this.visible
      },
      immediate: true
    },
    data: {
      handler: function(val, oldVal) {
        if (this.$utils.isNotEmpty(val)) {
          this.checkedNodes = val.split(',')
          const checkedCount = this.checkedNodes.length
          this.checkAll = checkedCount === this.nodeList.length
          this.isIndeterminate = checkedCount > 0 && checkedCount < this.nodeList.length
        } else {
          this.checkedNodes = []
          this.checkAll = false
          this.isIndeterminate = false
        }
      },
      immediate: true
    }
  },
  methods: {
    getCheckedNodes() {
      const nodes = []
      this.nodeList.forEach(node => {
        nodes.push(node.value)
      })
      return nodes
    },
    handleCheckAllChange(val) {
      this.checkedNodes = val ? this.getCheckedNodes() : []
      this.isIndeterminate = false
    },
    handleCheckedNodesChange(value) {
      const checkedCount = value.length
      this.checkAll = checkedCount === this.nodeList.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.nodeList.length
    },
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
      this.$emit('callback', this.checkedNodes.join(','))
      this.closeDialog()
    },
    // 关闭当前窗口
    closeDialog() {
      this.$emit('close', false)
    }
  }

}
</script>
<style lang='scss' >
.select-reject-dialog{
  .el-checkbox-group{
    display: flex;
    flex-direction: column;
  }
  .check-all{
    background-color: #f5f5f6;
  }
      .el-checkbox{
        width: 100%;
     line-height: 1.42857;
    padding: 8px;
      margin-right: 0;
     border: 1px solid #e7eaec;
     border-bottom: none;
     &:last-child{
        border-bottom:1px solid #e7eaec;
     }
    }
  .el-select{
    width: 100%;
  }
.el-dialog__header{
  height: 30px;
  line-height: 30px;
  padding: 10px;
}
.el-dialog__body{
  padding: 10px 50px 10px 10px!important;
}
.el-dialog__footer{
  border: none
}
}
</style>
