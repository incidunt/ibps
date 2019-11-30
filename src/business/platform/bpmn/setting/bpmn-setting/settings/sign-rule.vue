<template>
  <div class="panel-body">
    <el-form label-width="120px" :label-position="labelPosition" :model="signRule">
      <el-form-item label="决策类型:">
        <el-radio v-model="signRule.decideType" label="agree">同意票</el-radio>
        <el-radio v-model="signRule.decideType" label="refuse">否定票</el-radio>
      </el-form-item>
      <el-form-item label="后续处理模式:">
        <el-radio v-model="signRule.followMode" label="wait">等待所有人投票</el-radio>
        <el-radio v-model="signRule.followMode" label="complete">直接处理</el-radio>
      </el-form-item>
      <el-form-item label="投票类型:">
        <el-radio-group v-model="signRule.voteType" @change="changeVoteType">
          <el-radio label="amount">绝对票数</el-radio>
          <el-radio label="percent">百分比</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="票数:">
        <el-input v-model="signRule.voteAmount" placeholder="请输入票数">
          <template v-if="signRule.voteType==='percent'" slot="append">%</template>
        </el-input>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  props: {
    data: Object
  },
  data() {
    return {
      labelPosition: 'left'
    }
  },
  computed: {
    signRule() {
      return this.data
    }
  },
  methods: {
    changeVoteType(value) {
      if (value === 'amount') {
        this.signRule.voteAmount = 1
      } else {
        this.signRule.voteAmount = 100
      }
    }
  }
}
</script>
