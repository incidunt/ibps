<template>
  <el-form-item
    v-if="!hidden"
    :prop="field.name"
    :rules="rules"
    :label="field.label"
  >
    <template v-if="opinionData && opinionData.length >0">
      <!--审批历史记录-- 纵向-->
      <table v-if="layout==='horizontal'" class="table table-condensed">
        <tr v-for="(data,i) in opinionData" :key="i">
          <template v-for="(option,j) in options">
            <td v-if="option.checked" :key="j" style="width:15%">
              {{ option.label }}:<span>{{ data[option.value]|filterData(option,data) }}</span>
            </td>
          </template>
        </tr>
      </table>
      <template v-else>
        <!--审批历史记录,横向 -->
        <table
          v-for="(data,i) in opinionData"
          :key="i"
          class="table table-bordered"
        >
          <tr v-for="(option,j) in options" :key="j">
            <td v-if="option.checked">
              {{ option.label }}:<span>{{ data[option.value]|filterData(option,data) }}</span>
            </td>
          </tr>
        </table>
      </template>
    </template>

    <div v-if="!readonly">
      <ibps-approval-opinion
        v-model="dataModel"
        :enable-common="field.field_options.common_statment"
      />
    </div>
    <div v-if="field && field.desc" class="ibps-help-block">
      {{ field.desc }}
    </div>
  </el-form-item>
</template>
<script>
import Utils from '@/utils/util'
import fecha from '@/utils/fecha'
import FormUtil from '@/business/platform/form/utils/formUtil'
import FormOptions from '@/business/platform/form/constants/formOptions'
import IbpsApprovalOpinion from '@/business/platform/bpmn/components/approval-opinion'

export default {
  components: {
    IbpsApprovalOpinion
  },
  filters: {
    filterData(value, option, data) {
      if (option.value === 'auditorName') {
        if (Utils.isEmpty(data.auditor) &&
          Utils.isNotEmpty(data.qualifiedExecutor)) {
        // TODO: 审批人处理
        // value = _.compact(_.pluck(data.qualifiedExecutor, 'executor')).join(',')
        }
      } else if (option.value === 'completeTime') { // 审批时间
        value = fecha.format(value, 'yyyy-MM-dd HH:mm:ss')
      }

      return value
    }
  },
  props: {
    models: [Object, Array], // 所有对象数据
    defaultValue: Object,
    field: Object, // 字段
    code: String, // 表名
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
    },
    opinionData: {// 审批意见
      type: Array
    }
  },
  data() {
    return {
      dataModel: this.models[this.field.name] || '',
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
    layout() {
      return this.field.field_options.arrangement || 'horizontal'
    },
    options() {
      return this.field.field_options.options || FormOptions.t.DEFAULT_OPINION
    },
    listeners() {
      return {
        ...this.$listeners,
        change: (data) => { this.emitEvent('change', data) }, // 	在 Input 值改变时触发
        focus: (event) => { this.emitEvent('focus', event) }, //	在 Input 获得焦点时触发
        blur: (event) => { this.emitEvent('blur', event) } // 在 Input 失去焦点时触发
        // click: (event) => { this.emitEvent('click', event) } // 在 Input 点击时触发
      }
    }
  },
  watch: {
    dataModel: {
      handler(val) {
        this.handleModels(val)
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
    handleModels(val) {
      if (FormOptions.t.NON_MODEL_FIELD_TYPES.includes(this.field.field_type)) {
        return
      }
      this.models[this.field.name] = val
      this.$emit('update:models', {
        ...this.models,
        [this.field.name]: val
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

