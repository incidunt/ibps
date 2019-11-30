<template>
  <el-form
    ref="form"
    :model="formData"
    :rules="rules"
    style="height:400px;"
    label-width="120px"
    size="mini"
  >
    <el-form-item label="过滤名称" prop="label">
      <el-input v-model="formData.label" placeholder="过滤名称" />
    </el-form-item>
    <el-form-item label="权限" prop="rights">
      <rights-selector v-model="formData.rights" />
    </el-form-item>
    <el-form-item style="margin-bottom: 5px;">
      <div slot="label">过滤规则：<ibps-help content="设置为空时不会出现为null数据；设置为null时不会出现为空数据。" /></div>
    </el-form-item>
    <el-form-item prop="rules" label-width="0">
      <ibps-query-builder
        ref="queryBuilder"
        :value="formData.filter"
        :filters="filters"
        :conditions="conditions"
        :control-types="controlTypes"
      />
    </el-form-item>
  </el-form>
</template>
<script>
import RightsSelector from '@/business/platform/rights/config/selector'
import IbpsQueryBuilder from '@/components/ibps-query-builder'

export default {
  components: {
    RightsSelector,
    IbpsQueryBuilder
  },
  props: {
    data: {
      type: Object
    },
    fields: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      conditions: {
        'AND': '并且',
        'OR': '或者'
      },
      controlTypes: {
        'text': '单行文本',
        'number': '数字',
        'radio': '单选框',
        'checkbox': '多选框',
        'select': '下拉框',
        'datePicker': '日期控件',
        'dictionary': '数据字典',
        'selector': '选择器',
        'customDialog': '自定义对话框',
        'linkdata': '关联数据'
      },
      formName: 'form',
      formData: {
        label: '默认条件',
        key: '',
        rights: [],
        filter: {}
      },
      rules: {
        label: [{ required: true, message: this.$t('validate.required') }],
        filter: [{ required: true, message: this.$t('validate.required') }]
      }
    }
  },
  computed: {
    filters() {
      const filters = []
      if (this.fields.length === 0) return []
      this.fields.forEach(field => {
        // // 屏蔽附件/签名
        if (field.field_type !== 'attachment' && field.field_type !== 'signature') {
          filters.push(this.getFilter(field))
        }
      })
      return filters
    }
  },
  watch: {
    data: {
      handler(val) {
        if (val) {
          this.formData = JSON.parse(JSON.stringify(val))
        }
      },
      immediate: true
    }
  },
  methods: {
    getFilter(field) {
      const filter = {
        id: field.name,
        label: field.label,
        field: field.name
      }
      let type = this.getType(field.type)
      const options = field['field_options'] ? field['field_options']['options'] || [] : []
      const values = {}
      if (type === 'date' && field.field_type !== 'datePicker') {
        field.field_type = 'datePicker'
      } else if (type === 'number') {
        field.field_type = 'number'
      }

      let input = 'text'
      switch (field.field_type) { // 字段控件类型
        case 'text':
        case 'textarea':
          type = 'string'
          break
        case 'editor':

          input = 'text'
          filter.operators = [
            'contains',
            'not_contains',
            'is_empty',
            'is_not_empty',
            'is_null',
            'is_not_null']
          break
        case 'number':
          input = 'number'
          filter.operators = [
            'equal', 'not_equal',
            'less', 'less_or_equal',
            'greater', 'greater_or_equal',
            'between', 'not_between',
            'is_null', 'is_not_null']
          break
        case 'datePicker':
          type = 'date'
          input = field.field_options && field.field_options.datefmt !== 'custom' ? field.field_options.datefmt || 'datetime' : 'datetime'
          filter.operators = [
            'equal',
            'not_equal',
            'less',
            'less_or_equal',
            'between',
            'not_between',
            'greater',
            'greater_or_equal',
            'is_null',
            'is_not_null']

          break
        case 'radio':
        case 'checkbox':
        case 'select':
          filter.operators = ['equal', 'not_equal', 'in', 'not_in', 'is_null', 'is_not_null']
          options.forEach(option => {
            values[option.val] = option.label
          })
          filter.values = values
          break
        case 'dictionary':
          type = 'string'
          filter.operators = [
            'equal',
            'not_equal',
            'in',
            'not_in',
            'is_empty',
            'is_not_empty',
            'is_null',
            'is_not_null']
          break
        case 'selector':
          type = 'string'
          filter.operators = [
            'equal',
            'not_equal',
            'contains',
            'not_contains',
            'in',
            'not_in',
            'is_empty',
            'is_not_empty',
            'is_null',
            'is_not_null'
          ]
          break
      }
      filter.input = input
      filter.type = type

      return filter
    },
    getType: function(dataType) {
      var type = 'string'
      switch (dataType) { // 字段数据类型
        case 'number':
          type = 'number'
          break
        case 'date':
          type = 'date'
          break
        default:
          type = 'string'
      }
      return type
    },
    // 获取表单数据
    getFormData(callback) {
      this.$refs[this.formName].validate((valid) => {
        if (valid) {
          // TODO: 验证过滤条件
          const data = this.$refs.queryBuilder.getData()
          if (!data || this.$utils.isEmpty(data.rules)) {
            this.$message({
              message: '请设置过滤条件',
              type: 'warning'
            })
            return
          }
          const hasErrors = this.$refs.queryBuilder.getErrors()
          if (hasErrors) {
            this.$message({
              message: '请检查过滤条件是否填写正确',
              type: 'warning'
            })
            return
          }
          this.formData.filter = data
          callback(this.formData)
        } else {
          callback()
        }
      })
    }
  }
}
</script>

