<template>
  <ibps-container type="full" class="page">
    <el-row :gutter="12">

      <el-col :span="17">
        <el-card>
          <div slot="header" class="clearfix">
            基础示例
          </div>
          <el-row>
            <ibps-position-selector
              v-model="selectedValue1"
              multiple
            />

            <ibps-highlight>
              &lt;ibps-position-selector v-model="selectedValue" /&gt;
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
          <el-row>
            <pre style="font-size:12px;">
{{ showRes }}
            </pre>
          </el-row>
        </el-card>
      </el-col>
    </el-row>

    <!-- <el-row :gutter="10" class="ibps-mt-10">
      <el-col :span="10">
        <el-card>
          <div slot="header" class="clearfix">
            多选【默认值】
          </div>
          <ibps-position-selector
            v-model="selectedValue2"
            :placeholder="placeholder1"
            multiple/>
        </el-card>

      </el-col>
      <el-col :span="10">
        <el-card>
          <div slot="header" class="clearfix">
            多选[有多选框]
          </div>
          <ibps-position-selector
            v-model="selectedValue3"
            multiple/>
        </el-card>
      </el-col>

    </el-row>-->

  </ibps-container>
</template>

<script>
import IbpsPositionSelector from '@/business/platform/org/position/selector'

export default {
  components: {
    IbpsPositionSelector
  },
  data() {
    return {
      selectorVisible: false,
      showRes: null,

      selectedValue1: '500616403716407296',

      placeholder1: '请选择岗位',
      separate1: '>',
      displayType1: 'path',
      multiple1: false,

      selectedValue2: '',
      selectedValue3: '',

      selectedValue21: '',
      selectedValue31: '',

      selectedValue4: 'xj2',
      selectedValue5: 'xj2',

      selectedValue6: 'xj2',
      selectedValue7: 'xj2'
    }
  },
  watch: {
    selectedValue1(val) {
      this.showRes = val
    },
    selectedValue2(val) {
      this.showRes = val
    },
    selectedValue3(val) {
      this.showRes = val
    },
    selectedValue4(val) {
      this.showRes = val
    },
    selectedValue5(val) {
      this.showRes = val
    },
    selectedValue6(val) {
      this.showRes = val
    }
  },
  methods: {
    change1(val) {
      console.log(val)
    }
  }
}
</script>

