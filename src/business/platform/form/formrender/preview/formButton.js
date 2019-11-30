import _ from 'lodash'
// import Utils from '@/utils/util'
import FormrenderResponseButton from '@/business/platform/form/formrender/button'
import JForm from '@/business/platform/form/utils/JForm'// 自定义脚本\
var FormButton
window.FormButton = FormButton = function(options) {
  this.response_buttons = []
  this.initButtons(options)
}

FormButton.prototype = {
  initButtons: function(options) {
    const buttons = options.buttons
    const params = options.params
    for (let i = 0; i < buttons.length; i++) {
      const rf = buttons[i]
      rf.alias = rf[FormButton.key.BUTTON_TYPE]
      rf.label = rf[FormButton.key.LABEL]

      const button = new FormButton.Models['ResponseButton' + (_.upperFirst(rf.alias))](rf, params)

      // 初始化按钮事件
      this.response_buttons.push(button)
    }
  }
}

FormButton.Models = {}
FormButton.BUTTON_TYPES = ['close', 'save', 'custom']
FormButton.key = {
  BUTTON_TYPE: 'key',
  LABEL: 'label'
}

FormButton.VERSION = '2.0.0'

// 表单按钮

FormButton.Models.ResponseButton = FormrenderResponseButton.extend({
  style: 'primary',
  plain: true,
  aliasKey: FormButton.key.BUTTON_TYPE,
  getTitle: function() {
    return this.get('title') || ''
  },
  // 版本号
  getVersion: function() {
    return this.get('version')
  },
  getFormKey: function() {
    return this.get('formKey')
  },
  afterScript(btn, formData, hasScript) {
    if (!hasScript) return
    const afterSubmitResult = JForm._afterSubmit(this, btn.getAlias(), formData)
    if (typeof (afterSubmitResult) !== 'undefined' && !afterSubmitResult) {
      return
    }
  }
})

// 关闭
FormButton.Models.ResponseButtonClose = FormButton.Models.ResponseButton.extend({
  icon: 'ibps-icon-close',
  style: 'default',
  action(btn) {
    this.handleActionEvent(btn.getAlias())
  }
})
// 预览
FormButton.Models.ResponseButtonPreview = FormButton.Models.ResponseButton.extend({
  icon: 'el-icon-view',
  action(btn) {
    this.handleActionEvent(btn.getAlias(), { formData: this.getFormData() })
  }
})

// 自定义
FormButton.Models.ResponseButtonCustom = FormButton.Models.ResponseButton.extend({
  icon: 'ibps-icon-lock',
  action(btn) {

  }
})

export default FormButton
