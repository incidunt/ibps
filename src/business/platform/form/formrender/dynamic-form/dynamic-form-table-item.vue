<template>
  <el-form-item
    v-if="!hidden"
    :prop="code+'.'+index+'.'+field.name"
    :rules="rules"
    :label="mode === 'block'?label:null"
    :label-width="mode === 'block'?labelWidth:'0px'"
    :class="{
      'dynamic-form-table-item__readonly':readonly
    }"
  >
    <!--子表-->
    <dynamic-form-table
      v-if="field.field_type==='table'"
      :value.sync="dataModel"
      :field="field"
      :rights="fieldRights"
      :default-value="defaultValue[field.name]"
      :readonly="readonly"
      :readonly-style="readonlyStyle"
      v-on="listeners"
    />
    <dynamic-form-field
      v-else
      :value.sync="dataModel"
      :field="field"
      :models="models"
      :readonly="readonly"
      :readonly-style="readonlyStyle"
      v-on="listeners"
    />
    <div v-if="field && field.desc" class="ibps-help-block">
      {{ field.desc }}
    </div>
  </el-form-item>
</template>
<script>
import FormUtil from '@/business/platform/form/utils/formUtil'
import FormOptions from '../../constants/formOptions'
import DynamicFormTable from './dynamic-form-table'
import DynamicFormField from './dynamic-form-field'

export default {
  components: {
    DynamicFormTable,
    DynamicFormField
  },
  props: {
    models: [Object, Array], // 字段数据
    defaultValue: Object, // 默认值
    field: Object, // 字段
    code: String, // 表名
    index: [String, Number], // 索引
    mode: {
      type: String,
      default: 'inner'
    },
    labelWidth: String, // 字段宽度
    readonlyStyle: String, // 只读
    rights: {// 字段权限
      type: [String, Object]
    },
    isReadonly: { // 只读
      type: Boolean,
      default: false
    },
    formula: {
      type: Object
    },
    linkages: {
      type: Object
    }
  },
  data() {
    let defaultVal = ''
    if (this.field.field_type === 'table') {
      // TODO：一对多，是数组，一对一是对象
      defaultVal = []
    } else {
      defaultVal = ''
    }
    return {
      dataModel: this.models[this.field.name] || defaultVal,
      fieldRights: this.rights[this.field.name] || 'e'
    }
  },
  computed: {
    label() { // 显示的文本
      return this.$utils.isNotEmpty(this.field.field_options.units) ? this.field.label + '(' + this.field.field_options.units + ')' : this.field.label
    },
    hidden() { // 是否隐藏
      return this.fieldRights === FormOptions.t.PERMISSIONS.HIDE || this.field.field_type === 'hidden'
    },
    readonly() { // 是否只读
      return this.isReadonly ? true : this.fieldRights === FormOptions.t.PERMISSIONS.READ
    },
    required() { // 必填  【只读隐藏，都设置非必填】
      return (this.readonly || this.hidden) ? false : (this.fieldRights === FormOptions.t.PERMISSIONS.REQUIRED ? true : this.field.field_options.required || false)
    },
    rules() {
      if (this.readonly || this.hidden) { return }
      return FormUtil.buildFormRules(this.field, this.required)
    },
    listeners() {
      return {
        ...this.$listeners,
        change: (data) => { this.emitEvent('change', data) }, // 	在 Input 值改变时触发
        focus: (event) => { this.emitEvent('focus', event) }, //	在 Input 获得焦点时触发
        blur: (event) => { this.emitEvent('blur', event) }, // 在 Input 失去焦点时触发
        // click: (event) => { this.emitEvent('click', event) } // 在 Input 点击时触发
        'change-data': this.handleModels // 数据改变
      }
    }
  },
  watch: {
    dataModel: {
      handler(val) {
        if (FormOptions.t.NON_MODEL_FIELD_TYPES.includes(this.field.field_type)) {
          return
        }
        this.handleModels(this.field.name, val)
        this.$nextTick(() => {
        // 值改变进行公式计算
          this.runCalFormula()
          // 值改变进行数据联动
          this.runLinkage()
        })
      },
      deep: true,
      immediate: true
    },
    models: {
      handler(val, oldVal) {
        this.dataModel = val[this.field.name]
      },
      deep: true
    },
    fieldRights: {
      handler(val) {
        this.rights[this.field.name] = val
        this.$emit('update:rights', {
          ...this.rights,
          [this.field.name]: val
        })
      },
      deep: true,
      immediate: true
    },
    rights: {
      handler(val, oldVal) {
        this.fieldRights = val[this.field.name]
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    handleModels(name, val) {
      this.models[name] = val
      this.$emit('update:models', {
        ...this.models,
        [name]: val
      })
    },
    /**
     * 进行公式计算
     */
    runCalFormula() {
      if (!this.formula) return
      const { field, code } = this
      if (field.isSub) { // 子表
        const key = code + '.' + field.name
        const formula = this.formula ? this.formula[key] : null
        if (formula) {
          FormUtil.runCalFormula(formula, this.models, field, field.row)
        }
      } else {
        field.code = code
        const key = field.code + '.' + field.name
        const formula = this.formula[key]

        if (formula) {
          const data = FormUtil.runCalFormula(formula, this.models, field)
          this.$emit('update:models', { ...data })
        }
      }
    },
    /**
     * 进行联动数据
     */
    runLinkage() {
      if (!this.linkages) return
      const { field, code } = this
      if (field.isSub) { // 子表
        const key = code + '.' + field.name
        const linkages = this.linkages ? this.params.linkages[key] : null
        if (linkages) {
          FormUtil.runLinkage(linkages, this.models, field, field.row)
        }
      } else {
        field.code = code
        const key = field.code + '.' + field.name
        const linkages = this.linkages ? this.params.linkages[key] : null

        if (linkages) {
          FormUtil.runLinkage(linkages, this.models, field)
        }
      }
    },
    emitEvent(event) {
      this.$emit(event, ...Array.from(arguments).slice(1))
    }
  }
}
</script>

