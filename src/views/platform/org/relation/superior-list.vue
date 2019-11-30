<template>
  <div ref="relation" class="relation-list">
    <ibps-crud
      ref="crud"
      :height="height"
      :data="listData"
      :toolbars="listConfig.toolbars"
      :search-form="listConfig.searchForm"
      :pk-key="pkKey"
      :columns="listConfig.columns"
      :pagination="pagination"
      :loading="loading"
      @action-event="handleAction"
      @sort-change="handleSortChange"
      @pagination-change="handlePaginationChange"
    />
  </div>
</template>

<script>
import { querySuperiorPageList } from '@/api/platform/org/employee'
import ActionUtils from '@/utils/action'
import { statusOptions } from './constants'

export default {
  props: {
    id: [String, Number]
  },
  data() {
    return {
      height: document.clientHeight,
      clientHeight: '',
      loading: false,

      pkKey: 'id', // 主键  如果主键不是pk需要传主键
      listData: [],
      listConfig: {
        toolbars: [
          { key: 'search' }
        ],
        searchForm: {
          forms: [
            {
              prop: 'Q^NAME_^SL', label: '姓名'
            }, {
              prop: 'Q^STATUS_^S',
              label: '员工状态',
              fieldType: 'select',
              options: statusOptions
            }, {
              prop: ['Q^CREATE_TIME_^DL', 'Q^CREATE_TIME_^DG'],
              label: '创建时间',
              fieldType: 'daterange'
            }
          ]
        },
        // 表格配置
        // 表格字段配置
        columns: [
          { prop: 'name', label: '姓名' },
          { prop: 'status', label: '员工状态', tags: statusOptions },
          { prop: 'gender', label: '性别', options: [{
            value: 'male',
            label: '男'
          },
          {
            value: 'female',
            label: '女',
            type: 'danger'
          }] },
          { prop: 'orgName', label: '归属组织' },
          { prop: 'createTime', label: '创建时间' }
        ]
      },
      pagination: {},
      sorts: {},
      statusOptions: statusOptions

    }
  },
  watch: {
    clientHeight() {
      this.changeFixed(this.clientHeight)
    },
    id: {
      handler: function(val, oldVal) {
        if (this.$utils.isNotEmpty(val) && val !== oldVal) {
          this.search()
        }
      },
      immediate: true
    }
  },
  created() {
    this.clientHeight = `${document.documentElement.clientHeight}` - (this.$store.getters.isSuper ? 215 : 150)
  },
  methods: {
    changeFixed(clientHeight) {
      this.$refs.relation.style.height = clientHeight + 'px'
    },
    // 加载数据
    loadData() {
      this.loading = true
      querySuperiorPageList(this.getSearcFormData()).then(response => {
        ActionUtils.handleListData(this, response.data)
        this.$emit('callbackSuperior', response.data['dataResult'])
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    /**
     * 获取格式化参数
     */
    getSearcFormData() {
      const params = this.$refs['crud'] ? this.$refs['crud'].getSearcFormData() : {}
      params['Q^SUB_PID_^S'] = this.id
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
    handleAction(buttonKey, position, selection, data) {
      switch (buttonKey) {
        case 'search':// 查询
          this.loadData()
          break
        default:
          break
      }
    }
  }
}
</script>

