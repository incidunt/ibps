<template>
  <el-dialog
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :title="title"
    class="dialog form-def-create-dialog"
    @open="getFormData"
    @close="closeDialog"
  >
    <el-form
      ref="formDefForm"
      v-loading="dialogLoading"
      :element-loading-text="$t('common.loading')"
      :model="formDef"
      :rules="rules"
      :label-width="formLabelWidth"
    >
      <el-form-item label="表单名称:" prop="name">
        <el-input v-model="formDef.name" v-pinyin="{vm:formDef}" />
      </el-form-item>
      <el-form-item label="表单Key:" prop="key">
        <el-input v-model="formDef.key" />
      </el-form-item>
      <el-form-item label="分类:" prop="typeId">
        <ibps-type-select
          v-model="formDef.typeId"
          category-key="FORM_TYPE"
          clearable
        />
      </el-form-item>
      <el-form-item label="表单模式:" prop="mode">
        <el-select v-model="formDef.mode" style="width:100%;" @change="changeMode">
          <el-option value="bo" label="业务对象" />
          <el-option value="codeGen" label="表配置【代码生成】" />
        </el-select>
      </el-form-item>
      <el-form-item v-if="formDef.mode==='bo'" label="业务对象:" prop="code">
        <bo-def-selector
          v-model="formDef.code"
          value-key="code"
          @change="handleCodeDef"
        />
      </el-form-item>
      <el-form-item v-else label="表名:" prop="code">
        <table-config-selector v-model="formDef.code" />
      </el-form-item>
      <el-form-item label="表单构建模式:" prop="buildMode">
        <el-select v-model="formDef.buildMode" style="width:100%;">
          <el-option value="default" label="默认模版" />
          <!-- <el-option value="template" label="表单模版" />
          <el-option value="table" label="数据表定义模版" /> -->
        </el-select>

      </el-form-item>

    </el-form>
    <div slot="footer" class="el-dialog--center">
      <el-button type="primary" icon="ibps-icon-arrow-circle-right" @click="handleNext()">下一步</el-button>
      <el-button icon="el-icon-circle-close" @click="closeDialog()">取 消</el-button>
    </div>
    <form-builder
      :visible="formbuilderDialogVisible"
      :data="formDefData"
      @callback="$emit('callback')"
      @close="visible => formbuilderDialogVisible = visible"
    />
    <select-template
      :visible="selectTemplateDialogVisible"
      @callback="design"
      @close="visible => selectTemplateDialogVisible = visible"
    />

    <select-table-template
      :visible="selectTableTemplateDialogVisible"
      @callback="design"
      @close="visible => selectTableTemplateDialogVisible = visible"
    />

  </el-dialog>
</template>

<script>

import { isFormKeyExists } from '@/api/platform/form/formDef'
import ActionUtils from '@/utils/action'
// import { typeOptions } from './constants'
import IbpsTypeSelect from '@/business/platform/cat/type/select'
import BoDefSelector from '@/business/platform/bo/def/selector'
import TableConfigSelector from '@/business/platform/codegen/table-config/selector'

import FormBuilder from '@/business/platform/form/formbuilder/dialog'

import SelectTemplate from './select-template'
import SelectTableTemplate from './select-table-template'
import { testKey } from '@/utils/validate'
import i18n from '@/utils/i18n'

var validateFormKey = (rule, formKey, callback) => {
  if (!testKey(formKey)) {
    callback(new Error(i18n.t('validate.key')))
  } else {
    isFormKeyExists({
      formKey: formKey,
      formDefId: 'xxx'
    }).then(response => {
      if (response.data === true) {
        callback(new Error(`表单key已经存在`))
        return
      }
      callback()
    }).catch((err) => {
      callback(new Error(err))
    })
  }
}

export default {
  components: {
    IbpsTypeSelect,
    BoDefSelector,
    TableConfigSelector,
    FormBuilder,
    SelectTemplate,
    SelectTableTemplate
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    title: String,
    typeId: String
  },
  data() {
    return {
      formName: 'formDefForm',
      formLabelWidth: '120px',
      dialogVisible: this.visible,
      dialogLoading: false,
      formbuilderDialogVisible: false,
      selectTemplateDialogVisible: false,
      selectTableTemplateDialogVisible: false,
      defaultForm: {},
      formDef: {
        name: '',
        key: '',
        typeId: '',
        mode: 'bo',
        code: '',
        busId: '',
        buildMode: 'default'
      },
      rules: {
        name: [{ required: true, message: this.$t('validate.required') }],
        key: [{ required: true, message: this.$t('validate.required') },
          { validator: validateFormKey, trigger: 'change' }],
        mode: [{ required: true, message: this.$t('validate.required') }],
        code: [{ required: true, message: this.$t('validate.required') }]
      },
      formDefData: {}
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
    this.defaultForm = JSON.parse(JSON.stringify(this.formDef))
  },
  methods: {
    changeMode() {
      this.formDef.code = ''
      this.formDef.busId = ''
    },
    handleCodeDef(data) {
      this.formDef.busId = data.id
    },
    // 下一步
    handleNext() {
      this.$refs[this.formName].validate(valid => {
        if (valid) {
          this.nextData()
        } else {
          ActionUtils.saveErrorMessage()
        }
      })
    },
    // 下一步数据
    nextData() {
      if (this.formDef.buildMode === 'default') {
        this.design()
      } else {
        // TODO: 其他类型
      }
    },
    design(template) {
      this.formDefData = this.formDef
      this.formbuilderDialogVisible = true
      this.closeDialog()
    },
    // 关闭当前窗口
    closeDialog() {
      this.$emit('close', false)
    },
    /**
     * 表单验证
     */
    formValidate() {
      this.$nextTick(() => {
        this.$refs[this.formName].validate(() => {})
      })
    },
    /**
     * 获取表单数据
     */
    getFormData() {
      if (this.$utils.isEmpty(this.formId)) {
        // 重置表单
        this.formDef = JSON.parse(JSON.stringify(this.defaultForm))
        this.formDef.typeId = this.typeId
        this.formValidate()
        return
      }
      this.dialogLoading = true
    }
  }

}
</script>
<style lang="scss">
.form-def-create-dialog{
  .el-dialog__body{
    height:  calc(75vh - 150px) !important;
  }
}
</style>
