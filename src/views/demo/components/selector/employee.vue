<template>
  <ibps-container type="full" class="page">
    <el-row :gutter="12">

      <el-col :span="17">
        <el-card>
          <div slot="header" class="clearfix">
            基础示例
          </div>
          <el-row>
            <ibps-employee-selector
              v-model="selectedValue1"
              multiple
            />

            <ibps-highlight>
              &lt;ibps-employee-selector v-model="selectedValue" /&gt;
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
            <div style="font-size:12px;word-wrap: break-word;">
              {{ showRes }}
            </div>
          </el-row>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="10" class="ibps-mt-10">
      <el-col :span="10">
        <el-card>
          <div slot="header" class="clearfix">
            多选【默认值】
          </div>
          <ibps-employee-selector
            v-model="selectedValue2"
            :placeholder="placeholder1"
            multiple
          />
        </el-card>

      </el-col>
      <el-col :span="10">
        <el-card>
          <div slot="header" class="clearfix">
            多选[有多选框]xxxx
          </div>
          <ibps-employee-selector
            v-model="selectedValue3"
            multiple
          />
        </el-card>
      </el-col>

    </el-row>

    <el-row :gutter="10" class="ibps-mt-10">
      <el-col :span="10">
        <el-card>
          <div slot="header" class="clearfix">
            多选【默认值】[json]
          </div>
          <ibps-employee-selector
            v-model="selectedValue4"
            :placeholder="placeholder1"
            store="json"
            multiple
          />
        </el-card>

      </el-col>
      <el-col :span="10">
        <el-card>
          <div slot="header" class="clearfix">
            单选
          </div>
          <ibps-employee-selector
            v-model="selectedValue5"
          />
        </el-card>
      </el-col>

    </el-row>

  </ibps-container>
</template>

<script>
import IbpsEmployeeSelector from '@/business/platform/org/employee/selector'

export default {
  components: {
    IbpsEmployeeSelector
  },
  data() {
    return {
      selectorVisible: false,
      showRes: null,

      selectedValue1: '1',

      placeholder1: '请选择民族',
      separate1: '>',
      displayType1: 'path',
      multiple1: false,

      selectedValue2: '',
      selectedValue3: '',

      selectedValue4: '[{"id":"608628821742059520","name":"验收技术人员02"},{"id":"608628041773481984","name":"验收测试人员02"}]',
      selectedValue5: '',

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

