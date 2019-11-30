<template>
  <div>
    <el-form v-bind="$attrs" v-on="$listeners">
      <!-- 基本属性 -->
      <editor-field-grid
        :field-item="fieldItem"
      />
    </el-form>
  </div>
</template>

<script>
import EditorFieldGrid from '../editors/editor-field-grid'
import typeMixin from '../mixins/type'

export default {
  name: 'ibps-field-grid',
  components: {
    EditorFieldGrid
  },
  mixins: [typeMixin]
}
</script>
