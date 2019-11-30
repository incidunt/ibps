<template>
  <div>
    <ibps-crud
      v-if="listConfig"
      ref="crud"
      :data="listData"
      :toolbars="listConfig.toolbars"
      :pk-key="pkKey"
      :search-form="listConfig.searchForm"
      :columns="listConfig.columns"
      :row-handle="listConfig.rowHandle"
      :pagination="pagination"
      :show-pagination="showPagination"
      :height="tableHeight"
      :index-row="indexRow"
      :loading="loading"
      :selection-type="selectionType"
      @selection-change="handleSelectionChange"
      @action-event="handleAction"
      @sort-change="handleSortChange"
      @pagination-change="handlePaginationChange"
    >
      <!--自定义查询条件-->
      <template v-slot:searchForm>
        <search-form
          v-if="listConfig.searchForm"
          ref="searchForm"
          :forms="listConfig.searchForm.forms||[]"
          :size="listConfig.searchForm.size"
          :fuzzy="listConfig.searchForm.fuzzy"
          :inline="listConfig.searchForm.inline"
          :label-width="listConfig.searchForm.labelWidth"
          :item-width="listConfig.searchForm.itemWidth"
        />
      </template>

      <template v-slot:number="{value,column}">
        {{ value |filterNumber(column.field_options) }}
      </template>
      <template v-slot:editor="{value}">
        <span v-html="value" />
      </template>
      <template v-slot:dictionary="{value,column}">
        <template v-if="$utils.isNotEmpty(column)">
          <ibps-dictionary
            v-model="value"
            :type-key="column.field_options.dictionary"
            :multiple="column.field_options.multiple"
            :readonly="true"
          />
        </template>
      </template>
      <!--附件-->
      <template v-slot:attachment="{value,column}">
        <ibps-attachment
          v-model="value"
          :download="column.field_options.download||true"
          :readonly="true"
        />
      </template>
      <!--选择器-->
      <template v-slot:selector="{value,column}">
        <template v-if="$utils.isNotEmpty(column)">
          <ibps-user-selector
            v-model="value"
            :type="column.field_options.selector_type||'user'"
            :multiple="column.field_options.multiple||true"
            :store="column.field_options.store||'id'"
            :disabled="true"
            placeholder=""
            readonly-text="text"
          />
        </template>
      </template>
      <!--自定义对话框-->
      <template v-slot:customDialog="{value,column,row}">
        <template v-if="$utils.isNotEmpty(column)">
          <ibps-custom-dialog
            v-model="value"
            :template-key="column.field_options.dialog"
            :multiple="column.field_options.multiple === 'Y'"
            :placeholder="column.field_options.placeholder"
            :store="column.field_options.store"
            :icon="column.field_options.icon?'ibps-icon-'+column.field_options.icon:''"
            :type="column.field_options.dialog_type"
            :dynamic-params="getDynamicparams(column.field_options,row)"
            readonly-text="text"
            :disabled="true"
          />
        </template>
      </template>
      <!--联动数据-->
      <template v-slot:linkdata="{value,column,row}">
        <template v-if="$utils.isNotEmpty(column)">
          <ibps-link-data
            v-model="value"
            :dynamic-params="getDynamicparams(column.field_options,row)"
            :template-key="column.field_options.linkdata"
            :multiple="column.field_options.multiple === 'Y'"
            :readonly="true"
          />
        </template>
      </template>

      <template v-slot:address="{value,column}">
        <template v-if="$utils.isNotEmpty(column)">
          <ibps-address
            :value="getAddressValue(value,column.field_options)"
            :size="column.field_options.size"
            :top="column.field_options.top || 'country'"
            :top-val="getAddressTopVal(column.field_options)"
            :level="column.field_options.level||'district'"
            data-type="code"
            :disabled="true"
            readonly-text="text"
          />
          <span v-if="column.field_options.is_street">{{ getStreet(value) }}</span>
        </template>
      </template>

    </ibps-crud>
    <data-template-formrender-dialog
      :visible="dialogFormVisible"
      :form-key="formKey"
      :pk-value="pkValue"
      :toolbars="editToolbars"
      :readonly="readonly"
      @callback="search"
      @close="visible => dialogFormVisible = visible"
    />
  </div>
