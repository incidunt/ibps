<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    class="dialog"
    top="0"
    @open="getFormData"
    @close="closeDialog"
  >
    <el-form
      ref="operLogForm"
      v-loading="dialogLoading"
      :element-loading-text="$t('common.loading')"
      :model="operLog"
      :rules="rules"
      :label-width="formLabelWidth"
    >
      <el-form-item label="事项标题">
        <span>{{ operLog.procInstSubject }}</span>
      </el-form-item>
      <el-form-item label="流程定义key">
        <span>{{ operLog.procDefKey }}</span>
      </el-form-item>
      <el-form-item label="任务节点">
        <span>{{ operLog.nodeId }}</span>
      </el-form-item>
      <el-form-item label="操作类型">
        <span>{{ operLog.operTypeName }}</span>
      </el-form-item>
      <el-form-item label="是否干预">
        <span>{{ operLog.interpose === 'Y' ? '是' : '否' }}</span>
      </el-form-item>
      <el-form-item label="操作人">
        <span>{{ operLog.creator }}</span>
      </el-form-item>
      <el-form-item label="操作时间">
        <span>{{ operLog.createTime }}</span>
      </el-form-item>
      <el-form-item label="操作意见">
        <span>{{ operLog.option }}</span>
      </el-form-item>
      <el-form-item label="操作内容">
        <span>{{ operLog.content }}</span>
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
import { get } from '@/api/platform/bpmn/bpmOperLog'

export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    readonly: {
      type: Boolean,
      default: false
    },
    id: String,
    title: String
  },
  data() {
    return {
      formName: 'levelForm',
      formLabelWidth: '120px',
      dialogVisible: this.visible,
      dialogLoading: false,
      defaultForm: {},
      operLog: {
        procInstSubject: '',
        procDefKey: '',
        nodeId: '',
        operTypeName: '',
        interpose: '',
        creator: '',
        createTime: '',
        option: '',
        content: ''
      },
      rules: { },
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
  created() {
    this.defaultForm = JSON.parse(JSON.stringify(this.operLog))
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
    // 保存数据
    handleSave() {
      //
    },
    // 关闭当前窗口
    closeDialog() {
      this.$emit('close', false)
    },
    /**
     * 表单验证
     */
    formValidate() {
      if (this.readonly) return
      this.$nextTick(() => {
        this.$refs[this.formName].validate(() => {})
      })
    },
    /**
     * 获取表单数据
     */
    getFormData() {
      if (this.$utils.isEmpty(this.formId)) {
        // 重置表单
        this.operLog = JSON.parse(JSON.stringify(this.defaultForm))
        this.formValidate()
        return
      }
      this.dialogLoading = true
      get({
        id: this.formId
      }).then(response => {
        this.operLog = response.data
        this.formValidate()
        this.dialogLoading = false
      }).catch(() => {
        this.dialogLoading = false
      })
    }
  }

}
</script>
