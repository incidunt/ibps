<template>
  <div>
    <ibps-crud
      :data="data"
      :toolbars="listConfig.toolbars"
      :search-form="listConfig.searchForm"
      :pk-key="pkKey"
      :columns="listConfig.columns"
      :show-pagination="showPagination"
      :pagination="pagination"
      :index-row="indexRow"
      :height="height"
      :style="{
        width:width+'px'
      }"
    >
      <!--自定义查询条件-->
      <template v-slot:searchForm>
        <search-form
          v-if="listConfig.searchForm && listConfig.searchForm.forms "
          ref="searchForm"
          :forms="listConfig.searchForm.forms||[]"
          :size="listConfig.searchForm.size"
          :fuzzy="listConfig.searchForm.fuzzy"
          :inline="listConfig.searchForm.inline"
          :label-width="listConfig.searchForm.labelWidth"
          :item-width="listConfig.searchForm.itemWidth"
        />
      </template>
    </ibps-crud>
  </div>

</template>
<script>
import SearchForm from '../../../components/search-form/index.vue'
export default {
  components: {
    SearchForm
  },
  props: {
    template: Object
  },
  data() {
    return {
      width: document.body.clientWidth - 570,
      data: [],
      pkKey: 'id',
      indexRow: false,
      height: 350,
      listConfig: {
        // 工具栏
        toolbars: [
          { key: 'search' },
          { key: 'add' },
          { key: 'edit' },
          { key: 'remove' }
        ],
        columns: [],
        searchForm: null,
        rowHandle: {
          actions: [{
            key: 'edit'
          }]
        }
      },
      showPagination: true,
      pagination: {
        page: 1,
        limit: 20
      }
    }
  },
  watch: {
    template: {
      handler(val, oldVal) {
        if (!this.template) { return }

        const toolbarButtons = this.template.buttons ? this.template.buttons.function_buttons || [] : []
        // 工具栏
        const toolbars = []
        toolbarButtons.forEach(button => {
          toolbars.push({
            key: button.button_type,
            label: button.label,
            // position的值有:toolbar manage search eidt all
            hidden: button.position === 'manage' || button.position === 'search' || button.position === 'eidt',
            icon: button.icon ? 'ibps-icon-' + button.icon : '',
            type: button.style,
            disabled: true
          })
        })

        // 显示字段
        const columns = []
        const displayColumns = this.template.display_columns || []
        displayColumns.forEach(column => {
          columns.push({
            prop: column.name,
            label: column.label,
            align: column.align,
            sortable: column.sortable
          })
        })

        // 查询字段
        const searchForms = []
        const queryColumns = this.template.query_columns || []
        queryColumns.forEach(column => {
          const fieldType = column.field_type
          searchForms.push({
            prop: column.name,
            label: column.label,
            fieldType: fieldType,
            options: column.field_options ? column.field_options.options || [] : [],
            modelValue: column.name,
            disabled: true
          })
        })

        this.listConfig = {
          toolbars: toolbars,
          columns: columns
        }
        this.listConfig.searchForm = null
        if (searchForms.length > 0) {
          this.listConfig.searchForm = {
            forms: searchForms
          }
        }

        this.showPagination = this.template.attrs ? this.template.attrs.need_page === 'Y' : true
        // 分页
        this.pagination.limit = this.template.attrs ? parseInt(this.template.attrs.page_size, 10) || 20 : 20

        this.indexRow = this.template.attrs ? this.template.attrs.indexRow || false : false
      },
      deep: true,
      immediate: true
    }
  }
}
</script>

