<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    class="dialog log-detail-dialog"
    append-to-body
    top="17vh"
    @open="getFormData"
    @close="closeDialog"
  >
    <el-form
      ref="logForm"
      v-loading="dialogLoading"
      :element-loading-text="$t('common.loading')"
      :model="form"
      :label-width="formLabelWidth"
    >
      <el-form-item label="任务名::" prop="name">
        <span>{{ form.jobName }}</span>
      </el-form-item>
      <el-form-item label="触发器名称:" prop="type">
        <span>{{ form.trigName }}</span>
      </el-form-item>
      <el-form-item label="任务分组:" prop="form">
        <span>{{ form.group }}</span>
      </el-form-item>
      <el-form-item label="开始时间:" prop="form">
        <span>{{ form.startTime }}</span>
      </el-form-item>
      <el-form-item label="结束时间:" prop="form">
        <span>{{ form.endTime }}</span>
      </el-form-item>
      <el-form-item label="内容:" prop="form">
        <span>{{ form.content }}</span>
      </el-form-item>
      <el-form-item label="状态:" prop="form">
        <el-tag :type="form.state|optionsFilter(logStateOptions,'type')">
          {{ form.state|optionsFilter(logStateOptions,'label') }}
        </el-tag>
      </el-form-item>
      <el-form-item label="运行时长:" prop="form">
        <span>{{ form.runTime }}</span>
      </el-form-item>
    </el-form>
    <div slot="footer" class="el-dialog--center">
      <ibps-toolbar
        :actions="toolbars"
        @action-event="handleActionEvent"
      />
    </div>
  </el-dialog>
</template>

<script>
import { get } from '@/api/platform/job/jobLog'
import { logStateOptions } from '../constants'

export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    id: String
  },
  data() {
    return {
      title: '日志明细',
      formLabelWidth: '120px',
      dialogVisible: this.visible,
      dialogLoading: false,
      logStateOptions: logStateOptions,
      form: {},
      toolbars: [
        { key: 'cancel' }
      ]
    }
  },
  computed: {
    formId() {
      return this.id
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
    handleActionEvent({ key }) {
      switch (key) {
        case 'cancel':
          this.closeDialog()
          break
        default:
          break
      }
    },
    // 关闭当前窗口
    closeDialog() {
      this.$emit('close', false)
    },
    getFormData() {
      this.dialogLoading = true
      get({
        id: this.formId
      }).then(response => {
        this.dialogLoading = false
        this.form = response.data
        this.form.ownRights = this.$utils.isNotEmpty(this.form.ownRights) ? this.form.ownRights.split(',') : []
        this.formValidate()
      }).catch(() => {
        this.dialogLoading = false
      })
    }
  }

}
</script>
<style lang="scss">
.log-detail-dialog{
  .el-dialog__body{
    height:  calc(55vh - 120px) !important;
  }
}
</style>
