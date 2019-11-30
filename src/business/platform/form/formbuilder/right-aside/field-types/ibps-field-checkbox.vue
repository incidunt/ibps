<template>
  <div>
    <el-form v-bind="$attrs" v-on="$listeners">
      <!-- 基本属性 -->
      <editor-base
        :field-item="fieldItem"
        :bo-data="boData"
        :fields="fields"
      />
      <!-- 表单选项 -->
      <editor-options
        :field-item="fieldItem"
        :fields="fields"
      />
      <!-- 校验规则 -->
      <editor-rules
        :field-item="fieldItem"
        types="required,item"
      />
      <!-- 字段权限 -->
      <editor-rights
        :field-item="fieldItem"
      />
      <!-- 布局设置 -->
      <editor-layout
        :field-item="fieldItem"
        types="labelWidth,arrangement"
      />
    </el-form>
  </div>
</template>

<script>
import typeMixin from '../mixins/type'

export default {
  name: 'ibps-field-checkbox',
  mixins: [typeMixin]
}
</script>
