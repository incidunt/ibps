<template>
  <div>
    <ibps-tree-select
      v-if="!readonly"
      v-model="selectData"
      :data="treeData"
      :props="props"
      :node-key="pkKey"
      :multiple="multiple"
      :placeholder="placeholder"
      :empty-text="emptyText"
      :clearable="clearable"
      @focus="loadTreeData()"
      @change="onChange"
    />
    <template v-else>
      <template v-if="!initLoading">
        <template v-if="multiple">
          <el-tag v-if="$utils.isNotEmpty(value)">{{ value|optionsFilter(treeDataOptions,'label') }}</el-tag>
        </template>
        <template v-else>
          {{ selectData|optionsFilter(treeDataOptions,'label') }}
        </template>
      </template>
    </template>
  </div>
</template>
<script>
import { getByKey, queryDataTable } from '@/api/platform/data/dataTemplate'
import ActionUtils from '@/utils/action'
import { buildLabelTitle } from '../utils'
// import TreeUtils from '@/utils/tree'

import IbpsTreeSelect from '@/components/ibps-tree-select'

export default {
  components: {
    IbpsTreeSelect
  },
  props: {
    value: {
      type: [String, Number, Array, Object],
      default: ''
    },
    templateKey: {// 数据模版key
      type: String
    },
    dynamicParams: {// 动态参数
      type: Object
    },
    data: {
      type: Array
    },
    multiple: { // 是否多选
      type: Boolean,
      default: false
    },
    valueKey: { // 值key
      type: String
    },
    labelKey: { // 文本key
      type: [String, Function]
    },
    readonly: { // 是否只读
      type: Boolean,
      default: false
    },
    placeholder: {// 输入框占位文本
      type: String,
      default: '请选择'
    },
    emptyText: {
      type: String,
      default: '暂无数据'
    },
    store: {// 存储类型 对应[多选]有效，array 数组。string 字符串类型
      type: String,
      default: 'string',
      validator: function(value) {
        return ['array', 'string'].indexOf(value) !== -1
      }
    },
    storeSeparator: {// 存储值分割符，对于设置字符串类型的分隔符
      type: String,
      default: ','
    },
    clearable: {
      type: Boolean,
      default: true
    },
    disabled: { // 禁用
      type: Boolean,
      default: false
    },
    readonlyText: { // 只读样式
      type: String,
      default: 'text'
    }
  },
  data: function() {
    return {
      dataTemplate: {},
      template: {},
      loading: false,
      initLoading: false,
      pkKey: this.valueKey,
      props: {
        children: 'children',
        label: this.labelKey
      },
      selectData: null,
      treeData: [],
      treeDataOptions: []
    }
  },
  watch: {
    selectData(val, oldVal) {
      this.$emit('input', this.getStoreValue(val))
    },
    value: {
      handler(val, oldVal) {
        this.initData()
      },
      immediate: true
    },
    labelKey: {
      handler(val, oldVal) {
        if (val !== oldVal && val) {
          this.props.label = this.labelKey
        }
      },
      immediate: true
    },
    valueKey: {
      handler(val, oldVal) {
        if (val !== oldVal && val) {
          this.pkKey = this.valueKey
        }
      },
      immediate: true
    }
  },
  created() {
    this.loadData()
  },
  methods: {
    loadData() {
      this.loading = true
      getByKey({
        dataTemplateKey: this.templateKey
      }).then(response => {
        this.loading = false
        this.dataTemplate = this.$utils.parseData(response.data)
        this.template = this.dataTemplate.templates[0]
        this.initDataTemplate()
        this.loadTreeData(true)
      }).catch(() => {
        this.loading = false
      })
    },
    initDataTemplate() {
      if (this.$utils.isEmpty(this.valueKey)) {
        this.pkKey = this.dataTemplate.unique || 'id_'
      }
      if (this.$utils.isEmpty(this.labelKey)) {
        this.props.label = buildLabelTitle(this.dataTemplate)
      }
    },
    loadTreeData(init = false) {
      if (init) {
        this.initLoading = true
      }
      queryDataTable(this.getFormatParams()).then(response => {
        const data = response.data
        this.treeData = data.dataResult || []
        this.treeDataOptions = this.treeData.map(item => {
          return {
            value: item[this.pkKey ],
            label: item[ this.props.label]
          }
        })
        if (init) {
          this.initLoading = false
          this.initData()
        }
      }).catch(() => {
        this.loading = false
        this.initLoading = false
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
      responseData.unique = this.valueKey
      responseData['key'] = this.templateKey
      responseData['dynamic_params'] = this.dynamicParams
      formParams['response_data'] = JSON.stringify(responseData)
      formParams['filter_condition_key'] = this.filterConditionKey
      return ActionUtils.formatParams(formParams)
    },
    initData() {
      if (this.multiple) {
        this.selectData = this.getArrayValue()
      } else {
        this.selectData = this.value
      }
    },
    getArrayValue() {
      if (this.store === 'string') {
        return this.$utils.isNotEmpty(this.value) ? this.value.split(this.storeSeparator) : []
      } else {
        return this.value || []
      }
    },
    getStoreValue(val) {
      if (this.multiple) {
        if (this.store === 'string') {
          return this.$utils.isNotEmpty(val) ? val.join(this.storeSeparator) : ''
        } else {
          return val || []
        }
      } else {
        return val
      }
    },
    onChange(val, data) {
      this.$emit('change', val, data ? data.data || {} : {})
    }
  }

}
</script>

