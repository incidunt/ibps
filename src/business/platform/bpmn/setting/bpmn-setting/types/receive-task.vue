<template>
  <div>
    <div v-sticky class="setting-title">消息任务设置</div>
    <el-collapse v-model="activeNames">
      <el-collapse-item title="消息任务设置" name="messageSetting">
        <message-setting :data="message" />
      </el-collapse-item>
    </el-collapse>
  </div>
</template>
<script>
import mixins from '../mixins/type'
export default {
  mixins: [mixins],
  props: {
    data: Object
  },
  data() {
    return {
      activeNames: ['messageSetting']
    }
  },
  computed: {
    message() {
      return this.data
    }
  }
}
</script>

