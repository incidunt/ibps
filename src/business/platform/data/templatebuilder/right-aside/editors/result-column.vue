<template>
  <el-form
    ref="form"
    :model="formData"
    :rules="rules"
    label-width="120px"
    size="mini"
    class="template-result-column"
  >
    <el-form-item label="显示名称">
      <el-input v-model="formData.label" placeholder="显示名称" />
    </el-form-item>
    <el-form-item label="跟字段控件一致">
      <el-switch v-model="formData.same" active-value="Y" inactive-value="N" />
    </el-form-item>
    <!--控件类型-->
    <template v-if="formData.same === 'N'">
      <el-form-item label="返回格式">
        <el-select v-model="formData.field_type" @change="changeFieldType">
          <el-option
            v-for="item in resultFieldTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <!-- 枚举值格式 -->
      <el-form-item v-if="formData.field_type === 'radio' ||formData.field_type === 'checkbox' ||formData.field_type === 'select'" label-width="0" prop="options">
        <field-options v-model="formData.field_options.options" />
      </el-form-item>
      <!-- 日期格式 -->
      <el-form-item v-if="formData.field_type === 'datePicker'" label="日期格式" prop="datefmt_type">
        <el-select v-model="formData.field_options.datefmt_type">
          <el-option
            v-for="(item,index) in datefmtTypeOptions"
            :key="index"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <el-input
          v-if="formData.field_options.datefmt_type ==='custom'"
          v-model="formData.field_options.datefmt"
        />
      </el-form-item>

      <!-- 数据字典 -->
      <el-form-item v-if="formData.field_type === 'dictionary'" label="数据字典" prop="dictionary">
        <ibps-type-select
          v-model="formData.field_options.dictionary"
          category-key="DIC_TYPE"
          node-key="typeKey"
          clearable
        />
      </el-form-item>
      <!-- 选择器 -->
      <template v-if="formData.field_type === 'selector'">
        <el-form-item label="选择器类型" prop="selector_type">
          <el-select v-model="formData.field_options.selector_type">
            <el-option
              v-for="item in selectorTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="存储格式" prop="store">
          <el-select v-model="formData.field_options.store">
            <el-option
              v-for="item in selectorStoreOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="是否多选" prop="label">
          <el-switch
            v-model="formData.field_options.multiple"
            active-value="Y"
            inactive-value="N"
          />
        </el-form-item>
      </template>
      <!-- 自定义对话框 -->
      <template v-if="formData.field_type === 'customDialog'">
        <el-form-item>
          <template slot="label">自定义对话框</template>
          <ibps-data-template-selector2
            v-model="formData.field_options.dialog"
            type="dialog"
            placeholder="请选择自定义对话框"
          />
        </el-form-item>
        <el-form-item>
          <template slot="label">是否多选</template>
          <el-switch
            v-model="formData.field_options.multiple"
            active-value="Y"
            inactive-value="N"
          />
        </el-form-item>
        <el-form-item>
          <template slot="label">存储格式</template>
          <el-select v-model="formData.field_options.store" style="width:100%;">
            <el-option
              v-for="item in dialogStoreOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </template>
      <!-- end -->

    </template>
  </el-form>
</template>
<script>
import { resultFieldTypeOptions } from '../constants/editor-column'
import { datefmtTypeOptions, selectorTypeOptions, selectorStoreOptions, dialogStoreOptions } from '@/business/platform/form/constants/fieldOptions'

import FieldOptions from '@/business/platform/data/components/field/options'
import IbpsTypeSelect from '@/business/platform/cat/type/select'
import IbpsDataTemplateSelector2 from '@/business/platform/data/dataTemplate/selector2'

export default {
  components: {
    FieldOptions,
    IbpsTypeSelect,
    IbpsDataTemplateSelector2
  },
  props: {
    data: {
      type: Object
    }
  },
  data() {
    return {
      resultFieldTypeOptions,
      datefmtTypeOptions,
      selectorTypeOptions,
      selectorStoreOptions,
      dialogStoreOptions,
      formName: 'form',
      formData: {},
      rules: {
        label: [{ required: true, message: this.$t('validate.required') }]
      }
    }
  },
  watch: {
    data: {
      handler(val) {
        if (val) {
          this.formData = val
        }
      },
      immediate: true
    }
  },
  methods: {
  // 获取表单数据
    getFormData(callback) {
      this.$refs[this.formName].validate((valid) => {
        if (valid) {
          callback(this.formData)
        } else {
          callback()
        }
      })
    }
  }
}
</script>

<style lang="scss">
.template-result-column {
  .el-select {
    width:100%;
  }
}
</style>

