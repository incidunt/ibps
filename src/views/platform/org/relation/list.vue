<template>
  <ibps-container type="full" class="relation-page">
    <el-row>
      <el-col v-if="isSuper" :span="24" class="relation-form">
        <el-form inline>
          <el-form-item label="员工：">
            <ibps-employee-selector
              :value="userId"
              :class-name="'relation-employee-dialog'"
              @input="handleInput"
            />
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="24">
        <div class="deatil">
          <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="下属员工" name="superior">
              <under-list :id="userId" :superior-data="superiorData" />
            </el-tab-pane>
            <el-tab-pane label="上级领导" name="under">
              <superior-list :id="userId" ref="superior" @callbackSuperior="callbackSuperior" />
            </el-tab-pane>
          </el-tabs>
        </div>
      </el-col>
    </el-row>
  </ibps-container>
</template>
<script>

import IbpsEmployeeSelector from '@/business/platform/org/employee/selector'
import SuperiorList from './superior-list'
import UnderList from './under-list'
export default {
  components: {
    SuperiorList,
    UnderList,
    IbpsEmployeeSelector
  },
  data() {
    return {
      activeName: 'superior',
      userId: this.$store.getters.userId,
      isSuper: this.$store.getters.isSuper,
      superiorData: []
    }
  },
  created() {
    this.userId = this.$store.getters.userId
  },
  mounted() {
    this.$refs['superior'].loadData()
  },
  methods: {
    handleClick(tab, event) {},
    callbackSuperior(data) {
      this.superiorData = data
    },
    handleInput(data) {
      this.userId = data
    }
  }
}
</script>
<style lang="scss">
.relation-employee-dialog{
  .el-dialog__body{
    height:  calc(70vh - 200px) !important;
  }
}
.relation-page{
   .ibps-container-full__body{
    padding: 0 !important;
  }
  .relation-form{
    margin-bottom: 0px;
    background: #f5f5f7;
    .el-form-item {
      margin-bottom: 10px;
      margin-left: 20px;
      margin-top: 10px;
    }
    .el-form-item__content{
      width: 250px;
    }
  }
  .deatil{
    padding: 0 5px;
    background: white;
  }
}
</style>
