<template>
  <div>
    <div v-sticky class="setting-title">外部子流程设置--【{{ callActivity.node_name }}】</div>
    <el-collapse v-model="activeNames">
      <el-collapse-item title="外部子流程设置" name="callActivity">
        <call-activity :data="callActivity" />
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
      activeNames: ['callActivity']
    }
  },
  computed: {
    callActivity() {
      return this.data
    }
  },
  created() {

  },
  methods: {

  }
}
</script>
