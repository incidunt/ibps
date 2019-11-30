<template>
  <div
    class="ibps-contentmenu-list"
    @click="rowClick"
  >
    <div
      v-for="(item,index) in list"
      :key="index"
      :data-value="item.value"
      :class="{
        'ibps-contentmenu-divided': item.type==='divided',
        'ibps-contentmenu-item': item.type!=='divided'
      }"
      flex="cross:center main:center"
    >
      <template v-if="item.type!=='divided'">
        <ibps-icon
          v-if="item.icon"
          :name="item.icon"
        />
        <div
          class="ibps-contentmenu-item-label"
          flex-box="1"
        >
          {{ item.label }}
        </div>
      </template>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ibps-contextmenu-list',
  props: {
    menulist: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      list: []
    }
  },
  watch: {
    menulist(value) {
      this.list = value
    }
  },
  methods: {
    rowClick(event) {
      let target = event.target
      if (target && target.dataset) {
        while (!target.dataset.value) {
          target = target.parentNode
        }
        this.$emit('row-click', target && target.dataset ? target.dataset.value : '')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.ibps-contentmenu-list {
  .ibps-contentmenu-item {
    padding: 8px 20px 8px 15px;
    margin: 0;
    font-size: 14px;
    color: #606266;
    cursor: pointer;
    &:hover {
      background: #ecf5ff;
      color: #66b1ff;
    }
    .ibps-contentmenu-item-label {
      margin-left: 5px
    }

  }
   .ibps-contentmenu-divided{
      background-color: #e5e5e5;
      height: 1px;
      margin: 5px 0;
    }
}
</style>
