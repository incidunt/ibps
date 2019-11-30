<template>
  <div>
    <div v-sticky class="setting-title">{{ data.node_type==='inclusiveGateway'?'条件网关设置':'分支网关设置' }}</div>
    <el-collapse v-model="activeNames">
      <el-collapse-item title="条件设置" name="branchCondition">
        <branch-condition :data="conditions" />
      </el-collapse-item>
    </el-collapse>
  </div>
</template>
<script>
import mixins from '../mixins/type'
export default {
  mixins: [mixins],
  data() {
    return {
      activeNames: ['branchCondition']
    }
  },
  computed: {
    conditions() {
      return this.data ? this.data.conditions || [] : []
    }
  }
}
</script>

