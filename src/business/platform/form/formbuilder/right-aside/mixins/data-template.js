import ActionUtil from '@/utils/action'
import { buildDynamicParams } from '@/business/platform/data/templaterender/utils'
import FormOptions from '@/business/platform/form/constants/formOptions'

export default {
  data() {
    return {
      resultColumns: [],
      queryColumns: [],
      dynamicConditions: {},
      dataTemplateConfigVisible: false,
      dataTemplateConditionVisible: false,
      dataTemplateLinkDataVisible: false,
      dataTemplateLinkAttrVisible: false,
      formFields: [], // 表单现在有的可以输入字段，排除自己
      formLabelFields: [] // 表单现在有的[label]字段
    }
  },
  methods: {
    changeDataSource(data, key) {
      if (this.$utils.isEmpty(data)) {
        return
      }
      // 返回字段
      let resultColumns = []
      if (this.$utils.isNotEmpty(data.resultColumns)) {
        resultColumns = JSON.parse(data.resultColumns)

        if ((key === 'value_source' || key === 'linkdata') &&
        this.$utils.isNotEmpty(resultColumns)) {
          const linkConfig = this.fieldItem && this.fieldItem.field_options ? this.fieldItem.field_options.link_config : {}
          if (this.$utils.isEmpty(linkConfig) ||
           (this.$utils.isEmpty(linkConfig.id) && this.$utils.isEmpty(linkConfig.text))) {
            this.setDataTemplateConfig({
              id: data.unique,
              text: resultColumns[0].name
            })
          }
        }
      }
      this.resultColumns = resultColumns
      // 查询字段
      let queryColumns = []
      if (this.$utils.isNotEmpty(data.queryColumns)) {
        queryColumns = JSON.parse(data.queryColumns)
      }
      this.queryColumns = queryColumns
      // 过滤条件
      let dynamicConditions = {}
      if (this.$utils.isNotEmpty(data.filterConditions)) {
        const filterConditions = JSON.parse(data.filterConditions)
        if (this.$utils.isNotEmpty(filterConditions)) {
          dynamicConditions = buildDynamicParams(filterConditions)
        }
      }
      this.dynamicConditions = dynamicConditions
    },
    setFormFields() {
      this.formFields = []
      this.buildFormFields(this.fields)
    },
    // 表单现在有的可以输入字段，排查自己
    buildFormFields(fields) {
      if (this.$utils.isEmpty(fields)) { return }
      for (let i = 0; i < fields.length; i++) {
        const field = fields[i]
        const fieldType = field.field_type
        if (fieldType === 'grid' || fieldType === 'tabs') { // 栅格布局
          if (field.field_options.columns && field.field_options.columns.length > 0) {
            // 循环遍历所有字段
            field.field_options.columns.forEach(item => {
              this.buildFormFields(item.fields)
            })
          }
        } else {
          // 不是只读字段
          if (!FormOptions.t.NON_INPUT_FIELD_TYPES.includes(fieldType) &&
           this.$utils.isNotEmpty(field.name)) {
            this.formFields.push(field)
          }
        }
      }
    },
    setFormLabelFields() {
      this.formLabelFields = []
      this.buildFormLabelFields(this.fields)
    },
    buildFormLabelFields(fields) {
      for (let i = 0; i < fields.length; i++) {
        const field = fields[i]
        const fieldType = field.field_type
        if (fieldType === 'grid' || fieldType === 'tabs') { // 栅格布局
          if (field.field_options.columns && field.field_options.columns.length > 0) {
            // 循环遍历所有字段
            field.field_options.columns.forEach(item => {
              this.buildFormFields(item.fields)
            })
          }
        } else {
          if (fieldType === 'label' && this.$utils.isNotEmpty(field.name)) {
            this.formLabelFields.push(field)
          }
        }
      }
    },
    getDataTemplateLable(key) {
      if (key === 'value_source') {
        return '值来源'
      } else if (key === 'dialog') {
        return '自定义对话框'
      } else if (key === 'linkdata') {
        return '关联数据'
      }
    },
    // 设置id和value
    settingDataTemplateConfig(key) {
      const label = this.getDataTemplateLable(key)
      if (this.$utils.isEmpty(this.fieldItem.field_options[key])) {
        ActionUtil.warning(`请设置${label}`)
        return
      }
      if (this.$utils.isEmpty(this.resultColumns)) {
        ActionUtil.warning(`请设置[${label}]返回字段`)
        return
      }
      this.dataTemplateConfigVisible = true
    },
    // 设置动态参数
    settingDataTemplateCondition(key) {
      const label = this.getDataTemplateLable(key)
      if (this.$utils.isEmpty(this.fieldItem.field_options[key])) {
        ActionUtil.warning(`请设置${label}`)
        return
      }
      if (this.$utils.isEmpty(this.dynamicConditions)) {
        ActionUtil.warning(`请设置[${label}]过滤条件`)
        return
      }
      // 构建表单字段
      this.setFormFields()
      this.dataTemplateConditionVisible = true
    },
    // 设置联动数据
    settingDataTemplateLinkData(key) {
      const label = this.getDataTemplateLable(key)
      if (this.$utils.isEmpty(this.fieldItem.field_options[key])) {
        ActionUtil.warning(`请设置${label}`)
        return
      }
      if (this.$utils.isEmpty(this.resultColumns)) {
        ActionUtil.warning(`请设置[${label}]返回字段`)
        return
      }
      // 构建表单字段
      this.setFormFields()
      this.dataTemplateLinkDataVisible = true
    },
    // 设置联动属性
    settingDataTemplateLinkAttr(key) {
      const label = this.getDataTemplateLable(key)
      if (this.$utils.isEmpty(this.fieldItem.field_options[key])) {
        ActionUtil.warning(`请设置${label}`)
        return
      }
      if (this.$utils.isEmpty(this.resultColumns)) {
        ActionUtil.warning(`请设置[${label}]返回字段`)
        return
      }
      // 构建表单【lable】字段
      this.setFormLabelFields()
      if (this.$utils.isEmpty(this.formLabelFields)) {
        ActionUtil.warning(`表单未设置字段类型为【文本】的字段`)
        return
      }

      this.dataTemplateLinkAttrVisible = true
    },
    // ==================设置值

    setDataTemplateConfig(data) {
      this.fieldItem.field_options.link_config = data
    },
    setDataTemplateCondition(data) {
      this.fieldItem.field_options.link_condition = data
    },
    setDataTemplateLinkData(data) {
      this.fieldItem.field_options.link_linkage = data
    },
    setDataTemplateLinkAttr(data) {
      this.fieldItem.field_options.link_attr = data
    }
  }
}
