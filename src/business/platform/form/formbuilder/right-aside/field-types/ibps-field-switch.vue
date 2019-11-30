<template>
  <div>
    <el-form v-bind="$attrs" v-on="$listeners">
      <!-- 基本属性 -->
      <editor-base
        :field-item="fieldItem"
        :bo-data="boData"
        :fields="fields"
        types="switchFieldType,label,name,defaultValue,desc"
      >
        <template slot="fixedValue">
          <el-switch
            v-model="fieldOptions.default_value"
            :width="fieldOptions.width"
            :active-value="fieldOptions.active_value"
            :inactive-value="fieldOptions.inactive_value"
          />
        </template>
      </editor-base>
      <!-- 字段权限 -->
      <editor-rights
        :field-item="fieldItem"
      />
      <editor-layout
        :field-item="fieldItem"
        types="width,labelWidth"
      />
    </el-form>
  </div>
</template>

<script>
import typeMixin from '../mixins/type'

export default {
  name: 'ibps-field-switch',
  mixins: [typeMixin]
}
</script>
