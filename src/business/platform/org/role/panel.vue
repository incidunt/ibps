<template>
  <ibps-crud
    ref="crud"
    :height="tableHeight"
    :data="listData"
    :toolbars="listConfig.toolbars"
    :search-form="listConfig.searchForm"
    :pk-key="pkKey"
    :columns="listConfig.columns"
    :row-handle="listConfig.rowHandle"
    :pagination="pagination"
    :loading="loading"
    :selection-type="multiple?'checkbox':'radio'"
    @selection-change="handleSelectionChange"
    @action-event="handleAction"
    @sort-change="handleSortChange"
    @pagination-change="handlePaginationChange"
  />
</template>
<script>
import { queryPageList, queryWithGrade } from '@/api/platform/org/role'
import { findAllSubsystem } from '@/api/platform/auth/subsystem'
import ActionUtils from '@/utils/action'

export default {
  props: {
    value: [Object, Array],
    isAuth: {
      type: Boolean,
      default: false
    },
    multiple: Boolean,
    height: {
      type: String,
      default: '400px'
    },
    orgId: [String, Number]
  },
  data() {
    return {
      radio: '',
      pkKey: 'id', // 主键  如果主键不是pk需要传主键
      loading: false,
      pagination: {},
      sorts: {},
      listData: [],
      toggleRowSelect: [],
      listConfig: {
        toolbars: [
          {
            key: 'search'
          }
        ],
        searchForm: {
          labelWidth: 90,
          forms: [
            { prop: 'Q^NAME_^SL', label: '角色名', itemWidth: '200' },
            {
              prop: 'Q^SYSTEM_ID_^SL',
              label: '子系统名称',
              fieldType: 'select',
              valueKey: 'id',
              labelKey: 'name',
              resultField: 'data',
              selectFetch: findAllSubsystem,
              itemWidth: '200'
            }
          ]
        },
        // 表格字段配置
        columns: [
          { prop: 'name', label: '角色名' },
          { prop: 'roleAlias', label: '角色别名' },
          { prop: 'subSystemName', label: '子系统名称' }
        ]
      }
    }
  },
  computed: {
    tableHeight() {
      const h = this.height.substr(0, this.height.length - 2)
      return parseInt(h) - 10
    }
  },
  watch: {
    value(val, oldVal) {

    }
  },
  created() {
    this.loadData()
  },
  methods: {
    toggleRowSelection(row, selected) {
      this.$refs['crud'].toggleRowSelection(row, selected)
      this.toggleRowSelect = [...this.$refs['crud'].$selections]
    },
    // 加载数据
    loadData() {
      this.loading = true
      if (this.isAuth) {
        queryWithGrade(this.getSearcFormData()).then(response => {
          ActionUtils.handleListData(this, response.data)
          this.loading = false
        }).catch(() => {
          this.loading = false
        })
      } else {
        queryPageList(this.getSearcFormData()).then(response => {
          ActionUtils.handleListData(this, response.data)
          this.loading = false
        }).catch(() => {
          this.loading = false
        })
      }
    },
    /**
     * 获取格式化参数
     */
    getSearcFormData() {
      const params = this.$refs['crud'] ? this.$refs['crud'].getSearcFormData() : {}
      if (this.isAuth) {
        const obj = {
          partyType: 'org',
          partyId: this.orgId
        }
        Object.assign(params, obj)
      }
      this.$emit('selected', this.toggleRowSelect)
      return ActionUtils.formatParams(
        params,
        this.pagination,
        this.sorts)
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
    /**
     * 查询
     */
    search() {
      ActionUtils.setPagination(this.pagination)
      ActionUtils.setSorts(this.sorts)
      this.loadData()
    },
    /**
     * 处理按钮事件
     */
    handleAction(command, position, selection, data) {
      switch (command) {
        case 'search':// 查询
          this.loadData()
          break
        default:
          break
      }
    },
    handleSelectionChange(selection) {
      this.toggleRowSelect = JSON.parse(JSON.stringify(selection))
      if (this.multiple) {
        // 是否在原来 列表里面
        const noListData = []
        this.value.forEach((item) => {
          const index = this.listData.find((data) => { return data[this.pkKey] === item[this.pkKey] })
          if (!index) { noListData.push(item) }
        })
        this.$emit('selected', noListData.concat(selection))
      } else {
        this.$emit('selected', selection)
      }
    },
    clearSelection() {
      this.$refs.crud.clearSelection()
    }

  }
}
</script>

