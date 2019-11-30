<template>
  <el-dialog
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :title="title"
    class="dialog"
    @open="getFormData"
    @close="closeDialog"
  >
    <el-form
      ref="formTemplateForm"
      v-loading="dialogLoading"
      :element-loading-text="$t('common.loading')"
      :model="formTemplate"
      :rules="rules"
      :label-width="formLabelWidth"
    >
      <el-form-item label="表单名称:" prop="name">
        <el-input v-model="formTemplate.name" v-pinyin="{vm:formTemplate}" />
      </el-form-item>
      <el-form-item label="表单Key:" prop="key">
        <el-input v-model="formTemplate.key" />
      </el-form-item>
      <el-form-item label="分类:" prop="typeId">
        <ibps-type-select
          v-model="formTemplate.typeId"
          category-key="FORM_TYPE"
          clearable
        />
      </el-form-item>
      <el-form-item label="表单模式:" prop="mode">
        <el-select v-model="formTemplate.mode" style="width:100%;">
          <el-option value="bo" label="业务对象" />
          <el-option value="codeGen" label="表配置" />
        </el-select>
      </el-form-item>
      <el-form-item label="业务对象:" prop="boId">
        <bo-def-selector v-model="formTemplate.boId" />
      </el-form-item>

    </el-form>
    <div slot="footer" class="el-dialog--center">
      <el-button type="primary" icon="ibps-icon-arrow-circle-right" @click="handleNext()">下一步</el-button>
      <el-button icon="el-icon-circle-close" @click="closeDialog()">取 消</el-button>
    </div>
    <form-builder
      :visible="formbuilderDialogVisible"
      @callback="$emit('callback')"
      @close="visible => formbuilderDialogVisible = visible"
    />
  </el-dialog>
</template>

<script>
import ActionUtils from '@/utils/action'
// import { typeOptions } from './constants'
import IbpsTypeSelect from '@/business/platform/cat/type/select'
import BoDefSelector from '@/business/platform/bo/def/selector'

import FormBuilder from '@/business/platform/form/formbuilder/dialog'

export default {
  components: {
    IbpsTypeSelect,
    BoDefSelector,
    FormBuilder
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
    id: String,
    title: String,
    typeId: String
  },
  data() {
    return {
      formName: 'formTemplateForm',
      formLabelWidth: '120px',
      dialogVisible: this.visible,
      dialogLoading: false,
      formbuilderDialogVisible: false,
      defaultForm: {},
      formTemplate: {
        name: '',
        key: '',
        typeId: '',
        mode: 'bo',
        boId: ''
      },
      rules: {
        name: [{ required: true, message: this.$t('validate.required') }],
        key: [{ required: true, message: this.$t('validate.required') }],
        mode: [{ required: true, message: this.$t('validate.required') }],
        boId: [{ required: true, message: this.$t('validate.required') }]
      }
    }
  },
  computed: {
    formId() {
      return this.id
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
    this.defaultForm = JSON.parse(JSON.stringify(this.formTemplate))
  },
  methods: {
    // 保存数据
    handleNext() {
      this.$refs[this.formName].validate(valid => {
        if (valid) {
          this.nextData()
        } else {
          ActionUtils.saveErrorMessage()
        }
      })
    },
    // 提交保存数据
    nextData() {
      this.formbuilderDialogVisible = true
      this.closeDialog()
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
      if (this.$utils.isEmpty(this.formId)) {
        // 重置表单
        this.formTemplate = JSON.parse(JSON.stringify(this.defaultForm))
        this.formTemplate.typeId = this.typeId
        this.formValidate()
        return
      }
      this.dialogLoading = true
    }
  }

}
</script>
