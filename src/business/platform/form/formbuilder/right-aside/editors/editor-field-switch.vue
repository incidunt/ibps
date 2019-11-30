<template>
  <div class="panel panel-default">
    <div class="panel-heading">开关设置</div>
    <div class="panel-body">
      <el-form-item>
        <template slot="label">switch 的宽度<help-tip prop="imageTypeVal" /></template>
        <el-input-number v-model="fieldOptions.width" />
      </el-form-item>
    </div>
  </div>
</template>
<script>
import EditorMixin from '../mixins/editor'

export default {
  mixins: [EditorMixin],
  data() {
    return {
    }
  }
}
</script>

