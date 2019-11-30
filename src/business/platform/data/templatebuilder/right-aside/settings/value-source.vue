<template>
  <div>
    <div class="panel panel-default">
      <div class="panel-heading">值来源</div>
      <div class="panel-body" />
    </div>
    <!--查询字段-->
    <column
      :template="template"
      :fields="fields"
      :default-value="queryDefaultValue"
      title="查询字段"
      prop="query_columns"
      @input="handleColumns"
    >
      <template slot="edit" slot-scope="scope">
        <query-column :data="scope.data" />
      </template>
    </column>
    <!--过滤条件-->
    <column
      :template="template"
      :fields="fields"
      :default-value="filterConditionDefaultValue"
      title="过滤条件"
      prop="filter_conditions"
      width="80%"
      @input="handleColumns"
    >
      <template slot="edit" slot-scope="scope">
        <filter-condition :data="scope.data" :fields="fields" />
      </template>
    </column>

    <!--返回字段-->
    <column
      :template="template"
      :fields="fields"
      title="返回字段"
      :default-value="resultDefaultValue"
      prop="result_columns"
      @input="handleColumns"
    >
      <template slot="edit" slot-scope="scope">
        <result-column :data="scope.data" />
      </template>
    </column>
    <!--排序字段-->
    <column
      :template="template"
      :fields="fields"
      title="排序字段"
      prop="sort_columns"
      @input="handleColumns"
    />
  </div>
</template>
<script>
import { mapState } from 'vuex'
import Column from '../components/column'
import QueryColumn from '../editors/query-column'
import FilterCondition from '../editors/filter-condition'
import ResultColumn from '../editors/result-column'
import { queryDefaultValue, resultDefaultValue, filterConditionDefaultValue } from '../constants/default-value'

export default {
  components: {
    Column,
    QueryColumn,
    FilterCondition,
    ResultColumn
  },
  props: {
    template: { // 模版
      type: [Object, Array],
      default: () => {}
    }
  },
  data() {
    return {
      dialogRightsVisible: false,
      queryDefaultValue,
      filterConditionDefaultValue,
      resultDefaultValue
    }
  },
  computed: {
    ...mapState({
      datasets: state => state.ibps.dataTemplate.datasets
    }),
    fields() {
      const fields = JSON.parse(JSON.stringify(this.datasets))
      return fields.filter((d) => {
        return d.parentId !== '0'
      })
    }
  },
  methods: {
    handleColumns(key, data) {
      const curTemplate = JSON.parse(JSON.stringify(this.template))
      curTemplate[key] = data
      this.$emit('update', curTemplate)
    },
    handleRights(key) {
      this.dialogRightsVisible = true
    },
    handleRightsConfirm(data) {

    }
  }
}
</script>
