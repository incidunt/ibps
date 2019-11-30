<template>
  <div>
    <div v-sticky class="setting-title">服务任务设置--【{{ data.node_name }}】</div>
    <el-collapse v-model="activeNames">
      <el-collapse-item title="服务任务设置" name="serviceSetting">
        <service-setting :data="service" />
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
      activeNames: ['serviceSetting']
    }
  },
  computed: {
    service() {
      return this.data ? this.data.service || {} : {}
    }
  }
}
</script>

