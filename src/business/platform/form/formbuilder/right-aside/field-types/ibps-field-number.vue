<template>
  <div>
    <el-form v-bind="$attrs" v-on="$listeners">
      <!-- 基本属性  numberFormat-->
      <editor-base
        :field-item="fieldItem"
        :bo-data="boData"
        :fields="fields"
        types="switchFieldType,label,name,defaultValue,units,placeholder,desc"
      />

      <!-- 校验规则 -->
      <editor-rules
        :field-item="fieldItem"
        types="required,number,minMax"
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
  name: 'ibps-field-number',
  mixins: [typeMixin]
}
</script>
