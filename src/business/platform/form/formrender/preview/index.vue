<template>
  <el-dialog
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    class="form-renderer-dialog"
    fullscreen
    append-to-body
    @open="getFormData"
    @close="closeDialog"
  >
    <formrender
      v-if="dialogVisible && formDef"
      ref="formrender"
      :form-def="formDef"
      :buttons="buttons"
      @close="closeDialog"
      @action-event="(actionKey,args)=>emitEventHandler(actionKey,args)"
    />
    <!--预览的数据-->
    <el-dialog
      :visible.sync="formPreviewDialogVisible"
      title="表单的数据"
      width="30%"
      append-to-body
    >
      <template v-if="$utils.isNotEmpty(formOpinionData)"> 表单数据：</template>
      <ibps-highlight>{{ formData }}</ibps-highlight>
      <template v-if="$utils.isNotEmpty(formOpinionData)">
        审批意见数据：
        <ibps-highlight>{{ formOpinionData }}</ibps-highlight>
      </template>
      <div slot="footer" class="el-dialog--center">
        <ibps-toolbar
          :actions="actions"
          @action-event="handleActionEvent"
        />
      </div>
    </el-dialog>
  </el-dialog>
</template>
<script>
import { getFormDataByFormDefId } from '@/api/platform/form/formDef'
import Formrender from '../index'
import FormButton from './formButton'

export default {
  components: {
    Formrender
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    id: {// 表单定义id
      type: String
    },
    data: {// 表单定义
      type: Object
    }
  },
  data() {
    return {
      dialogVisible: this.visible,
      formPreviewDialogVisible: false,
      dialogLoading: false,
      formDef: null,
      buttons: null,
      toolbars: [
        {
          key: 'close',
          label: '关闭'
        }, {
          key: 'preview',
          label: '预览数据',
          icon: 'el-icon-view'
        }
      ],
      formData: {},
      formOpinionData: {},
      actions: [
        { key: 'save', label: '确定' }
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
        case 'save':
          this.formPreviewDialogVisible = false
          break
        default:
          break
      }
    },
    emitEventHandler(actionKey) {
      switch (actionKey) {
        case 'close':
          this.closeDialog()
          break
        case 'preview':
          this.$refs.formrender.validate(valid => {
            if (valid) {
              // 表单提交校验
              const formSubmitVerify = this.$refs.formrender.getFormSubmitVerify()
              if (this.$utils.isNotEmpty(formSubmitVerify)) {
                this.$message.closeAll()
                return this.$message.warning(formSubmitVerify.message)
              }
              this.formPreviewDialogVisible = true
              this.formData = this.$refs.formrender.getFormData()
              this.formOpinionData = this.$refs.formrender.getFormOpinionData()
            } else {
              this.$refs.formrender.formErrorToast()
            }
          })

          break
      }
    },
    // 关闭当前窗口
    closeDialog() {
      this.formDef = null
      this.buttons = null
      this.$emit('close', false)
    },
    getFormData() {
      this.$nextTick(() => {
        this.buttons = this.getButtons(this.toolbars, {})
      })
      if (this.$utils.isEmpty(this.formId) && this.$utils.isNotEmpty(this.data)) {
        this.formDef = JSON.parse(JSON.stringify(this.data))
        return
      }
      this.dialogLoading = true
      getFormDataByFormDefId({
        formDefId: this.formId
      }).then(response => {
        // 从后台获取数据
        this.formDef = this.$utils.parseData(response.data)

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
    }
  }
}
</script>
<style lang="scss" >
  .form-renderer-dialog{
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

