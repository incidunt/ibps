<template>
  <div>
    <div class="panel panel-default">
      <div class="panel-heading">树形</div>
      <div class="panel-body">
        <el-form
          size="mini"
          label-width="120px"
        >
          <el-form-item>
            <template slot="label">初始化是否展开</template>
            <el-switch v-model="attrs.expand" active-value="Y" inactive-value="N" />
          </el-form-item>
        </el-form>
      </div>
    </div>
    <!--查询字段-->
    <!-- <column
      :template="template"
      :fields="fields"
      :default-value="queryDefaultValue"
      title="查询字段"
      prop="query_columns"
      @input="handleColumns"
    >
      <div slot="edit" slot-scope="scope">
        <query-column :data="scope"/>
      </div>
    </column> -->
    <!--显示字段-->
    <!-- <column-tree
      :template="template"
      :fields="fields"
      :default-value="displayDefaultValue"
      title="显示字段"
      prop="display_columns"
      @input="handleColumns"
    /> -->
    <!-- 树形显示字段 -->
    <tree-display-column
      :fields="fields"
      :data="displayTreeDefaultValue"
      @input="handleDisplayColumns"
    />
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
      <div slot="edit" slot-scope="scope">
        <filter-condition :data="scope.data" :fields="fields" />
      </div>
    </column>
    <!--排序字段-->
    <column
      :template="template"
      :fields="fields"
      title="排序字段"
      prop="sort_columns"
      @input="handleColumns"
    />
    <!--返回字段-->
    <column
      :template="template"
      :fields="fields"
      :default-value="resultDefaultValue"
      title="返回字段"
      prop="result_columns"
      @input="handleColumns"
    >
      <div slot="edit" slot-scope="scope">
        <result-column :data="scope.data" />
      </div>
    </column>
    <!--树形-功能按钮-->
    <button-template
      :template="buttons"
      :types="functionTreeButtonTypes"
      :default-value="fucntionButtonDefaultValue"
      title="树形-功能按钮"
      prop="function_buttons"
      @input="handleButtons"
    >
      <div slot="edit" slot-scope="scope">
        <editor-button :data="scope.data" type="function" />
      </div>
    </button-template>

  </div>
</template>
<script>
import { mapState } from 'vuex'
import Column from '../components/column'
// import ColumnTree from '../components/column-tree'
import TreeDisplayColumn from '../components/tree-display-column'
import ButtonTemplate from '../components/button'
// import QueryColumn from '../editors/query-column'
import FilterCondition from '../editors/filter-condition'
import ResultColumn from '../editors/result-column'
import EditorButton from '../editors/editor-button'
import { queryDefaultValue, displayTreeDefaultValue, resultDefaultValue,
  filterConditionDefaultValue, fucntionButtonDefaultValue, functionTreeButtonTypes } from '../constants/default-value'

export default {
  components: {
    Column,
    // ColumnTree,
    TreeDisplayColumn,
    ButtonTemplate,
    // QueryColumn,
    FilterCondition,
    ResultColumn,
    EditorButton
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
      displayTreeDefaultValue,
      resultDefaultValue,
      filterConditionDefaultValue,
      fucntionButtonDefaultValue,
      functionTreeButtonTypes
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
    },
    attrs: {
      get() {
        return this.template.attrs || {}
      },
      set(value) {
        console.info(value)
      }
    },
    buttons() {
      return this.template.buttons || {}
    }
  },
  methods: {
    handleColumns(key, data) {
      const curTemplate = JSON.parse(JSON.stringify(this.template))
      curTemplate[key] = data
      this.$emit('update', curTemplate)
    },
    handleButtons(key, data) {
      const curTemplate = JSON.parse(JSON.stringify(this.template))
      if (!curTemplate.buttons) {
        curTemplate.buttons = {}
      }
      curTemplate.buttons[key] = data
      this.$emit('update', curTemplate)
    },
    handleRights(key) {
      this.dialogRightsVisible = true
    },
    handleRightsConfirm(data) {

    },
    handleDisplayColumns(val) {
      const curTemplate = JSON.parse(JSON.stringify(this.template))
      curTemplate['display_columns'] = val
      this.$emit('update', curTemplate)
    }
  }
}
</script>
