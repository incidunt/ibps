<template>
  <!--描述-->
  <ibps-desc
    v-if="field.field_type==='desc'"
    :item="field"
  />
  <!--分隔符-->
  <el-divider
    v-else-if="field.field_type==='divider'"
    :content-position="field.field_options.content_position"
  >{{ field.label }}</el-divider>
  <!--流程图-->
  <div v-else-if="field.field_type==='flow_diagram' && showFlowDiagram">
    <div class="ibps-page-header-title">
      流程图
    </div>
    <flow-diagram
      ref="flowDiagram"
      :def-id="defId"
      :task-id="taskId"
      :inst-id="instanceId"
    />
  </div>
  <!--审批历史-->
  <div v-else-if="field.field_type==='approval_history' && showApprovalHistory">
    <div class="ibps-page-header-title">
      审批历史
    </div>
    <approval-history
      ref="approvalHistory"
      :task-id="taskId"
      :inst-id="instanceId"
    />
  </div>
</template>
<script>
import IbpsDesc from './components/desc'
import FlowDiagram from '@/business/platform/bpmn/components/flow-diagram'
import ApprovalHistory from '@/business/platform/bpmn/components/approval-history'

export default {
  components: {
    IbpsDesc,
    FlowDiagram,
    ApprovalHistory
  },
  props: {
    models: Object, // 所有对象数据
    field: Object, // 字段
    params: Object
  },
  computed: {
    defId() {
      return this.params ? this.params.defId : null
    },
    taskId() {
      return this.params ? this.params.taskId : null
    },
    instanceId() {
      return this.params ? this.params.instanceId : null
    },
    // 是否显示审批历史
    showApprovalHistory() {
      return !!(this.taskId || this.instanceId)
    },
    // 是否显示流程图
    showFlowDiagram() {
      return !!(this.defId || this.taskId || this.instanceId)
    }
  },
  watch: {
    params: {
      handler(val) {
        if (this.field.field_type === 'flow_diagram' && this.showFlowDiagram) {
          this.$nextTick(() => {
            this.$refs.flowDiagram.getFormData()
          })
        }
        if (this.field.field_type === 'approval_history' && this.showApprovalHistory) {
          this.$nextTick(() => {
            this.$refs.approvalHistory.getFormData()
          })
        }
      },
      immediate: true,
      deep: true
    }
  }
}
</script>