</template>
<script>
import { queryDataTable, removeFormData } from '@/api/platform/data/dataTemplate'
import Utils from '@/utils/util'
import ActionUtils from '@/utils/action'
import { hasButton, hasSearchPermission } from '@/business/platform/data/constants/buttons'
import FormUtils from '@/business/platform/form/utils/formUtil'
import { numFormat, numberCurrency, numberPercent, parseNumber } from '@/business/platform/form/utils/number'
import buttonsConstants from '@/business/platform/data/constants/buttons'
import SearchForm from '../../components/search-form/index.vue'
import DataTemplateFormrenderDialog from '../form/index.vue'
import IbpsDictionary from '@/business/platform/cat/dictionary/select'
import IbpsAttachment from '@/business/platform/file/attachment/selector'
import IbpsUserSelector from '@/business/platform/org/selector'
import IbpsCustomDialog from '@/business/platform/data/templaterender/custom-dialog'
import IbpsLinkData from '@/business/platform/data/templaterender/link-data'
import IbpsAddress from '@/components/ibps-address/cascader'
import FormOptions from '@/business/platform/form/constants/formOptions'

export default {
  components: {
    DataTemplateFormrenderDialog,
    SearchForm,
    IbpsDictionary,
    IbpsAttachment,
    IbpsUserSelector,
    IbpsCustomDialog,
    IbpsLinkData,
    IbpsAddress
  },
  filters: {
    filterNumber(data, fieldOptions = {}) {
      if (Utils.isEmpty(data)) return data
      const value = Number(data)
      if (isNaN(value)) return data
      const type = fieldOptions.number_type || 'orig'
      if (type === 'orig') {
        return value
      } else if (type === 'integer') {
        const val = parseInt(value, 10)
        if (fieldOptions.number_format === 'thousands') {
          return numFormat(val)
        } else if (fieldOptions.number_format === 'capital') {
          return numberCurrency(val)
        } else if (fieldOptions.number_format === 'percent') {
          return numberPercent(val)
        } else {
          return val
        }
      } else if (type === 'number') {
        const val = parseNumber(value, fieldOptions.decimal_places, fieldOptions.decimal_scale)
        if (fieldOptions.number_format === 'thousands') {
          return numFormat(val)
        } else if (fieldOptions.number_format === 'capital') {
          return numberCurrency(val)
        } else if (fieldOptions.number_format === 'percent') {
          return numberPercent(val)
        }
        return val
      } else if (type === 'currency') {
        let val = parseNumber(value, fieldOptions.decimal_places, fieldOptions.decimal_scale)
        if (fieldOptions.number_format === 'thousands') {
          val = numFormat(val)
        } else if (fieldOptions.number_format === 'capital') {
          val = numberCurrency(val)
        } else if (fieldOptions.number_format === 'percent') {
          val = numberPercent(val)
        }
        return (fieldOptions.prefix || '') + (val) + (fieldOptions.suffix || '')
      } else {
        return value
      }
    }
  },
  props: {
    dataTemplate: Object,
    dynamicParams: Object,
    template: Object,
    value: [String, Number, Array, Object],
    multiple: Boolean,
    height: [String, Number],
    fields: Object
  },
  data() {
    return {
      tableHeight: document.body.clientHeight,
      listData: [],
      indexRow: false,
      listConfig: {
        // 工具栏
        toolbars: [],
        columns: [],
        searchForm: null,
        rowHandle: null
      },
      pagination: {
        page: 1,
        limit: 20
      },
      showPagination: false,
      sorts: {},
      loading: false,

      pkValue: '',
      readonly: false,
      dialogFormVisible: false,
      editButtons: [], // 表单按钮
      editToolbars: [],
      filterConditionKey: ''
    }
  },
  computed: {
    selectionType() {
      return this.multiple ? 'checkbox' : 'radio'
    },
    pkKey() {
      return this.dataTemplate.unique || 'id_'
    },
    formKey() {
      return this.dataTemplate.attrs ? this.dataTemplate.attrs.form_key || '' : ''
    }
  },
  watch: {
    template: {
      handler(val, oldVal) {
        if (!this.template) { return }
        this.listConfig = null
        this.initParameter()
        this.initData()
      },
      immediate: true
    },
    height: {
      handler(val, oldVal) {
        if (this.$utils.isNotEmpty(val)) {
          this.tableHeight = val
        } else {
          this.tableHeight = document.body.clientHeight
        }
      },
      immediate: true
    }
  },
  created() {
    this.initData()
  },
  methods: {
    getDynamicparams(fieldOptions, row) {
      const conditions = fieldOptions['link_condition'] ? fieldOptions['link_condition'] : []
      if (this.$utils.isEmpty(conditions)) { return {} }
      const dynamicParams = {}
      for (let i = 0; i < conditions.length; i++) {
        const condition = conditions[i]
        let val = condition.value
        if (condition.mode === 'bind') { // 绑定表单
          val = row[condition.value]
        }
        dynamicParams[condition.fieldName] = val || ''
      }
      return dynamicParams
    },
    initData() {
    // 是否初始化查询数据
      if (this.template && this.template.attrs && this.template.attrs.init_query === 'N') {
        this.listData = []
        return
      }
      this.loadData()
    },
    clearSelection() {
      this.$refs['crud'].clearSelection()
      this.$emit('selected', this.multiple ? [] : '')
    },
    handleSelectionChange(selection) {
      if (this.multiple) {
        // 是否在原来 列表里面
        const noListData = []
        if (this.$utils.isNotEmpty(this.value)) {
          this.value.forEach((item) => {
            const index = this.listData.find((data) => { return data[this.pkKey] === item[this.pkKey] })
            if (!index) { noListData.push(item) }
          })
        }
        this.$emit('selected', noListData.concat(selection))
      } else {
        this.$emit('selected', selection)
      }
    },
    /**
     * 加载数据
     */
    loadData() {
      this.loading = true
      queryDataTable(this.getFormatParams()).then(response => {
        this.loading = false
        ActionUtils.handleListData(this, response.data)
      }).catch(() => {
        this.loading = false
      })
    },
    /**
     * 获取格式化参数
     */
    getFormatParams() {
      let formParams = {}
      if (this.$refs['searchForm']) {
        formParams = this.$refs['searchForm'].getSearcFormData() || {}
      }
      const responseData = JSON.parse(JSON.stringify(this.template))
      responseData.datasetKey = this.dataTemplate.datasetKey
      responseData.unique = this.pkKey
      responseData['dynamic_params'] = this.dynamicParams
      formParams['response_data'] = JSON.stringify(responseData)
      formParams['filter_condition_key'] = this.filterConditionKey
      return ActionUtils.formatParams(formParams, this.pagination, this.sorts)
    },
    /**
     * 处理分页事件
     */
    handlePaginationChange(page) {
      ActionUtils.setSorts(this.sorts)
      ActionUtils.setPagination(this.pagination, page)
      this.loadData()
    },
    /**
     * 处理排序
     */
    handleSortChange(sort) {
      ActionUtils.setSorts(this.sorts, sort)
      ActionUtils.setPagination(this.pagination)
      this.loadData()
    },
    search() {
      ActionUtils.setPagination(this.pagination)
      ActionUtils.setSorts(this.sorts)
      this.loadData()
    },
    handleAction(command, position, selection, data) {
      this.readonly = false
      switch (command) {
        case 'search':// 查询
          this.search()
          break
        case 'resetSearch': // 重置
          this.$refs['searchForm'] ? this.$refs['searchForm'].resetSearchForm() : null
          break
        case 'add':// 添加
          this.handleEdit(null, 'edit')
          break
        case 'edit':// 编辑
        case 'detail':// 明细
          ActionUtils.selectedRecord(selection).then((id) => {
            this.handleEdit(id, command)
          }).catch(() => { })
          break
        case 'remove':// 删除
          ActionUtils.removeRecord(selection).then((ids) => {
            this.handleRemove(ids)
          }).catch(() => { })
          break

        case 'custom':// 自定义按钮
          // TODO: 自定义按钮事件
          break
        default:
          break
      }
    },
    initParameter() {
      const functionButtons = this.template.buttons ? this.template.buttons.function_buttons || [] : []
      // 工具栏
      const toolbarButtons = []
      // 管理列
      const manageButtons = []

      // 功能按钮
      functionButtons.forEach(rf => {
        const btn = this.buildButton(rf)
        // 查询列默认是顶部
        if (hasSearchPermission(rf.button_type) && !rf.position) {
          rf.position = 'toolbar'
        }
        // if (rf.button_type === 'search') { isHasSeach = true }
        // 顶部按钮
        if (hasButton(rf.button_type, 'toolbar', rf.position)) {
          toolbarButtons.push(btn)
        }
        // // 查询按钮
        // if (hasButton(rf.button_type, 'search', rf.position)) {
        //   this.response_search_buttons.add(this.getButtonModel(rf))
        // }

        // 管理列按钮
        if (hasButton(rf.button_type, 'manage', rf.position)) {
          manageButtons.push(btn)
        }
      })
      let rowHandle = null

      if (this.$utils.isNotEmpty(manageButtons)) {
        rowHandle = {
          actions: manageButtons
        }
      }

      // 查询字段
      const searchForms = []
      this.setQueryColumns(this.template.query_columns || [], searchForms)

      // 显示字段
      const columns = []

      this.setDisplayColumns(this.template.display_columns || [], columns)

      this.listConfig = {
        toolbars: toolbarButtons,
        columns: columns,
        rowHandle: rowHandle,
        searchForm: searchForms.length > 0 ? {
          forms: searchForms
        } : null
      }
      // 分页
      this.showPagination = this.template.attrs ? this.template.attrs.need_page === 'Y' : true
      this.pagination.limit = this.template.attrs ? parseInt(this.template.attrs.page_size, 10) || 20 : 20

      this.indexRow = this.template.attrs ? this.template.attrs.indexRow || false : false
      this.editButtons = this.template.buttons ? this.template.buttons.edit_buttons || [] : []
    },
    setQueryColumns(queryColumns, columns) {
      queryColumns.forEach(column => {
        const field = this.convertField(column)
        if (field.common === 'N') return
        columns.push(this.buildSearchForm(field))
      })
      return columns
    },
    /**
     * 显示字段
     */
    setDisplayColumns(displayColumns, columns) {
      displayColumns.forEach(column => {
        const field = this.convertField(column)
        if (field['field_type'] !== 'hidden') {
          columns.push(this.buildDisplayColumn(field))
        }
      })
      return columns
    },

    /**
   * 判断参数是否是其中之一
   */
    oneOf: function(obj, validList, key, key1) {
      for (let i = 0; i < validList.length; i++) {
        if (obj[key] === validList[i][key1]) {
          return true
        }
      }
      return false
    },
    /**
     * 构建按钮
     */
    buildButton(rf) {
      const defaultButton = buttonsConstants[rf.button_type] || {}
      return {
        key: rf.button_type,
        label: rf.label || defaultButton.style,
        icon: rf.icon ? 'ibps-icon-' + rf.icon : defaultButton.icon,
        type: rf.style || defaultButton.type
      }
    },
    /**
     * 转换字段
     */
    convertField: function(column) {
      const field = this.fields[column.name] || null
      const	same = !((column['same'] && column['same'] === 'N'))
      let	fieldType = same ? (field ? (field['field_type'] || 'text') : 'text') : column['field_type'] || 'text'
      const	fieldOptions = same ? (field ? (field['field_options'] || {}) : {}) : (column['field_options'] || {})
      const	dataType = field ? field['type'] || 'varchar' : 'varchar'
      // 字段是日期类型
      if ((dataType === 'date' || dataType === 'timestamp' || dataType === 'datetime' || dataType === 'currentTime' || dataType === 'currentDate') &&
       (fieldType !== 'datePicker' && fieldType !== 'dateRange')) {
        fieldType = 'datePicker'
      }
      if (fieldType === 'datePicker' || fieldType === 'dateRange') {
        const datefmtType = fieldOptions['datefmt_type']
        if (datefmtType !== 'custom') {
          fieldOptions['datefmt'] = FormOptions.t.DATE_FORMATS[datefmtType] || 'yyyy-MM-dd HH:mm:ss'
        }
      }

      // 处理当前用户，当前组织控件
      if (fieldType === 'currentUser' || fieldType === 'currentOrg') {
        fieldType = 'selector'
      }

      column['field_type'] = fieldType
      column['field_options'] = fieldOptions
      column['data_type'] = dataType
      return column
    },
    buildOptions(options = []) {
      const rtn = []
      options.forEach(option => {
        rtn.push({
          value: option.val,
          label: option.label
        })
      })
      return rtn
    },
    /**
     * 构建查询条件
     */
    buildSearchForm(field) {
      let querySuffix = 'SL'
      if (field['data_type'] === 'number') {
        querySuffix = 'N'
      }
      let searchColumn = {
        label: field.label
      }
      // 控件类型
      const fieldType = field['field_type']
      const fieldOptions = field['field_options']
      if (fieldType === 'hidden') {
        searchColumn = Object.assign(searchColumn, {
          prop: `Q^${field.name}^${querySuffix}`,
          modelValue: `Q^${field.name}^${querySuffix}`,
          fieldType: fieldType
        })
      } else if (fieldType === 'radio' || fieldType === 'checkbox' || fieldType === 'select') {
        querySuffix = fieldType !== 'checkbox' ? 'S' : 'SL'
        const prop = `Q^${field.name}^${querySuffix}`
        searchColumn = Object.assign(searchColumn, {
          prop: prop,
          modelValue: prop,
          fieldType: 'select',
          options: this.buildOptions(fieldOptions && fieldOptions.options ? fieldOptions.options : [])
        })
      } else if (fieldType === 'date') {
        const prop = `Q^${field.name}^D`
        searchColumn = Object.assign(searchColumn, {
          prop: prop,
          modelValue: prop,
          fieldType: 'date',
          dateType: fieldOptions.datefmt_type ? fieldOptions.datefmt_type : 'date'
        })
      } else if (fieldType === 'datePicker' || fieldType === 'daterange' || fieldType === 'dateRange') {
        searchColumn = Object.assign(searchColumn, {
          prop: [`Q^${field.name}^DL`, `Q^${field.name}^DG`],
          modelValue: `Q^${field.name}^${querySuffix}`,
          fieldType: 'daterange'
        })
      } else if (fieldType === 'dictionary') {
        const prop = `Q^${field.name}^SL`
        searchColumn = Object.assign(searchColumn, {
          prop: prop,
          fieldType: fieldType,
          modelValue: prop,
          placeholder: fieldOptions.placeholder || '请选择',
          field_options: fieldOptions
        })
      } else if (fieldType === 'selector') {
        const prop = `Q^${field.name}^SL`
        searchColumn = Object.assign(searchColumn, {
          prop: prop,
          fieldType: fieldType,
          modelValue: prop,
          placeholder: fieldOptions.placeholder || '请选择',
          selectorType: fieldOptions.selector_type || 'user',
          field_options: fieldOptions
        })
      } else if (fieldType === 'customDialog') {
        const prop = `Q^${field.name}^S`
        searchColumn = Object.assign(searchColumn, {
          prop: prop,
          modelValue: prop,
          fieldType: fieldType,
          field_options: fieldOptions
        })
      } else if (fieldType === 'linkdata') {
        const prop = `Q^${field.name}^S`
        searchColumn = Object.assign(searchColumn, {
          prop: prop,
          modelValue: prop,
          fieldType: fieldType,
          field_options: fieldOptions
        })
      } else if (fieldType === 'address') {
        const prop = `Q^${field.name}^S`
        searchColumn = Object.assign(searchColumn, {
          prop: prop,
          modelValue: prop,
          fieldType: fieldType,
          field_options: fieldOptions
        })
      } else {
        searchColumn = Object.assign(searchColumn, {
          prop: `Q^${field.name}^${querySuffix}`,
          modelValue: `Q^${field.name}^${querySuffix}`
        })
      }
      return searchColumn
    },
    buildDisplayColumn(field) {
      const displayColumn = {
        prop: field.name,
        label: field.label,
        align: field.align
      }
      if (field.type !== 'clob') {
        displayColumn.sortable = this.$utils.isNotEmpty(field.sortable) ? field.sortable : true
      }
      // 控件类型
      const fieldType = field['field_type']
      const fieldOptions = field['field_options']
      if (fieldType === 'radio' || fieldType === 'checkbox' || fieldType === 'select') {
        displayColumn.options = this.buildOptions(fieldOptions && fieldOptions.options ? fieldOptions.options : [])
        displayColumn.dataType = fieldType === 'checkbox' ? 'stringArray' : null
      } else if (fieldType === 'datePicker' || fieldType === 'daterange' || fieldType === 'dateRange') {
        const datefmt = fieldOptions['datefmt'] ? fieldOptions['datefmt'] : 'yyyy-MM-dd HH:mm:ss'
        displayColumn.dateFormat = datefmt
        displayColumn.origDateFormat = fieldOptions['datefmt_type'] !== 'custom' ? datefmt : 'yyyy-MM-dd HH:mm:ss'
      } else if (fieldType === 'number' ||
          fieldType === 'editor' ||
          fieldType === 'attachment' ||
          fieldType === 'dictionary' ||
          fieldType === 'selector' ||
          fieldType === 'customDialog' ||
          fieldType === 'linkdata' ||
          fieldType === 'address') {
        displayColumn.slotName = fieldType
        displayColumn.field_options = fieldOptions
      }
      return displayColumn
    },
    getStreet(value) {
      if (this.$utils.isNotEmpty(value)) {
        const data = JSON.parse(value)
        return data['street']
      }
      return ''
    },
    getAddressValue(value, fieldOptions) {
      return FormUtils.getAddressControlValue(value, fieldOptions)
    },
    getAddressTopVal(fieldOptions) {
      return FormUtils.getAddressTopVal(fieldOptions)
    },
    /**
     * 添加、编辑表单
     */
    handleEdit(pkValue, action) {
      if (this.$utils.isEmpty(this.formKey)) {
        ActionUtils.warning('请绑定表单')
        return
      }
      this.readonly = action === 'detail'
      const editToolbars = []
      this.editButtons.forEach(rf => {
        const btn = this.buildButton(rf)
        // 编辑页顶部按钮
        if (hasButton(rf.button_type, action, rf.position)) {
          editToolbars.push(btn)
        }
      })
      this.editToolbars = editToolbars
      this.pkValue = pkValue || ''
      this.dialogFormVisible = true
    },
    /**
     * 删除表单
     */
    handleRemove(ids) {
      if (this.$utils.isEmpty(this.formKey)) {
        ActionUtils.warning('请绑定表单')
        return
      }
      removeFormData({
        formKey: this.formKey,
        ids: ids
      }).then(response => {
        ActionUtils.removeSuccessMessage()
        this.search()
      }).catch(() => {
      })
    }
  }
}
</script>

