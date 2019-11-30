<template>
  <div>
    <div v-sticky class="setting-title">开始设置--【{{ data.node_name }}】</div>
    <el-collapse v-model="activeNames">
      <el-collapse-item title="事件设置" name="eventScript">
        <event-script :data="scripts" :node-type="nodeType" :node-id="data.id" />
      </el-collapse-item>
      <el-collapse-item title="按钮设置" name="buttonSetting">
        <button-setting :data="buttons" :node-type="nodeType" />
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
      activeNames: ['eventScript', 'buttonSetting']
    }
  },
  computed: {
    nodeType() {
      return this.data ? this.data.node_type || 'userTask' : 'userTask'
    },
    scripts() {
      return this.data ? this.data.scripts || {} : {}
    },
    buttons() {
      return this.data ? this.data.buttons || [] : []
    }
  }
}
</script>

