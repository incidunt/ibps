<template>
  <!--默认-->
  <el-dialog
    :title="title"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    class="data-template-renderer-dialog"
    append-to-body
    fullscreen
    @close="closeDialog"
  >
    <ibps-data-template-render
      :data="dataTemplate"
      :dynamic-params="dynamicParams"
      multiple
      @close="closeDialog"
    />
  </el-dialog>
</template>
<script>
import TypeMixin from '../mixins/types'
import Vue from 'vue'
Vue.component('ibps-data-template-render', () => import('@/business/platform/data/templaterender/index.vue'))

export default {
  mixins: [TypeMixin],
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    title: String,
    data: {
      type: Object
    },
    dynamicParams: {
      type: Object
    }
  },
  data() {
    return {
      dialogVisible: this.visible,
      dataTemplate: {}
    }
  },
  watch: {
    visible: {
      handler: function(val, oldVal) {
        this.dialogVisible = val
        val && this.getFormData()
      },
      immediate: true
    }
  },
  methods: {
    // 关闭当前窗口
    closeDialog() {
      this.$emit('close', false)
    },
    getFormData() {
      this.initData(JSON.parse(JSON.stringify(this.data)))
    }
  }
}
</script>
<style lang="scss" >
  .data-template-renderer-dialog{
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
