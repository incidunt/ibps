
import { saveFormData } from '@/api/platform/data/dataTemplate'

export default {
  methods: {
    emitEventHandler(actionKey) {
      this.actionName = actionKey
      switch (actionKey) {
        case 'close': // 关闭窗口
          this.closeDialog()
          break
        case 'save':
          this.handleSave()
          break
        case 'print':
          this.handlePrint()
          break
        case 'custom':
        default:
          break
      }
    },
    // 保存
    handleSave() {
      // 验证表单是否正确
      this.validate(valid => {
        if (valid) {
          // 表单提交校验
          const formSubmitVerify = this.getFormSubmitVerify()
          if (this.$utils.isNotEmpty(formSubmitVerify)) {
            this.$message.closeAll()
            return this.$message.warning(formSubmitVerify.msg)
          }
          // 保存数据
          this.saveData()
        } else {
          this.formErrorToast()
        }
      })
    },
    // 保存数据
    saveData() {
      // 表单数据
      const formData = this.getFormData()
      const jsonData = {
        boCode: this.boCode,
        version: this.version,
        formKey: this.formKey,
        pk: this.pkValue,
        data: JSON.stringify(formData)
      }
      const loading = this.$loading({
        lock: true,
        text: this.$t('common.saving')
      })
      saveFormData(jsonData).then(response => {
        loading.close()
        this.$alert(`保存成功！`, {
          showClose: false
        }).then(() => {
          // 后置事件
          // this.afterScript(btn.getAlias())
          this.callback()
        }).catch(() => {
        })
      }).catch(() => {
        loading.close()
      })
    },
    /**
     * 打印
     */
    handlePrint() {
      // var printTemplateId = null
      // if($.isEmpty(printTemplateId)){
      // window.open(this.$refs.formrender.$el.innerHTML)
      window.print()
    }

  }
}
