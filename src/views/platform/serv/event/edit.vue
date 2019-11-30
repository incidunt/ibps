<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    class="dialog postposition-event-edit-dialog"
    :class="!readonly?'postposition-event-edit-dialog':'postposition-event-edit-readonly-dialog'"
    @open="getFormData"
    @close="closeDialog"
  >
    <el-form
      ref="eventForm"
      v-loading="dialogLoading"
      :element-loading-text="$t('common.loading')"
      :model="postpositionEvent"
      :rules="rules"
      :label-width="formLabelWidth"
    >
      <el-form-item label="源服务:" prop="sourceServiceName">
        <span>{{ postpositionEvent.sourceServiceName }}</span>
      </el-form-item>
      <el-form-item label="服务:" prop="serviceName">
        <span>{{ postpositionEvent.serviceName }}</span>
      </el-form-item>
      <el-form-item label="忽略异常:" prop="ingoreException">
        <el-switch
          v-if="!readonly"
          v-model="postpositionEvent.ingoreException"
          active-value="Y"
          inactive-value="N"
        />
        <el-tag v-else :type="postpositionEvent.ingoreException|optionsFilter(defaultOptions)">
          {{ postpositionEvent.ingoreException|optionsFilter(defaultOptions,'label') }}
        </el-tag>
      </el-form-item>
      <el-form-item label="是否执行后置:" prop="isExecuteNext">
        <el-switch
          v-if="!readonly"
          v-model="postpositionEvent.isExecuteNext"
          active-value="Y"
          inactive-value="N"
        />
        <el-tag v-else :type="postpositionEvent.isExecuteNext|optionsFilter(defaultOptions)">
          {{ postpositionEvent.isExecuteNext|optionsFilter(defaultOptions,'label') }}
        </el-tag>
      </el-form-item>
      <el-form-item label="排序:" prop="sn">
        <el-input v-if="!readonly" v-model="postpositionEvent.sn" />
        <span v-else>{{ postpositionEvent.sn }}</span>
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
import { save, get } from '@/api/platform/serv/postpositionEvent'
import { defaultOptions } from '../constants'
import ActionUtils from '@/utils/action'
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
      formName: 'eventForm',
      formLabelWidth: '120px',
      dialogVisible: this.visible,
      dialogLoading: false,
      defaultOptions: defaultOptions,
      defaultForm: {},
      postpositionEvent: {
        sourceServiceId: '',
        sourceServiceName: '',
        serviceId: '',
        serviceName: '',
        ingoreException: 'Y',
        isExecuteNext: 'N',
        sn: ''
      },
      rules: {
        sn: [
          { required: true, message: this.$t('validate.required') }]
      },
      toolbars: [
        { key: 'save', hidden: () => { return this.readonly } },
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
    this.defaultForm = JSON.parse(JSON.stringify(this.postpositionEvent))
  },
  methods: {
    handleActionEvent({ key }) {
      switch (key) {
        case 'save':
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
      this.$refs[this.formName].validate(valid => {
        if (valid) {
          this.saveData()
        } else {
          ActionUtils.saveErrorMessage()
        }
      })
    },
    // 提交保存数据
    saveData() {
      save(this.postpositionEvent).then(response => {
        this.$emit('callback', this)
        ActionUtils.saveSuccessMessage(response.message, (rtn) => {
          if (this.$utils.isEmpty(this.formId)) {
            this.$refs[this.formName].resetFields()
          }
          if (rtn) {
            this.closeDialog()
          }
        })
      }).catch((err) => {
        console.info(err)
      })
    },
    // 关闭当前窗口
    closeDialog() {
      this.$emit('close', false)
      this.$refs[this.formName].resetFields()
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
        this.postpositionEvent = JSON.parse(JSON.stringify(this.defaultForm))
        this.formValidate()
        return
      }
      this.dialogLoading = true
      get({
        postpositionEventId: this.formId
      }).then(response => {
        this.postpositionEvent = response.data
        this.formValidate()
        this.dialogLoading = false
      }).catch(() => {
        this.dialogLoading = false
      })
    }
  }

}
</script>
<style lang="scss" scoped>
.postposition-event-edit-dialog{
  .el-dialog__body{
    height:  calc(37vh - 100px) !important;
  }
}
.postposition-event-edit-readonly-dialog{
  .el-dialog__body{
    height:  calc(47vh - 100px) !important;
  }
}
</style>
