<template>
  <div class="panel-body sign-privileges">
    <el-form label-width="80px" :label-position="labelPosition">
      <el-form-item label="已配置项:">
        <template v-if="hasPrivileges">
          <span v-if="signPrivileges.all.length>0" class="config">所有特权</span>
          <span v-if="signPrivileges.direct.length>0" class="config">直接处理</span>
          <span v-if="signPrivileges.oneticket.length>0" class="config">一票制</span>
          <span v-if="signPrivileges.allowAddSign.length>0" class="config">允许补签</span>
        </template>
        <span v-else class="config">未进行配置</span>
      </el-form-item>
      <el-button
        :style="{'width':'100%'}"
        type="success"
        plain
        @click.native="dialogFormVisible=true"
      >会签特权</el-button>
    </el-form>
    <sign-privileges-setting
      :visible="dialogFormVisible"
      :data="data"
      @callback="handleData"
      @close="visible => dialogFormVisible = visible"
    />
  </div>
</template>
<script>
import signPrivilegesSetting from './../components/sign-privileges-setting'
export default {
  components: {
    signPrivilegesSetting
  },
  props: {
    data: Object
  },
  data() {
    return {
      dialogFormVisible: false,
      labelPosition: 'left'
    }
  },
  computed: {
    signPrivileges: {
      get() {
        return this.data
      },
      set(value) {
        this.$emit('update:data', value)
      }
    },
    hasPrivileges() {
      if (this.$utils.isEmpty(this.signPrivileges)) {
        return false
      } else {
        for (const key in this.signPrivileges) {
          if (this.signPrivileges[key] && this.signPrivileges[key].length > 0) {
            return true
          }
        }
        return false
      }
    }
  },
  methods: {

    handleData(data) {
      this.signPrivileges = data
    }
  }
}
</script>
<style lang="scss">
.sign-privileges{
  .config{
    background: #eee;
    padding: 8px 5px;
    border-radius: 1px;
  }
}
</style>
