<template>
  <div class="dynamic-form">
    <!--表头-->
    <div v-if="hasHeader" class="form-header">
      <div v-if="hasHeader" class="title">{{ formDef.name }}</div>
      <div v-if="hasDesc" class="desc"> {{ formDef.desc }}</div>
    </div>
    <!--表单-->
    <el-form
      ref="from"
      :model="models"
      :inline="inline"
      :label-suffix="colon"
      :label-width="labelWidth"
      :label-position="labelPosition"
      :status-icon="statusIcon"
    >
      <template v-for="(field,index) in formDef.fields">
        <!-- 表单意见-->
        <template
          v-if="field.field_type==='approval_opinion'"
        >
          <dynamic-form-opinion
            :key="index"
            :models.sync="formOpinions"
            :rights.sync="rights"
            :field="field"
            :opinion-data="formOpinionData[field.name]"
          />
        </template>
        <!--栅格布局-->
        <el-row
          v-else-if="field.field_type === 'grid'"
          :key="index"
          :gutter="field.field_options.gutter ? field.field_options.gutter : 0"
          :justify="field.field_options.justify"
          :align="field.field_options.align"
          class="widget-col"
          type="flex"
        >
          <el-col
            v-for="(col, colIndex) in field.field_options.columns"
            :key="colIndex"
            :span="col.span ? col.span : 0"
          >
            <template v-for="(item, i) in col.fields">
              <dynamic-form-item
                :key="i"
                :models.sync="models"
                :rights.sync="rights"
                :field="item"
                :formula="responseFormula"
                :linkages="responseLinkages"
                :code="code"
                :is-readonly="readonly"
                :readonly-style="readonlyStyle"
              />
            </template>
          </el-col>
        </el-row>

        <el-tabs
          v-else-if="field.field_type === 'tabs'"
          :key="index"
          v-model="tabs"
          :type="field.field_options.type"
          :tab-position="field.field_options.position"
          class="ibps-mb-10"
        >
          <el-tab-pane
            v-for="(col, colIndex) in field.field_options.columns"
            :key="colIndex"
            :label="col.label"
            :name="'tabs_'+colIndex"
          >
            <template v-for="(item, i) in col.fields">
              <dynamic-form-item
                :key="i"
                :models.sync="models"
                :rights.sync="rights"
                :field="item"
                :formula="responseFormula"
                :linkages="responseLinkages"
                :code="code"
                :is-readonly="readonly"
                :readonly-style="readonlyStyle"
              />
            </template>
          </el-tab-pane>
        </el-tabs>
        <!--其他类型-->
        <template v-else>
          <dynamic-form-item
            :ref="'formItem'+field.name"
            :key="index"
            :models.sync="models"
            :rights.sync="rights"
            :field="field"
            :default-value="defaultValue"
            :formula="responseFormula"
            :linkages="responseLinkages"
            :params="params"
            :code="code"
            :is-readonly="readonly"
            :readonly-style="readonlyStyle"
            :label-width="labelWidth"
          />
        </template>
      </template>
    </el-form>
  </div>
</template>

<script>
import FormOptions from '../../constants/formOptions'
import FormUtil from '../../utils/formUtil'
import DynamicFormItem from './dynamic-form-item'
import DynamicFormOpinion from './components/approval-opinion'

