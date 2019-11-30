<template>
  <el-dialog
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    class="data-template-form-renderer-dialog"
    fullscreen
    destroy-on-close
    append-to-body
    @open="loadFormData"
    @close="closeDialog"
  >
    <div
      v-loading.fullscreen.lock="dialogLoading"
      :element-loading-text="$t('common.loading')"
    >
      <ibps-data-template-formrender
        v-if="dialogVisible && formDef"
        ref="formrender"
        :form-def="formDef"
        :buttons="buttons"
        :data="formData"
        :params="formParams"
        :readonly="readonly"
        @action-event="(actionKey,args)=>emitEventHandler(actionKey,args)"
        @callback="callback"
        @close="closeDialog"
      />
    </div>
  </el-dialog>
</template>
<script>
import { getFormData } from '@/api/platform/form/formDef'
import FormButton from './button'
import ActionMixin from './action'

export default {
  mixins: [ActionMixin],
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    formKey: {
      type: String
    },
    pkValue: {
      type: [String, Number]
    },
    rightsScope: {
      type: String,
      default: 'data'
    },
    toolbars: {
      type: Array
    },
    readonly: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      dialogVisible: this.visible,
      dialogLoading: false,
      formDef: null,
      formData: {},
      formParams: {}, // 扩展参数
      buttons: [],
      boCode: '',
      version: 0
    }
  },
  computed: {
    formId() {
      return this.pkValue
    }
  },
  watch: {
    visible: {
      handler: function(val, oldVal) {
        this.dialogVisible = this.visible
      },
      immediate: true
    },
    toolbars: {
      handler: function(val, oldVal) {
        this.buttons = this.getButtons(this.toolbars, {})
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    loadFormData() {
      this.dialogLoading = true
      getFormData({
        formKey: this.formKey,
        pk: this.formId,
        rightsScope: this.rightsScope
      }).then(response => {
        const data = response.data
        this.formData = {
        // 表单数据
          responses: this.$utils.parseData(data.boData) || {},
          // 表单权限
          permissions: this.$utils.parseData(data.permissions) || {}
        }
        // 从后台获取数据
        this.formDef = this.$utils.parseData(data.form) || {}
        this.boCode = this.formDef.code
        // 版本号
        this.version = data.version

        this.dialogLoading = false
      }).catch(() => {
        this.dialogLoading = false
      })
    },
    getButtons(buttons, params) {
      if (this.$utils.isEmpty(buttons)) { return null }
      const btn = new FormButton({
        buttons: buttons,
        params: params
      })
      return btn.response_buttons
    },
    getFormData() {
      return this.$refs.formrender.getFormData()
    },
    // 后置事件
    afterScript(key) {
      return this.$refs.formrender.afterScript(key)
    },
    callback() {
      this.closeDialog()
      this.$emit('callback', true)
    },
    // 关闭当前窗口
    closeDialog() {
      this.formDef = null
      this.$emit('close', false)
    },
    // 验证表单
    validate(callback) {
      if (!this.$refs.formrender.validate) {
        callback(true)
        return
      }
      this.$refs.formrender.validate((valid, invalidFields) => {
        callback(valid, invalidFields)
      })
    },
    getFormSubmitVerify() {
      return this.$refs.formrender.getFormSubmitVerify()
    },
    formErrorToast() {
      return this.$refs.formrender.formErrorToast()
    }
  }
}
</script>
<style lang="scss" >
  .data-template-form-renderer-dialog{
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
    @media print {
      .el-dialog__headerbtn {
        display: none !important
      }
      .hidden-print{
        padding: 0;
        margin:  0;
      }
    }
  }
</style>

