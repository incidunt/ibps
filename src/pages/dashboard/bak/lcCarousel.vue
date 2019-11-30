<template>
  <el-carousel :interval="5000" :height="getHeight()" class="lc-carousel" arrow="always">
    <el-carousel-item v-for="item in 4" :key="item">
      <h3>{{ item }}</h3>
    </el-carousel-item>
  </el-carousel>
</template>

<script>
import { getData } from '@/api/platform/desktop/column'

export default {
  name: 'lc-carousel',
  filters: {
  },
  props: {
    alias: {
      type: String,
      default: 'table'
    },
    height: {
      type: Number,
      default: 300
    }
  },
  data() {
    return {
      title: ''
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      getData({ alias: this.alias }).then(response => {
        const data = response.data
        this.title = data.title
      })
    },
    getHeight() {
      return (this.height + 10) + 'px'
    },
    getWidth() {
      return (this.width - 20) + 'px'
    }
  }
}
</script>
<style>
  .el-carousel__item h3 {
    color: #475669;
    font-size: 18px;
    opacity: 0.75;
    line-height: 300px;
    margin: 0;
  }

  .el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
  }

  .el-carousel__item:nth-child(2n+1) {
    background-color: #d3dce6;
  }
</style>

<style>
.lc-carousel .el-carousel__item:nth-child(2n+1){
  background-color:#d3dce6
  }
  .lc-carousel .block{
    padding:30px;
    text-align:center;
    border-right:1px solid #eff2f6;
    display:inline-block;width:50%;box-sizing:border-box}
    .lc-carousel .block:last-child{border-right:none}
    .lc-carousel .demonstration{display:block;color:#8492a6;font-size:14px;margin-bottom:20px}
    .lc-carousel .el-carousel__container{text-align:center}
    .lc-carousel .el-carousel__item h3{color:#fff;font-size:18px;line-height:300px;margin:0}
    .lc-carousel .el-carousel__item:nth-child(2n){background-color:#99a9bf}
    .lc-carousel .small h3{font-size:14px;line-height:150px}
    .lc-carousel .medium h3{font-size:14px;line-height:200px}
</style>
