<template>
  <div class="panel-default">
    <div class="panel-body">
      <el-button
        class="ibps-mt-10"
        type="success"
        icon="el-icon-setting"
        style="width: 100%;"
        plain
        @click.native="handleSetting()"
      >抄送设置</el-button>
    </div>
    <notify-setting-page
      :visible="dialogFormVisible"
      :data="data"
      @callback="handleData"
      @close="visible => dialogFormVisible = visible"
    />
  </div>
</template>
<script>
import notifySettingPage from './../components/notify-setting-page'
export default {
  components: {
    notifySettingPage
  },
  props: {
    data: Array
  },
  data() {
    return {
      dialogFormVisible: false
    }
  },
  methods: {
    handleSetting() {
      this.dialogFormVisible = true
    },
    handleData(data) {
      this.data = data
    }
  }
}
</script>
