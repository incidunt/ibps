<template>
  <div class="pull-auto easyData-contailer">
    <el-row :span="24">
      <template v-for="item in data">
        <el-col :key="item.key" :span="span">
          <div :class="[{'item--easy':discount}]" class="item">
            <div :style="{color:color}" class="item-icon">
              <i :class="item.icon" />
            </div>
            <div class="item-info">
              <span>{{ item.title }}</span>
              <h3 :style="{color:color}">{{ item.count }}</h3>
            </div>
          </div>
        </el-col>
      </template>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'lc-easy-data',
  props: {
    option: {
      type: Object,
      default: function() {
        return {}
      }
    }
  },
  data() {
    return {
      span: this.option.span || 6,
      data: this.option.data,
      color: this.option.color || 'rgb(63, 161, 255)',
      discount: this.option.discount || false
    }
  }
}
</script>

<style lang="scss" scoped>
.item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 80px;
  margin: 0 auto;
}
.item-icon {
  margin-top: 3px;
  margin-right: 8px;
  & > i {
    font-size: 46px !important;
  }
}
.item-info {
  line-height: 25px;
  & > span {
    color: #999;
    font-size: 12px;
  }
}
.item--easy {
  flex-direction: column;
  & > .item-icon {
    margin: 0;
  }
  & > .item-info {
    margin-top: -15px;
    & > span {
      font-size: 14px;
    }
  }
}
</style>
