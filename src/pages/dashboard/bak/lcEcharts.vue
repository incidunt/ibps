<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>{{ title }}</span>
    </div>
    <div class="text item">
      <component
        :is="eChart"
        v-loading.body="loading"
        :options="echartOptions"
        :theme="theme"
        :auto-resize="autoResize"
        :style="{height:getHeight(),width:'100%'}"
        :element-loading-text="$t('common.loading')"
      />
    </div>
  </el-card>
</template>

<script>
require('echarts/theme/roma') // echarts theme
import { getData } from '@/api/platform/desktop/column'

export default {
  name: 'lc-echarts',
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    alias: {
      type: String,
      default: 'line'
    },
    height: {
      type: Number,
      default: 300
    },
    options: {
      type: Object,
      defaul: () => {}
    },
    id: {
      type: String
    }
  },
  data() {
    return {
      eChart: null,
      title: '图表',
      autoResize: true,
      theme: 'roma',
      echartOptions: {}
    }
  },
  created() {
    this.initChart()
  },
  mounted() {
    this.$nextTick(() => { this.eChart = resolve => require(['vue-echarts'], resolve) })
  },
  methods: {
    initChart() {
      this.loading = true
      getData({ alias: this.alias }).then(response => {
        var data = response.data
        this.title = data.title
        this.echartOptions = data.options
        this.loading = false
      }).catch((e) => {
        this.loading = false
      })
    },
    getHeight() {
      // 高度 - header - 边框
      return this.height ? (this.height - 60 - 40) + 'px' : '150px'
    },
    removeLayout() {
      if (this.id) {
        this.$emit('remove-layout', this.id)
      }
    }
  }
}
</script>
 <style lang="scss" scoped>
  .text {
    font-size: 14px;
  }

  .item {
    margin-bottom: 18px;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }

</style>
