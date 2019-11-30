<template>
  <div class="value-source">
    <div class="data-table">
      <div class="no-column">
        <span
          :class="{
            required:!hasResultColumn
          }"
        >值来源【{{ hasResultColumn?'已设置返回值':'未设置返回值' }}】</span></div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    template: Object
  },
  data() {
    return {
      width: document.body.clientWidth - 570,
      data: [],
      pkKey: 'id'

    }
  },
  computed: {
    hasResultColumn() {
      return this.template && this.template.result_columns && this.template.result_columns.length > 0
    }
  },
  watch: {
    template: {
      handler(val, oldVal) {
        console.info(val)
      },
      immediate: true
    }
  }
}
</script>
<style lang="scss" scoped>
.value-source{

    border-top: 1px dashed transparent;
    border-bottom: 1px dashed transparent;
    position: relative;
    padding: 5px 10px;
.data-table {
    overflow: auto;
    overflow-y: hidden;
    background-color: #fff;
    max-height: 220px;
    border: 1px solid #ddd;
    min-height: 115px;
    .no-column{
      color: #999;
      text-align: center;
      padding-top: 40px;
      .required{
        color: #FF3824;
      }
    }
}

}

</style>
