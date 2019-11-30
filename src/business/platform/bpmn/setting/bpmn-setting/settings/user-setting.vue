<template>
  <div class="panel-default">
    <!-- <div class="panel-heading">人员设置</div> -->
    <div class="panel-body">
      <user-rules
        :data="users"
        title="人员规则设置"
      />
    </div>
  </div>
</template>
<script>
import UserRules from '../components/user-rules'
export default {
  components: {
    UserRules
  },
  props: {
    data: Array
  },
  computed: {
    users() {
      return this.data
    }
  },
  methods: {
    /**
     * 处理数据
     */
    handleData(data) {
      this.users = data
    }
  }
}
</script>

