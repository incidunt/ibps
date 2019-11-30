<template>
  <ibps-container type="full" class="page">
    <ibps-query-builder
      ref="queryBuilder"
      v-model="rules"
      :labels="labels"
      :filters="filters"
      :conditions="conditions"
    />
  </ibps-container>

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
        'all': '所有条件',
        'any': '任何一个条件'
      },
      labels: {
        'addRulue': '添加规则',
        'addScript': '添加脚本',
        'addGroup': '添加组',
        'removeRule': '删除规则',
        'removeGroup': '删除组'
      },
      filters: [
        {
          id: 'vegetable',
          input: 'text',
          label: '蔬菜'
        },
        {
          input: 'radio',
          id: 'fruit',
          label: '水果',
          values: [
            { label: 'Apple', value: 'apple' },
            { label: 'Banana', value: 'banana' }
          ]
        },
        {
          input: 'select',
          id: 'fruit2',
          label: '水果2',
          values: [
            { label: 'Apple', value: 'apple' },
            { label: 'Banana', value: 'banana' }
          ]
        },
        {
          id: 'createDate',
          type: 'datetime',
          input: 'date',
          label: '创建时间'
        },
        {
          id: 'custom',
          input: 'custom',
          component: 'el-slider',
          label: '自定义',
          attrs: {
            'min': 5,
            'max': 20
          },
          operators: ['equal', 'not_equal']
        }
      ],

      rules: {
        'condition': 'all',
        'rules': [{
          'id': 'fruit',
          'operator': 'equal',
          'value': 'banana'
        },
        {
          'id': 'custom',
          'operator': 'equal',
          'value': 10
        },
        {
          'condition': 'all',
          'rules': [{
            'id': 'vegetable',
            'operator': 'equal',
            'value': null
          }]
        }]
      }
    }
  },
  watch: {
    rules() {
      console.info(this.rules)
    }
  }
}
</script>
<style lang="scss">
  .query-builder{
    .rule-value-container .el-slider{
      width: 200px;
      padding-left: 10px;
      height: 32px;
    }
  }
</style>

