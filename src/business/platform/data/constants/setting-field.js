const SettingField = {
  DEFAULT_FIELD_TYPE: {
    'varchar': ['hidden', 'text', 'radio', 'checkbox', 'select', 'datePicker', 'dictionary', 'selector', 'attachment', 'customDialog', 'linkdata', 'address'],
    'date': ['datePicker', 'text', 'hidden'],
    'number': ['number', 'text'],
    'clob': ['text', 'textarea', 'editor', 'hidden', 'linkdata', 'signature']
  },
  FIELD_TYPE: [{
    value: 'hidden',
    label: '隐藏域'
  },
  {
    value: 'text',
    label: '文本框'
  },
  {
    value: 'textarea',
    label: '多行文本框'
  },
  {
    value: 'editor',
    label: '富文本框'
  },
  {
    value: 'number',
    label: '数字'
  },
  {
    value: 'radio',
    label: '单项选择'
  },
  {
    value: 'checkbox',
    label: '多项选择'
  },
  // =====
  {
    value: 'select',
    label: '下拉框'
  },
  {
    value: 'datePicker',
    label: '日期控件'
  },
  {
    value: 'dictionary',
    label: '数据字典'
  },
  {
    value: 'selector',
    label: '选择器'
  },
  {
    value: 'attachment',
    label: '附件'
  },
  {
    value: 'customDialog',
    label: '自定义对话框'
  },
  {
    value: 'linkdata',
    label: '关联数据'
  },
  {
    value: 'address',
    label: '地址'
  },
  {
    value: 'signature',
    label: '签名'
  }]
}

export default SettingField

