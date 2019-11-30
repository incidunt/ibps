<template>
  <el-card
    v-loading.body="loading"
    :style="{height:getHeight(),width:'100%'}"
    :element-loading-text="$t('common.loading')"
    class="box-data"
  >
    <el-row ref="row" :gutter="12">
      <template v-for="item in data">
        <el-col :key="item.id" :span="24" :sm="12" :md="6" :lg="6" :xl="6">
          <div :style="{background:item.color}" class="item">
            <div class="item-header">
              <p>{{ item.title }}</p>
              <span>{{ item.subtitle }}</span>
            </div>
            <div class="item-body">
              <h2><count-to :end-val="item.count" :duration="4000" /></h2>
            </div>
            <!-- <div class="item-footer">
              <span>{{item.allcount}}</span>
              <p>{{item.text}}</p>
            </div> -->
            <p class="item-tip">{{ item.key }}</p>
          </div>
        </el-col>
      </template>
    </el-row>
  </el-card>
</template>

<script>
import { getData } from '@/api/platform/desktop/column'
import CountTo from 'vue-count-to'

export default {
  name: 'lc-box-data',
  components: {
    CountTo
  },
  props: {
    options: {
      type: Object,
      default: function() {
        return {}
      }
    },
    alias: {
      type: String,
      default: 'boxData'
    },
    height: {
      type: Number,
      default: 300
    },
    id: {
      type: String
    }
  },
  data() {
    return {
      loading: true,
      span: this.options.span || 6,
      data: this.options.data || []
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.loading = true
      getData({ alias: this.alias }).then(response => {
        const data = response.data
        this.span = data.span
        this.data = data.data
        this.loading = false
      }).catch((e) => {
        this.loading = false
      })
    },
    getHeight() {
      return this.height ? (this.height + 20) + 'px' : '150px'
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
.box-data {
  .item {
    position: relative;
    margin: 12px;
    padding: 12px;
    height: 90px;
    border-radius: 4px;
    box-sizing: border-box;
    overflow: hidden;
    color: #fff;
  }
  .item-header {
    position: relative;
    & > p {
      margin: 0px;
      font-size: 14px;
    }
    & > span {
      position: absolute;
      right: 0px;
      top: 0px;
      padding: 2px 8px;
      border-radius: 4px;
      font-size: 12px;
      background: rgba(255, 255, 255, 0.3);
    }
  }
  .item-body {
    & > h2 {
      margin: 0;
      font-size: 32px;
      line-height: 60px;
    }
  }
  // .item-footer {
  //   line-height: 16px;
  //   & > span {
  //     font-size: 10px;
  //   }
  //   & > p {
  //     margin: 0px;
  //     font-size: 12px;
  //   }
  // }
  .item-tip {
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    width: 80px;
    height: 80px;
    bottom: -35px;
    right: 50px;
    border: 2px solid #fff;
    border-radius: 100%;
    font-size: 48px;
    transform: rotate(-40deg);
    opacity: 0.1;
  }
}
</style>
