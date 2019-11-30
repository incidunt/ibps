<template>
  <el-dialog
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :title="title"
    class="dialog dataTemplate-create-dialog"
    @open="getFormData"
    @close="closeDialog"
  >
    <el-form
      ref="dataTemplateForm"
      v-loading="dialogLoading"
      :element-loading-text="$t('common.loading')"
      :model="dataTemplate"
      :rules="rules"
      :label-width="formLabelWidth"
    >
      <el-form-item label="模版名称:" prop="name">
        <el-input v-model="dataTemplate.name" v-pinyin="{vm:dataTemplate}" />
      </el-form-item>
      <el-form-item label="模版Key:" prop="key">
        <el-input v-model="dataTemplate.key" />
      </el-form-item>
      <el-form-item label="分类:" prop="typeId">
        <ibps-type-select
          v-model="dataTemplate.typeId"
          category-key="DATA_TEMPLATE_TYPE"
          clearable
        />
      </el-form-item>
      <el-form-item label="模版类型:" prop="type">
        <el-select v-model="dataTemplate.type" style="width:100%;">
          <el-option
            v-for="option in templateTypeOptions"
            :key="option.value"
            :value="option.value"
            :label="option.label"
          />
        </el-select>
      </el-form-item>
      <el-form-item v-if="dataTemplate.type !== 'valueSource'" label="展示形式:" prop="showType">
        <el-select v-model="dataTemplate.showType" style="width:100%;">
          <el-option
            v-for="option in showTypeOptions"
            :key="option.value"
            :value="option.value"
            :label="option.label"
          />
        </el-select>
      </el-form-item>

      <el-form-item v-if="dataTemplate.type !== 'valueSource' && dataTemplate.showType === 'compose'" label="组合形式:" prop="composeType">
        <el-select v-model="dataTemplate.composeType" style="width:100%;">
          <el-option
            v-for="option in composeTypeOptions"
            :key="option.value"
            :value="option.value"
            :label="option.label"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="数据集:" prop="datasetKey">
        <dataset-selector
          v-model="dataTemplate.datasetKey"
          value-key="key"
          @change="changeDataset"
        />
      </el-form-item>
    </el-form>
    <div slot="footer" class="el-dialog--center">
      <ibps-toolbar
        :actions="toolbars"
        @action-event="handleActionEvent"
      />
    </div>
    <template-builder
      :visible="templatebuilderDialogVisible"
      :data="dataTemplate"
      @callback="$emit('callback')"
      @close="visible => templatebuilderDialogVisible = visible"
    />
  </el-dialog>
</template>

<script>
import { isKeyExists } from '@/api/platform/data/dataTemplate'
import ActionUtils from '@/utils/action'
import { templateTypeOptions, showTypeOptions, composeTypeOptions } from '@/business/platform/data/constants'
import IbpsTypeSelect from '@/business/platform/cat/type/select'
import DatasetSelector from '@/business/platform/data/dataset/selector'

import TemplateBuilder from '@/business/platform/data/templatebuilder/dialog'
import { testKey } from '@/utils/validate'
import i18n from '@/utils/i18n'

var validateFormKey = (rule, dataTemplateKey, callback) => {
  if (!testKey(dataTemplateKey)) {
    callback(new Error(i18n.t('validate.key')))
  } else {
    isKeyExists({
      dataTemplateKey: dataTemplateKey
    }).then(response => {
      if (response.data === true) {
        callback(new Error(`数据模版key已经存在`))
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
    DatasetSelector,
    TemplateBuilder
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
      formName: 'dataTemplateForm',
      formLabelWidth: '120px',
      dialogVisible: this.visible,
      dialogLoading: false,
      templatebuilderDialogVisible: false,
      templateTypeOptions: templateTypeOptions,
      showTypeOptions: showTypeOptions,
      composeTypeOptions: composeTypeOptions,

      defaultForm: {},
      dataTemplate: {
        name: '',
        key: '',
        typeId: '',
        type: 'default',
        showType: 'list',
        composeType: 'treeList',
        datasetKey: '',
        datasetType: 'table',
        unique: ''
      },
      rules: {
        name: [{ required: true, message: this.$t('validate.required') }],
        key: [{ required: true, message: this.$t('validate.required') },
          { validator: validateFormKey, trigger: 'change' }],
        type: [{ required: true, message: this.$t('validate.required') }],
        showType: [{ required: true, message: this.$t('validate.required') }],
        datasetKey: [{ required: true, message: this.$t('validate.required') }]
      },
      toolbars: [
        { key: 'next', icon: 'ibps-icon-arrow-circle-right', label: '下一步' },
        { key: 'cancel' }
      ]
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
    this.defaultForm = JSON.parse(JSON.stringify(this.dataTemplate))
  },
  methods: {
    changeDataset(data) {
      this.dataTemplate.datasetType = data.type
    },
    handleActionEvent({ key }) {
      switch (key) {
        case 'next':
          this.handleNext()
          break
        case 'cancel':
          this.closeDialog()
          break
        default:
          break
      }
    },
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
      this.templatebuilderDialogVisible = true
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
      if (this.readonly) return
      this.$nextTick(() => {
        this.$refs[this.formName].validate(() => {})
      })
    },
    /**
     * 获取表单数据
     */
    getFormData() {
      // 重置表单
      this.dataTemplate = JSON.parse(JSON.stringify(this.defaultForm))
      this.dataTemplate.typeId = this.typeId
      this.formValidate()
    }
  }

}
</script>
<style lang="scss">
.dataTemplate-create-dialog{
  .el-dialog__body{
    height:  calc(70vh - 120px) !important;
  }
}

</style>
