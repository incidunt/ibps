<template>
  <div>
    <!-- 基本属性 -->
    <el-form v-bind="$attrs" v-on="$listeners">
      <editor-form-header :field-item="fieldItem" />
    </el-form>
  </div>
</template>

<script>
import EditorFormHeader from '../editors/editor-form-header'
import typeMixin from '../mixins/type'
export default {
  name: 'ibps-field-form-header',
  components: { EditorFormHeader },
  mixins: [typeMixin],
  props: {
    fieldItem: {
      type: Object,
      required: true
    }
  }
}
</script>
