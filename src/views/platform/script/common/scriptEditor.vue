<template>
  <div>
    <el-dialog
      title="脚本编辑器"
      :visible.sync="show"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      width="50%"
      @close="closeDialog"
    >
      <el-row
        style="position:relative; overflow: hidden;height:440px"
      >
        <el-col :span="14" class="el-edit">
          <p style="border-bottom:1px solid #CCC;height:17px">脚本</p>
          <div style="height:210px" />
        </el-col>
        <el-col :span="9" :offset="1" class="el-edit">
          <p style="border-bottom:1px solid #CCC">表达式运算符</p>
          <el-row>
            <el-col :span="7" :offset="1" class="rowtop">
              <el-tooltip class="item" effect="dark" :open-delay="500" content="加" placement="bottom">
                <el-button value="+" @click="cellClick('+')">+</el-button>
              </el-tooltip></el-col>
            <el-col :span="8" class="rowtop">
              <el-tooltip class="item" effect="dark" :open-delay="500" content="减" placement="bottom">
                <el-button value="-" @click="cellClick('-')">-</el-button>
              </el-tooltip></el-col>
            <el-col :span="7" ::offset="-1" class="rowtop">
              <el-tooltip class="item" effect="dark" :open-delay="500" content="乘" placement="bottom">
                <el-button value="*" @click="cellClick('*')">&times;</el-button>
              </el-tooltip></el-col>
          </el-row>
          <el-row class="rowtop">
            <el-col :span="7" :offset="1">
              <el-tooltip class="item" effect="dark" :open-delay="500" content="除" placement="bottom">
                <el-button value="/" @click="cellClick('/')">&divide;</el-button>
              </el-tooltip></el-col>
            <el-col :span="8">
              <el-tooltip class="item" effect="dark" :open-delay="500" content="左括号" placement="bottom">
                <el-button value="(" @click="cellClick('(')">(</el-button>
              </el-tooltip></el-col>
            <el-col :span="7" ::offset="-1">
              <el-tooltip class="item" effect="dark" :open-delay="500" content="右括号" placement="bottom">
                <el-button value=")" @click="cellClick(')')">)</el-button>
              </el-tooltip></el-col>
          </el-row>
          <el-row class="rowtop">
            <el-col :span="7" :offset="1">
              <el-tooltip class="item" effect="dark" :open-delay="500" content="大于" placement="bottom">
                <el-button value=">" @click="cellClick('>')">&gt;</el-button>
              </el-tooltip></el-col>
            <el-col :span="8">
              <el-tooltip class="item" effect="dark" :open-delay="500" content="小于" placement="bottom">
                <el-button value="<" @click="cellClick('<')">&lt;</el-button>
              </el-tooltip></el-col>
            <el-col :span="7" ::offset="-1">
              <el-tooltip class="item" effect="dark" :open-delay="500" content="等于" placement="bottom">
                <el-button value="=" @click="cellClick('=')">=</el-button>
              </el-tooltip></el-col>
          </el-row>
          <el-row class="rowtop">
            <el-col :span="7" :offset="1">
              <el-tooltip class="item" effect="dark" :open-delay="500" content="不等于" placement="bottom">
                <el-button value="!=" @click="cellClick('!=')">!=</el-button>
              </el-tooltip></el-col>
            <el-col :span="8">
              <el-tooltip class="item" effect="dark" :open-delay="500" content="并" placement="bottom">
                <el-button value="&&" @click="cellClick('&&')">and</el-button>
              </el-tooltip></el-col>
            <el-col :span="7" ::offset="-1">
              <el-tooltip class="item" effect="dark" :open-delay="500" content="或" placement="bottom">
                <el-button value="||" @click="cellClick('||')">or</el-button>
              </el-tooltip></el-col>
          </el-row>
          <el-row class="rowtop">
            <el-col :span="7" :offset="1">
              <el-tooltip class="item" effect="dark" :open-delay="500" content="不是" placement="bottom">
                <el-button value="not" @click="cellClick('not')">not</el-button>
              </el-tooltip></el-col>
            <el-col :span="8">
              <el-tooltip class="item" effect="dark" :open-delay="500" content="类似" placement="bottom">
                <el-button value="like" @click="cellClick('like')">like</el-button>
              </el-tooltip></el-col>
          </el-row>
        </el-col>
        <el-col
          :span="24"
          class="el-edit"
          style=" position: absolute;top:235px;left:0;
white-space: nowrap;"
        >
          <p style="border-bottom:1px solid #CCC">规则表达式</p>
          <el-row>
            <el-col :span="1">
              <el-input
                :disabled="true"
                placeholder="1"
                type="textarea"
                rows="8"
                :autosize="{ minRows: 8, maxRows: 10}"
              />
            </el-col>
            <el-col :span="23">
              <el-input
                v-model="textarea1"
                type="textarea"
                rows="8"
                :autosize="{ minRows: 8, maxRows: 10}"
              />
            </el-col>
          </el-row>
        </el-col>
      </el-row>
      <el-row>
        <div
          class="el-dialog--center"
        >
          <el-button type="primary">验证表达式</el-button>

          <el-button type="primary">确定</el-button>

          <el-button type="primary" @click="closeDialog">取消</el-button>

        </div></el-row>
    </el-dialog>
  </div>
</template>
<script>
export default {
  props: {
    show: Boolean
  },
  data() {
    return {
      centerDialogVisible: false,
      textarea: '',
      textarea1: ''
    }
  },
  // mounted() {
  //   var getBtn = document.getElementById('btn')
  //   alert(getBtn)
  //   // getBtn.onClick = function() {
  //   //   var val = this.value
  //   //   console.log(val)
  //   // }
  // },
  methods: {
    closeDialog() {
      this.$emit('closeDialog')
    },
    cellClick(val) {
      this.textarea1 += val
      console.log(val)
    }
  }
}
</script>
 <style lang="scss" scoped>
 p{
   padding: 0;
   margin: 0
 }
.el-edit {
  border: 1px solid #CCC;

}
.rowtop{
  padding-top: 10px
}
</style>
