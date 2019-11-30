<template>
  <el-dropdown placement="bottom" size="small" @command="handleChange">
    <el-button class="ibps-mr btn-text can-hover" type="text">
      <ibps-icon name="font" size="16" />
    </el-button>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item :disabled="value==='default'" command="default">
        <ibps-icon :name="iconName('default')" class="ibps-mr-5" />默认
      </el-dropdown-item>
      <el-dropdown-item :disabled="value==='medium'" command="medium">
        <ibps-icon :name="iconName('medium')" class="ibps-mr-5" />中
      </el-dropdown-item>
      <el-dropdown-item :disabled="value==='small'" command="small">
        <ibps-icon :name="iconName('small')" class="ibps-mr-5" />小
      </el-dropdown-item>
      <el-dropdown-item :disabled="value==='mini'" command="mini">
        <ibps-icon :name="iconName('mini')" class="ibps-mr-5" />最小
      </el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
export default {
  name: 'ibps-header-size',
  computed: {
    ...mapState('ibps/size', [
      'value'
    ])
  },
  watch: {
    // 注意 这里是关键
    // 因为需要访问 this.$ELEMENT 所以只能在这里使用这种方式
    value: {
      handler(val, oldVal) {
        if (val === '') {
          return this.handleChange(this.$ELEMENT.size || 'small')
        }
        if (oldVal) {
          // 这个情况在已经加载完页面 用户改变了尺寸时触发
          this.$ELEMENT.size = val
          // 由于已经加载过设置 需要清空缓存设置
          this.pageKeepAliveClean()
          // 由于已经加载过设置 需要刷新此页面
          this.$router.replace('/refresh')
        } else {
          // 这个情况在刷新页面时触发
          this.$ELEMENT.size = val
        }
      },
      immediate: true
    }
  },
  methods: {
    ...mapMutations({
      pageKeepAliveClean: 'ibps/page/keepAliveClean'
    }),
    ...mapActions({
      sizeSet: 'ibps/size/set'
    }),
    handleChange(value) {
      this.sizeSet(value)
    },
    iconName(name) {
      return name === this.value ? 'dot-circle-o' : 'circle-o'
    }
  }
}
</script>
