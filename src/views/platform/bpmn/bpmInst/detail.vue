<template>
  <el-dialog
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    class="instance-detail-dialog"
    append-to-body
    title="流程实例明细"
    top="5vh"
    width="80%"
    @open="getFormData"
    @close="closeDialog"
  >
    <el-form :model="instance" label-width="180px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="流程实例标题:">
            <span>{{ instance.subject | removeHtmlTag }}</span>
          </el-form-item>
          <el-form-item label="流程名称:">
            <span>{{ instance.procDefName }}</span>
          </el-form-item>
          <el-form-item label="关联数据业务主键:">
            <span>{{ instance.bizKey }}</span>
          </el-form-item>
          <el-form-item label="创建时间:">
            <span>{{ instance.createTime }}</span>
          </el-form-item>
          <el-form-item label="数据保存模式:">
            <span>{{ instance.dataMode === 'bo_db' || instance.dataMode === 'table' ? '物理表' : '实例数据' }}</span>
          </el-form-item>
          <el-form-item label="BPMN流程实例ID:">
            <span>{{ instance.bpmnInstId }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="实例状态:">
            <span>{{ instance.status | optionsFilter(instTypeOptions) }}</span>
          </el-form-item>
          <el-form-item label="流程定义Key:">
            <span>{{ instance.procDefKey }}</span>
          </el-form-item>
          <el-form-item label="绑定的表单key:">
            <span>{{ instance.formKey }}</span>
          </el-form-item>
          <el-form-item label="是否禁止:">
            <span>{{ instance.forbidden }}</span>
          </el-form-item>
          <el-form-item label="是否正式数据:">
            <span :class="instance.isFormmal === 'N' ? 'green' : 'red'">{{ instance.isFormmal === 'N' ? '测试数据' : '正式数据' }}</span>
          </el-form-item>
          <el-form-item label="父实例Id:">
            <span>{{ instance.parentInstId === '0' ? '无' : instance.parentInstId }}</span>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="el-dialog--center">
      <el-button icon="el-icon-circle-close" @click="closeDialog()">关闭</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { get } from '@/api/platform/bpmn/bpmInst'
import { instTypeOptions } from './constants'

export default {
  props: {
    visible: Boolean,
    bpmnInstId: String
  },
  data() {
    return {
      dialogVisible: false,
      instTypeOptions: instTypeOptions,
      instance: {}
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
      get({
        id: this.bpmnInstId
      }).then(response => {
        this.instance = response.data
      })
    },
    closeDialog() {
      this.$emit('close', false)
    }
  }
}
</script>

