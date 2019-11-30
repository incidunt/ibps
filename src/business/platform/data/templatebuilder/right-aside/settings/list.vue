<template>
  <div>
    <div class="panel panel-default">
      <div class="panel-heading">列表</div>
      <div class="panel-body">
        <list-attr
          :data="template"
          @input="handleAttrs"
        />
      </div>
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
    <!--显示字段-->
    <column
      :template="template"
      :fields="fields"
      :default-value="displayDefaultValue"
      title="显示字段"
      prop="display_columns"
      @input="handleColumns"
    >
      <template slot="edit" slot-scope="scope">
        <display-column :data="scope.data" />
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
      title="返回字段"
      :default-value="resultDefaultValue"
      prop="result_columns"
      @input="handleColumns"
    >
      <template slot="edit" slot-scope="scope">
        <result-column :data="scope.data" />
      </template>
    </column>
    <!--列表-功能按钮-->
    <button-template
      :template="buttons"
      :types="functionListButtonTypes"
      :default-value="fucntionButtonDefaultValue"
      title="列表-功能按钮"
      prop="function_buttons"
      @input="handleButtons"
    >
      <template slot="edit" slot-scope="scope">
        <editor-button :data="scope.data" type="function" />
      </template>
    </button-template>
    <!--编辑页-功能按钮-->
    <button-template
      :template="buttons"
      :types="editButtonTypes"
      title="编辑页-功能按钮"
      prop="edit_buttons"
      @input="handleButtons"
    >
      <template slot="edit" slot-scope="scope">
        <editor-button :data="scope.data" type="edit" />
      </template>
    </button-template>
    <!-- 扩展属性 -->
    <ext-attrs
      :data="template"
      :fields="fields"
      @input="handleAttrs"
    />
  </div>
</template>
<script>
import { mapState } from 'vuex'
import ListAttr from '../components/list-attr'
import Column from '../components/column'
import ButtonTemplate from '../components/button'
import QueryColumn from '../editors/query-column'
import DisplayColumn from '../editors/display-column'
import FilterCondition from '../editors/filter-condition'
import ResultColumn from '../editors/result-column'
import EditorButton from '../editors/editor-button'
import ExtAttrs from '../components/ext-attrs'
import { queryDefaultValue, displayDefaultValue, resultDefaultValue, filterConditionDefaultValue, fucntionButtonDefaultValue, functionListButtonTypes, editButtonTypes } from '../constants/default-value'

export default {
  components: {
    ListAttr,
    Column,
    ButtonTemplate,
    QueryColumn,
    DisplayColumn,
    FilterCondition,
    ResultColumn,
    EditorButton,
    ExtAttrs
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
      displayDefaultValue,
      resultDefaultValue,
      filterConditionDefaultValue,
      fucntionButtonDefaultValue,
      functionListButtonTypes,
      editButtonTypes
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
    buttons() {
      return this.template.buttons || {}
    }
  },
  methods: {
    handleAttrs(key, data) {
      const curTemplate = JSON.parse(JSON.stringify(this.template))
      if (this.$utils.isEmpty(curTemplate.attrs)) {
        curTemplate.attrs = {}
      }
      curTemplate.attrs[key] = data
      this.$emit('update', curTemplate)
    },
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

    }
  }
}
</script>
