<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    class="bpmn-guide-dialog"
    top="10vh"
    @open="getFormData"
    @close="closeDialog"
  >
    <el-form
      ref="editGuideForm"
      v-loading="dialogLoading"
      :element-loading-text="$t('common.loading')"
      :model="editGuide"
      :rules="rules"
      :label-width="formLabelWidth"
    >
      <el-form-item label="操作指南:" prop="context">
        <ibps-ueditor v-if="!readonly" v-model="editGuide.context" />
        <span v-else>{{ editGuide.context }}</span>
      </el-form-item>
      <el-form-item label="附件:" prop="attachment">
        <ibps-attachment-selector
          v-model="editGuide.attachment"
          :multiple="true"
          :readonly="readonly"
        />
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
import { save, get } from '@/api/platform/bpmn/bpmGuide'
import ActionUtils from '@/utils/action'
import IbpsAttachmentSelector from '@/business/platform/file/attachment/selector'
import IbpsUeditor from '@/components/ibps-ueditor'
// import { validateKey } from '@/utils/validate'

export default {
  components: {
    IbpsUeditor,
    IbpsAttachmentSelector
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    readonly: {
      type: Boolean,
      default: false
    },
    defId: String,
    title: String,
    parent: Object,
    isPrivate: Boolean
  },
  data() {
    return {
      formName: 'editGuideForm',
      formLabelWidth: '120px',
      dialogVisible: this.visible,
      dialogLoading: false,
      defaultForm: {},
      editGuide: {
        id: '',
        context: '',
        attachment: '',
        defId: '',
        createBy: '',
        createTime: '',
        fileList: []
      },
      rules: {
        context: [{ required: true, message: this.$t('validate.required') }]
      },
      dialogFormVisible: false,
      toolbars: [
        { key: 'save', hidden: () => { return this.readonly } },
        { key: 'cancel' }
      ]
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
    this.defaultForm = JSON.parse(JSON.stringify(this.editGuide))
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
      save(this.editGuide).then(response => {
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
      if (this.$utils.isEmpty(this.defId)) {
        // 重置表单
        this.editGuide = JSON.parse(JSON.stringify(this.defaultForm))
        this.editGuide.defId = this.defId
        this.formValidate()
        return
      }
      this.dialogLoading = true
      get({
        defId: this.defId
      }).then(response => {
        this.dialogLoading = false
        let data = response.data
        if (this.$utils.isEmpty(data)) {
          data = JSON.parse(JSON.stringify(this.defaultForm))
          data.defId = this.defId
        }
        this.editGuide = data
      }).catch(() => {
        this.dialogLoading = false
      })
    },
    uploaderAction(buttonKey, fileList) {
      console.log(fileList)

      this.editGuide.fileList = fileList
      this.dialogFormVisible = false
    }
  }

}
</script>
<style lang="scss">
  // .bpmn-guide-dialog{
  //   .el-dialog__body{
  //   height:  calc(51vh - 128px) !important;
  //  }
  // }
</style>

