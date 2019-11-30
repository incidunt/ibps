<template>
  <fieldset class="scheduler-border">
    <legend style=" width: 90px;border-bottom:0;margin-bottom:10px;">
      <span :style="'marginLeft:8px;font-size:18px;'">规则设置</span>
    </legend>
    <ibps-query-builder
      ref="queryBuilder"
      v-model="rules"
      :filters="filters"
      :conditions="conditions"
    />
  </fieldset>
</template>
<script>
import IbpsQueryBuilder from '@/components/ibps-query-builder'

export default {
  components: {
    IbpsQueryBuilder
  },
  data() {
    return {
      conditions: {
        'and': '并且',
        'or': '或者'
      },
      filters: [{
        id: 'vegetable',
        input: 'text',
        label: '蔬菜'
      }],
      rules: {
        'condition': 'and',
        'rules': []
      }
    }
  }
}
</script>
<style lang="scss">
  .scheduler-border {
      border: 1px groove #ddd !important;
      padding: 0 0.4em 1.4em 0.4em !important;
      margin-bottom: 10px;
  }

</style>

