<template>
  <div>
    <el-form v-bind="$attrs" v-on="$listeners">
      <!-- 基本属性 -->
      <editor-base
        :field-item="fieldItem"
        :bo-data="boData"
        :fields="fields"
      >
        <template slot="fixedValue">
          <ibps-ueditor
            v-model="fieldOptions.default_value"
            destroy
          />
        </template>
      </editor-base>
      <!-- 校验规则 -->
      <editor-rules
        :field-item="fieldItem"
        types="required,length"
      />
      <!-- 字段权限 -->
      <editor-rights
        :field-item="fieldItem"
      />
      <!-- 布局设置 -->
      <editor-layout
        :field-item="fieldItem"
        types="label,height"
      />
      <!-- 工具栏设置 -->
      <editor-field-editor
        :field-item="fieldItem"
      />

    </el-form>
  </div>
</template>

<script>
import IbpsUeditor from '@/components/ibps-ueditor'
import typeMixin from '../mixins/type'

export default {
  name: 'ibps-field-editor',
  components: {
    IbpsUeditor
  },
  mixins: [typeMixin]
}
</script>
