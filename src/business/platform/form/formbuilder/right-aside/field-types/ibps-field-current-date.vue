<template>
  <div>
    <el-form v-bind="$attrs" v-on="$listeners">
      <!-- 基本属性 -->
      <editor-base
        :field-item="fieldItem"
        :bo-data="boData"
        :fields="fields"
        types="switchFieldType,label,name,datefmt,defaultValue,placeholder,desc"
        default-value-types="fixed,today,dynamic,linkage,formula"
      >
        <template slot="fixedValue">
          <el-date-picker
            v-if="fieldOptions.datefmt_type=== 'date' || fieldOptions.datefmt_type=== 'datetime'"
            v-model="fieldOptions.default_value"
            :type="fieldOptions.datefmt_type"
            style="width:100%;"
          />
          <el-time-picker
            v-else-if="fieldOptions.datefmt_type=== 'time'"
            v-model="fieldOptions.default_value"
          />
          <!--TODO:-->
          <el-date-picker
            v-else-if="fieldOptions.datefmt_type=== 'custom'"
            v-model="fieldOptions.default_value"
            type="datetime"
            style="width:100%;"
          />
        </template>

      </editor-base>
      <!-- 校验规则 -->
      <editor-rules
        :field-item="fieldItem"
        types="required,date"
      />
      <!-- 字段权限 -->
      <editor-rights
        :field-item="fieldItem"
      />
      <!-- 布局设置 -->
      <editor-layout
        :field-item="fieldItem"
        types="labelWidth"
      />
    </el-form>
  </div>
</template>

<script>
import typeMixin from '../mixins/type'

export default {
  name: 'ibps-field-datepicker',
  mixins: [typeMixin],
  computed: {
    datePckerType() {
      return 'date'
    }
  }
}
</script>
