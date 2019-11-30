<template>
  <el-dialog
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    class="approval-history-sign-dialog"
    append-to-body
    :title="'【'+title+'】会签任务审批历史'"
    top="5vh"
    width="70%"
    @open="getFormData"
    @close="closeDialog"
  >
    <approval-history
      v-if="dialogVisible"
      ref="approvalHistory"
      :batch="batch"
    />
  </el-dialog>
</template>
<script>
import ApprovalHistory from './sign-history'
export default {
  components: {
    ApprovalHistory
  },
  props: {
    visible: Boolean,
    batch: String,
    title: String
  },
  data() {
    return {
      dialogVisible: false,
      active: -1,
      opinions: []
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
    getFormData() {
      this.$nextTick(() => {
        this.$refs.approvalHistory.getSignFormData()
      })
    },
    closeDialog() {
      this.$emit('close', false)
    }
  }
}
</script>
<style lang="scss">
  .approval-history-sign-dialog{
    .el-dialog__body{
      height:  calc(80vh - 110px) !important;
    }
    .el-card__body{
      padding-top:5px;
    }
  }

</style>

