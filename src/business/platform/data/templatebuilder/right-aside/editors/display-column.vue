<template>
  <el-form
    ref="form"
    :model="formData"
    :rules="rules"
    label-width="120px"
    size="mini"
    class="template-display-column"
  >
    <el-form-item label="显示名称" prop="label">
      <el-input v-model="formData.label" placeholder="显示名称" />
    </el-form-item>
    <el-form-item label="权限" prop="rights">
      <rights-selector v-model="formData.rights" />
    </el-form-item>
    <el-form-item label="无权限样式" prop="noRightStyle">
      <el-select v-model="formData.noRightStyle" placeholder="无权限样式">
        <el-option value="" label="不显示" />
        <el-option value="asterisk" label="星号(*)" />
      </el-select>
    </el-form-item>
    <el-form-item label="允许排序" prop="sortable">
      <el-switch v-model="formData.sortable" />
    </el-form-item>
    <el-form-item label="对齐方式" prop="align">
      <el-radio-group v-model="formData.align">
        <el-radio-button label="left">左对齐</el-radio-button>
        <el-radio-button label="center">居中对齐</el-radio-button>
        <el-radio-button label="right">右对齐</el-radio-button>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="跟字段控件一致" prop="same">
      <el-switch v-model="formData.same" active-value="Y" inactive-value="N" />
    </el-form-item>
    <!--控件类型-->
    <template v-if="formData.same === 'N'">
      <el-form-item label="显示格式" prop="field_type">
        <el-select v-model="formData.field_type" @change="changeFieldType">
          <el-option
            v-for="item in displayFieldTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <!-- 数字格式 -->
      <template v-if="formData.field_type === 'number'">
        <el-form-item label="数字类型" prop="number_type">
          <el-select v-model="formData.field_options.number_type">
            <el-option
              v-for="item in numberTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item
          v-if="formData.field_options.number_type ==='integer' ||formData.field_options.number_type ==='number'||formData.field_options.number_type ==='currency'"
          label="数字格式"
          prop="number_type"
        >
          <el-select v-model="formData.field_options.number_format">
            <el-option
              v-for="item in numberFormatOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item
          v-if="formData.field_options.number_type ==='number' ||formData.field_options.number_type ==='currency'"
          label="小数精确位数"
          prop="decimal_places"
        >
          <el-input-number v-model="formData.field_options.decimal_places" />
        </el-form-item>

        <el-form-item
          v-if="formData.field_options.number_type ==='number'||formData.field_options.number_type ==='currency'"
          label="不足时补0"
          prop="decimal_scale"
        >
          <el-switch v-model="formData.field_options.decimal_scale" />
        </el-form-item>

        <el-form-item
          v-if="formData.field_options.number_type ==='currency'"
          label="前缀"
          prop="prefix"
        >
          <el-input v-model="formData.field_options.prefix" />
        </el-form-item>

        <el-form-item
          v-if="formData.field_options.number_type ==='currency'"
          label="后缀"
          prop="suffix"
        >
          <el-input v-model="formData.field_options.suffix" />
        </el-form-item>
      </template>

      <!-- 枚举值格式 -->
      <template v-if="formData.field_type === 'select'">
        <el-form-item label-width="0" prop="options">
          <field-options v-model="formData.field_options.options" />
        </el-form-item>
      </template>
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
        <el-form-item>
          <template slot="label">是否多选</template>
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
import RightsSelector from '@/business/platform/rights/config/selector'

import { displayFieldTypeOptions, numberTypeOptions, numberFormatOptions } from '../constants/editor-column'
import { datefmtTypeOptions, selectorTypeOptions, selectorStoreOptions, dialogStoreOptions } from '@/business/platform/form/constants/fieldOptions'
import FieldTypeMixin from '../mixins/field_type'
import FieldOptions from '@/business/platform/data/components/field/options'
import IbpsTypeSelect from '@/business/platform/cat/type/select'
import IbpsDataTemplateSelector2 from '@/business/platform/data/dataTemplate/selector2'

export default {
  components: {
    RightsSelector,
    FieldOptions,
    IbpsTypeSelect,
    IbpsDataTemplateSelector2
  },
  mixins: [FieldTypeMixin],
  props: {
    data: {
      type: Object
    }
  },
  data() {
    return {
      displayFieldTypeOptions,
      numberTypeOptions,
      numberFormatOptions,
      datefmtTypeOptions,
      selectorTypeOptions,
      selectorStoreOptions,
      dialogStoreOptions,

      formName: 'form',
      formData: {
        label: ''
      },
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
.template-display-column {
  .el-select {
    width:100%;
  }
}
</style>

