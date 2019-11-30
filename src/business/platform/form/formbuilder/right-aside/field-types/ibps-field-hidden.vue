<template>
  <div>
    <el-form v-bind="$attrs" v-on="$listeners">
      <!-- 基本属性 -->
      <editor-base
        :field-item="fieldItem"
        :bo-data="boData"
        :fields="fields"
        types="switchFieldType,label,name,defaultValue,isPk"
      />
    </el-form>
  </div>
</template>
<script>
import typeMixin from '../mixins/type'
export default {
  name: 'ibps-field-hidden',
  mixins: [typeMixin]
}
</script>
