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
          <el-rate
            v-model="fieldOptions.default_value"
            :max="fieldOptions.max"
            :allow-half="fieldOptions.allow_half"
          />
        </template>
      </editor-base>
      <!-- 评分设置 -->
      <editor-field-rate
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
import EditorFieldRate from '../editors/editor-field-rate'

export default {
  name: 'ibps-field-rate',
  components: {
    EditorFieldRate
  },
  mixins: [typeMixin]
}
</script>
