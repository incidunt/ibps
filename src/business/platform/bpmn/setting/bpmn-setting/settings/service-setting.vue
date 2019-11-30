<template>
  <div class="panel-body service-setting">
    <el-form label-width="120px" :label-position="labelPosition" :model="service">
      <el-input v-model="service.voteAmount" disabled placeholder="请设置服务地址" :style="'marginBottom:20px'" />
      <div class="bottom">
        <el-button type="success" @click="dialogFormVisible=true">设置</el-button>
        <el-button type="danger">清空</el-button>
      </div>
    </el-form>
    <service-address
      :title="'服务设置'"
      :visible="dialogFormVisible"
      @callback="getServiceSetting"
      @close="visible => dialogFormVisible = false"
    />
  </div>
</template>
<script>
import ServiceAddress from '../components/edit-service-address'
export default {
  components: {
    ServiceAddress
  },
  props: {
    data: Object,
    curNode: Object
  },
  data() {
    return {
      dialogFormVisible: false,
      labelPosition: 'left',
      signRule: {
        decideType: '',
        followMode: '',
        voteType: '',
        voteAmount: ''

      }
    }
  },
  computed: {
    service() {
      return this.data
    }
  },
  // 监听
  watch: {

  },
  created() {
    // this.signRule = JSON.parse(JSON.stringify(this.curNode.signRule))
  },

  methods: {
    getServiceSetting(val) {
    }

  }
}
</script>
<style lang="scss">
.service-setting{
  .bottom{
    display: flex;
justify-content: space-between;
 .el-button{
  width: 45%;
}
  }
}
</style>
