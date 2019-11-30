<template>
  <div>
    <el-form v-bind="$attrs" v-on="$listeners">
      <!-- 基本属性 -->
      <editor-base
        :field-item="fieldItem"
        :bo-data="boData"
        :fields="fields"
      />
      <!-- 参数设置 -->
      <editor-field-dictionary
        :field-item="fieldItem"
      />
      <!-- 校验规则 -->
      <editor-rules
        :field-item="fieldItem"
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
  name: 'ibps-field-text',
  mixins: [typeMixin]
}
</script>
