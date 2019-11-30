
<template>
  <ibps-container type="full" class="page">
    <el-row :gutter="12">
      <el-col :span="17">
        <el-card style="height: 300px;">
          <div slot="header" class="clearfix">
            基础示例
          </div>
          <el-row class="area-page-page-row1">
            <ibps-address-cascader
              v-model="resCascader"
              data-type="name"
              style="width:500px;"
            />

            <ibps-highlight>
              &lt;ibps-address-cascader v-model="resCascader" /&gt;
            </ibps-highlight>
          </el-row>
        </el-card>
      </el-col>
      <el-col :span="7">
        <el-card>
          <div slot="header" class="clearfix">
            <el-icon type="stats-bars" />
            数据展示
          </div>
          <el-row class="area-page-page-row1">
            <pre style="font-size:12px;">
{{ showRes }}
            </pre>
          </el-row>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="10" class="ibps-mt-10">
      <el-col :span="6">
        <el-card>
          <div slot="header" class="clearfix">
            cascader四级
          </div>
          <ibps-address-cascader v-model="res1" level="district" clearable />
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <div slot="header" class="clearfix">
            cascader三级
          </div>
          <ibps-address-cascader v-model="res2" level="city" />
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <div slot="header" class="clearfix">
            cascader二级
          </div>
          <ibps-address-cascader v-model="res3" data-type="name" level="province" />
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <div slot="header" class="clearfix">
            cascader一级
          </div>
          <ibps-address-cascader v-model="res4" data-type="code" level="country" />
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="10" class="ibps-mt-10">
      <el-col :span="12">
        <el-card>
          <div slot="header" class="clearfix">
            禁用指定级别
          </div>
          <ibps-address-cascader v-model="res5" disabled level="district" />
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card>
          <div slot="header" class="clearfix">
            可搜索
          </div>
          <el-row class="area-page-page-row2">
            <ibps-address-cascader
              v-model="res6"
              filterable
            />
          </el-row>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="10" class="ibps-mt-10">
      <el-col :span="12">
        <el-card>
          <div slot="header" class="clearfix">
            三种尺寸
          </div>
          <ibps-address-cascader v-model="res7" size="medium" level="province" />
          <ibps-address-cascader v-model="res8" style="margin-top:10px;" size="small" level="province" />
          <ibps-address-cascader v-model="res9" style="margin-top:10px;" size="mini" level="province" />
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card>
          <div slot="header" class="clearfix">
            自定义显示格式
          </div>
          <el-row class="area-page-page-row2">
            <ibps-address-cascader
              v-model="res10"
              size="medium"
              level="district"
              placeholder="这是级联模式"
              separator=">"
            />
          </el-row>
        </el-card>
      </el-col>
    </el-row>
  </ibps-container>
</template>

<script>
import IbpsAddressCascader from '@/components/ibps-address/cascader.vue'

export default {
  components: {
    IbpsAddressCascader
  },
  data() {
    return {
      // resCascader: ['CN', '44', '4401', '440104'], // code 类型
      resCascader: ['中国', '广东省', '广州市', '越秀区'], // name 类型
      // resCascader: [
      //   {
      //     'code': 'CN',
      //     'name': '中国'
      //   },
      //   {
      //     'code': '44',
      //     'name': '广东省'
      //   },
      //   {
      //     'code': '4401',
      //     'name': '广州市'
      //   },
      //   {
      //     'code': '440104',
      //     'name': '越秀区'
      //   }
      // ],

      // resCascader: [],
      res1: [],
      res2: [],
      res3: [],
      res4: [],
      res5: [],
      res6: [],
      res7: [],
      res8: [],
      res9: [],
      res10: [],
      res11: [],
      res12: [],
      res13: [],
      showRes: []
    }
  },
  watch: {
    resSelector(val) {
      this.showRes = val
    },
    resCascader(val) {
      this.showRes = val
    },
    res1(val) {
      this.showRes = val
    },
    res2(val) {
      this.showRes = val
    },
    res3(val) {
      this.showRes = val
    },
    res4(val) {
      this.showRes = val
    },
    res5(val) {
      this.showRes = val
    },
    res6(val) {
      this.showRes = val
    },
    res7(val) {
      this.showRes = val
    },
    res8(val) {
      this.showRes = val
    },
    res9(val) {
      this.showRes = val
    },
    res10(val) {
      this.showRes = val
    },
    res11(val) {
      this.showRes = val
    },
    res12(val) {
      this.showRes = val
    },
    res13(val) {
      this.showRes = val
    }
  }
}
</script>
<style scoped>
.area-page-row1 {
  height: 305px !important;
}
.area-page-row2 {
  height: 110px !important;
}
.ibps-mt-10 {
  margin-top: 10px;
}
</style>

