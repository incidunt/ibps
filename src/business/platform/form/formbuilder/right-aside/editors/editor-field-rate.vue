<template>
  <div class="panel panel-default">
    <div class="panel-heading">评分设置</div>
    <div class="panel-body">
      <el-form-item>
        <template slot="label">最大分值</template>
        <el-input-number v-model="fieldOptions.max" />
      </el-form-item>
      <el-form-item>
        <template slot="label">允许半选</template>
        <el-switch v-model="fieldOptions.allow_half" />
      </el-form-item>
      <!-- <el-form-item>
        <template slot="label">图标</template>
        <ibps-icon-select v-model="fieldOptions.icon" icon="el-icon-search" />
      </el-form-item> -->
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

