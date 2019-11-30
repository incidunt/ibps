<template>
  <div class="menu-tools-set-bg-image">
    <div class="title">背景设置</div>
    <div class="items">
      <div class="item">
        <div class="label">背景图
          <el-tooltip content="请上传与纸张长宽比例一致的背景图" placement="bottom" effect="light">
            <i class="ibps-icon ibps-icon-help" />
          </el-tooltip>
        </div>
        <i class="ibps-icon ibps-icon-upload" @click="handle" />
      </div>
      <div class="item">
        <div class="label">打印背景</div>
        <el-switch
          v-model="switchValue"
          :disabled="disabled"
          size="mini"
          active-color="#13ce66"
        />
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      switchValue: false,
      disabled: true
    }
  },
  methods: {
    handle() {
      this.$emit('submit', 1111)
    }
  }
}
</script>
<style  lang="scss">
.menu-tools-set-bg-image{
  .ibps-icon{
    cursor: pointer;
  }
  .title{
    color: #7C7C7C;
    font-size: 12px;
    margin-bottom: 8px;
  }
  .items{
    .item{
      display: flex;
      align-items: center;
      font-size: 12px;
      &:not(:last-of-type){
        margin-bottom: 8px;
      }
      .label{
        flex: 1;
        color: #333;
        .ibps-icon{
          margin-left: 3px;
          color: #dadada;
        }
      }
    }
  }
}

</style>

