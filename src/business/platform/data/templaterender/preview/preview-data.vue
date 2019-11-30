<template>
  <!--预览的数据-->
  <el-dialog
    class="data-template-render-preview-data-dialog"
    :visible.sync="dialogVisible"
    title="返回的数据结果"
    width="30%"
    append-to-body
    @close="closeDialog"
  >
    <el-alert type="warning"> 实际是会返回数据到表单并关闭该对话窗口：</el-alert>
    <ibps-highlight>{{ data }}</ibps-highlight>

    <div slot="footer" class="el-dialog--center">
      <ibps-toolbar
        :actions="actions"
        @action-event="closeDialog"
      />
    </div>
  </el-dialog>
</template>
<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    data: {
      type: [Object, Array]
    }
  },
  data() {
    return {
      dialogVisible: this.visible,
      actions: [
        { key: 'save', label: '确定' }
      ]
    }
  },
  watch: {
    visible: {
      handler: function(val, oldVal) {
        this.dialogVisible = val
      },
      immediate: true
    }
  },
  methods: {
    closeDialog() {
      this.$emit('close', false)
    }
  }
}
</script>
<style lang="scss">
  .data-template-render-preview-data-dialog{
    .el-dialog__body {
      height:  calc(70vh - 110px) !important;
    }
  }
</style>
