<template>
  <div>
    <el-form v-bind="$attrs" v-on="$listeners">
      <!-- 基本属性 -->
      <editor-base
        :field-item="fieldItem"
        :bo-data="boData"
        :fields="fields"
        types="label,desc"
      />
      <editor-field-hyperlink
        :field-item="fieldItem"
        :bo-data="boData"
      />
      <!-- 字段权限 -->
      <editor-rights
        :field-item="fieldItem"
        types="hide"
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
  name: 'ibps-field-hyperlink',
  mixins: [typeMixin]
}
</script>
