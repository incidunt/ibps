<template>
  <div>
    <el-form v-bind="$attrs" v-on="$listeners">
      <!-- 基本属性 -->
      <editor-field-tabs
        :field-item="fieldItem"
      />
    </el-form>
  </div>
</template>

<script>
import EditorFieldTabs from '../editors/editor-field-tabs'
import typeMixin from '../mixins/type'

export default {
  name: 'ibps-field-tabs',
  components: {
    EditorFieldTabs
  },
  mixins: [typeMixin]
}
</script>
