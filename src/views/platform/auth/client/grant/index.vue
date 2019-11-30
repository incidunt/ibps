<template>
  <el-dialog
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    top="5vh"
    :title="title"
    width="80%"
    class="client-form-dialog"
    @open="loadData"
    @close="closeDialog"
  >
    <api-grant
      ref="apiGrant"
      :dialog="visible"
      :client-key="clientKey"
      :app-key="appKey"
      :grant-type="grantType"
      @close="closeDialog"
    />
  </el-dialog>
</template>

<script>
import ApiGrant from '@/views/platform/auth/apiGrant/list'
export default {
  components: {
    ApiGrant
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    title: String,
    clientKey: String,
    appKey: String,
    grantType: String
  },
  data() {
    return {
      dialogFormVisible: false,
      dialogVisible: true
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
    loadData() {
      this.$nextTick(() => {
        this.$refs['apiGrant'].search()
      })
    },
    closeDialog() {
      this.$emit('close', false)
    }
  }
}
</script>
<style lang='scss' >
.client-form-dialog{
  .el-dialog__body{
    height:  calc(80vh - 110px) !important;
  }
}
</style>