export default {
  components: {
    DynamicFormItem,
    DynamicFormOpinion
  },
  props: {
    formDef: {
      type: Object,
      required: true
    },
    value: {
      type: Object
    },
    readonly: {
      type: Boolean,
      default: false
    },
    permissions: {
      type: Object
    },
    columnMinWidth: {
      type: String
    },
    validateImmediately: {// 是否初始验证
      type: Boolean,
      default: true
    },
    initialization: {
      type: Boolean,
      default: false
    },
    // 扩展参数
    params: Object
  },
  data() {
    return {
      models: {}, // 表单model对象数据
      rights: {}, // 表单权限
      defaultValue: {}, // 表单默认值
      responseFormula: {}, // 公式
      responseLinkages: {},
      responseVerifys: [], // 表单提交校验
      responseOpinionFields: [], // 表单的意见字段
      formOpinions: {}, // 表单意见数据【填写】
      formOpinionData: {}, // 已填写的表单意见
      init: false,
      tabs: 'tabs_0'
    }
  },
  computed: {
    formAttrs() {
      return this.formDef.attrs || {}
    },
    hasHeader() {
      return this.formDef && this.formDef.attrs && !this.formDef.attrs.hide_name
    },
    hasDesc() {
      return this.formDef && this.formDef.attrs && !this.formDef.attrs.hide_desc && this.formDef.desc
    },
    inline() {
      return this.formAttrs.inline || false
    },
    colon() {
      return this.formAttrs ? (this.formAttrs.colon ? ':' : '') : ''
    },
    labelWidth() {
      if (this.$utils.isNotEmpty(this.formAttrs.labelWidth) && this.$utils.isNotEmpty(this.formAttrs.labelWidthUnit)) {
        return this.formDef.attrs.labelWidth + this.formDef.attrs.labelWidthUnit
      } else {
        return '100px'
      }
    },
    labelPosition() {
      if (this.$utils.isNotEmpty(this.formAttrs.labelPosition)) {
        return this.formDef.attrs.labelPosition
      } else {
        return 'right'
      }
    },
    statusIcon() {
      if (this.$utils.isNotEmpty(this.formAttrs.statusIcon)) {
        return this.formDef.attrs.statusIcon
      } else {
        return false
      }
    },
    code() {
      return this.formDef.code
    },
    readonlyStyle() {
      return this.formDef && this.formDef.attrs && this.formDef.attrs.read_style ? this.formDef.attrs.read_style : 'text'
    },
    hasScript() {
      return this.formDef.attrs ? this.$utils.isNotEmpty(this.formDef.attrs.script) : false
    }
  },
  watch: {
    formDef: {
      handler(val) {
        this.initResponseFields()
      },
      deep: true,
      immediate: true
    },
    models(val, oldVal) {
      // 延迟验证
      this.$nextTick(() => {
        this.validate(() => {})
      })
    },
    initialization(val) {
      if (val && this.hasScript) {
        this.$emit('load-script')
      }
    }
  },
  mounted() {
    // 初始化脚本
    this.$nextTick(() => {
      if (this.validateImmediately) {
        this.validate(() => {})
      }
    })
  },
  methods: {
    /**
     * 初始化字段
     */
    initResponseFields() {
      const fields = this.formDef.fields
      if (!fields) { return }
      this.generateModles(fields)
      // 初始化运行公式计算
      this.initRunCalFormula()
      // 初始化表单意见
      this.initResponseOpinionData()
    },
    /**
     * 生成modles
     */
    generateModles(fields) {
      for (let i = 0; i < fields.length; i++) {
        const field = fields[i]
        const fieldType = field.field_type
        if (fieldType === 'grid' || fieldType === 'tabs') { // 栅格布局
          if (field.field_options.columns && field.field_options.columns.length > 0) {
            // 循环遍历所有字段
            field.field_options.columns.forEach(item => {
              this.generateModles(item.fields)
            })
          }
        } else if (fieldType === 'table') { // 子表单
          this.models[field.name] = this.value[field.name] || []
          FormUtil.getTableDefaultData(field, (element, val) => {
            const data = this.defaultValue[field.name] || {}
            data[element.name] = val || ''
            this.defaultValue[field.name] = data
          })
          // ====== 初始化表单权限
          this.initFormRights(field)
        } else if (field.field_type === 'approval_opinion') {
          this.formOpinions[field.name] = ''
          this.responseOpinionFields.push(field.name)
          // ====== 初始化表单权限
          this.initFormRights(field)
        } else {
          // 不是只读字段
          if (!FormOptions.t.NON_MODEL_FIELD_TYPES.includes(fieldType)) {
            if (this.value && Object.keys(this.value).indexOf(field.name) >= 0) { // 有值
              this.models[field.name] = this.value[field.name]
            } else { // 默认值
              this.models[field.name] = FormUtil.getFieldDefaultValue(field, (name, val) => {
                this.models[name] = val
              })
            }
          }

          // ====== 初始化需要进行公式计算的字段
          this.initResponseFormula(field)
          // ====== 初始化表单权限
          this.initFormRights(field)
          // ======  初始化需要进行联动数据的字段
          this.initResponseLinkages(field)
        }
      }
    },

    /**
     *  初始化表单权限
     */
    initFormRights(field) {
      this.rights[field.name] = this.getPermissions(this.permissions, field) || FormUtil.getDefaultRigths(field)
    },
    // 获取权限
    getPermissions(permissions, { name, field_type }) {
      if (this.$utils.isEmpty(permissions)) { return }
      const fieldType = field_type
      let rightsValue = null
      const isNonInputField = FormOptions.t.NON_INPUT_FIELD_TYPES.includes(fieldType)
      let isSpecial = false
      if (isNonInputField && permissions.fields) { // 非输入字段
        rightsValue = permissions.fields[name] ? permissions.fields[name] : null
      } else if (fieldType === 'approval_opinion' && permissions.opinions) { // 意见 特殊处理
        rightsValue = permissions.opinions[name] ? permissions.opinions[name] : null
      } else if (fieldType === 'table' && permissions.tables) { // 子表
        isSpecial = true
        rightsValue = permissions.tables[name] ? permissions.tables[name] : null
      } else { // 字段
        rightsValue = permissions.fields[name] ? permissions.fields[name] : null
      }
      if (this.readonly && !isNonInputField && !isSpecial) { // 只读权限
        rightsValue = rightsValue !== FormOptions.t.PERMISSIONS.HIDE ? FormOptions.t.PERMISSIONS.READ : rightsValue
      }
      return rightsValue
    },
    // 初始化需要进行公式计算的字段
    initResponseFormula(item) {
      FormUtil.setResponseFormula(this.responseFormula, item, this.code)
    },
    // 初始化运行公式计算
    initRunCalFormula() {
      // 不需要字段的进行公式计算 比如获取但其当前时间
      const data = FormUtil.runCalFormula(this.responseFormula[FormUtil.NOT_NEED_FIELD], this.models || {}, this.formDef.code)
      this.models = { ...data }
    },
    // 初始化联动数据
    initResponseLinkages(item) {
      FormUtil.setResponseLinkages(this.responseLinkages, item, this.code)
    },
    // 初始化表单意见
    initResponseOpinionData() {
      this.formOpinionData = {}
      const opinionData = this.params ? this.params.formOpinionData || {} : {}
      if (this.$utils.isEmpty(opinionData) || this.responseOpinionFields.length <= 0) {
        return
      }

      const hasNode = opinionData.hasNode
      if (hasNode) { // 1、有流程节点绑定的流程意见
        // var curNodeId = this.params.nodeId
        const formOpinionConfig = opinionData.formOpinionConfig
        for (let i = 0; i < this.responseOpinionFields.length; i++) {
          const fieldName = this.responseOpinionFields[i]
          if (!formOpinionConfig[fieldName]) {
            this.formOpinionData[fieldName] = opinionData.opinionList
          }
        }
      } else {
        for (var i = 0; i < this.responseOpinionFields.length; i++) {
          const fieldName = this.responseOpinionFields[i]
          this.formOpinionData[fieldName] = opinionData.opinionList
        }
      }
    },
    getFormSubmitVerify() {
      const verifys = this.formDef.attrs ? this.formDef.attrs.verifys : []
      let errors = {}
      if (this.$utils.isEmpty(verifys)) { return errors }
      verifys.forEach((verify) => {
        if (!FormUtil.runFormSubmitVerify(verify.formula, this.formData, this.formDef.code)) {
          errors = {
            result: false,
            msg: verify.msg
          }
          return false
        }
      })
      return errors
    },

    /**
     * 获取表单数据
     */
    getFormData() {
      // TODO：需要去除文本字段
      return this.models
    },
    /**
     * 设置表单字段数据
     */
    setFieldData(name, value) {
      this.models[name] = value
    },
    /**
     * 设置表单权限
     */
    setFormRights(name, value) {
      this.rights[name] = value
    },
    /**
     * 获取审批意见数据
     */
    getFormOpinionData() {
      return this.formOpinions
    },
    /**
     *  是否有审批意见字段
     */
    hasFormOpinion() {
      return this.responseOpinionFields && this.responseOpinionFields.length > 0
    },
    /**
     * 表单验证
     */
    validate(callback) {
      this.$refs.from.validate((valid, invalidFields) => {
        callback(valid, invalidFields)
      })
    },
    submitVerify() {
      const verifys = this.formDef.attrs.verifys
      if (this.$utils.isEmpty(verifys)) {
        return
      }
      for (let i = 0; i < verifys.length; i++) {
        const verify = verifys[i]
        const valid = FormUtil.runFormSubmitVerify(verify.formula, this.getFormData(), this.code)
        if (!valid) {
          return {
            result: valid,
            message: verify.msg
          }
        }
      }
      return
    }

  }
}
</script>

<style lang="scss">
.dynamic-form {
  .el-input{
    width: 100%;
  }
  .el-select{
    width: 100%;
  }
  .form-header {
    border-bottom: 1px solid #2b34410d;
    margin-bottom: 5px;
    .title {
      font-size: 16px;
      font-weight: bold;
      color: #222;
      text-align: left;
      padding: 8px 10px 10px;
      margin: 0;
    }
    .desc {
      word-wrap: break-word;
      word-break: normal;
      text-indent: 0;
      line-height: 1.6;
      margin: 0 0 11px;
      padding: 3px 30px 8px;
    }
  }
  .dynamic-form-table-item__readonly{
     margin-bottom: 0;
  }
}
</style>
