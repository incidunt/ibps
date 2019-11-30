<template>
  <el-dialog
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    class="bpmn-formrenderer-dialog"
    fullscreen
    destroy-on-close
    append-to-body
    @open="loadFormData"
    @close="closeDialog"
  >
    <bpmn-formrender
      ref="bpmnFormrender"
      :def-id="defId"
      :pro-inst-id="proInstId"
      :task-id="taskId"
      :instance-id="instanceId"
      :task-change-id="taskChangeId"
      @close="closeDialog"
      @callback="handleCallback"
    />
  </el-dialog>
</template>
<script>
import BpmnFormrender from './index'
export default {
  components: {
    BpmnFormrender
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    defId: {// 流程定义ID
      type: String
    },
    proInstId: {// 草稿流程实例ID
      type: String
    },
    instanceId: {// 流程实例ID
      type: String
    },
    taskId: {// 流程任务ID
      type: String
    },
    taskChangeId: {// 转办代理任务ID
      type: String
    }
  },
  data() {
    return {
      dialogVisible: this.visible
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
    loadFormData() {
      this.$nextTick(() => {
        this.$refs.bpmnFormrender.loadFormData()
      })
    },
    handleCallback(data) {
      this.$emit('callback', data)
    },
    // 关闭当前窗口
    closeDialog() {
      this.$emit('close', false)
    }
  }
}
</script>
<style lang="scss">
  .bpmn-formrenderer-dialog{
    .el-dialog__header{
      padding: 0;
      border-bottom:0;
    }
    .el-dialog__body {
      padding: 0;
    }
     .el-dialog__headerbtn{
      z-index: 99999;
    }
  }
</style>
