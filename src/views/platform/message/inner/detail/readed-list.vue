<template>
  <ibps-crud
    ref="crud"
    :data="listData"
    :toolbars="listConfig.toolbars"
    :search-form="listConfig.searchForm"
    :columns="listConfig.columns"
    :pagination="pagination"
    :loading="loading"
    :selection-row="false"
    @sort-change="handleSortChange"
    @pagination-change="handlePaginationChange"
  />
</template>
<script>
import ActionUtils from '@/utils/action'
import { getReadPageList } from '@/api/platform/message/innerMessage'
export default {
  props: {
    id: String
  },
  data() {
    return {
      loading: true,
      listData: [],
      pkKey: 'id', // 主键  如果主键不是pk需要传主键
      listConfig: {
        toolbars: [],
        searchForm: {},
        // 表格字段配置
        columns: [
          { prop: 'receiver', label: '已读人员' },
          { prop: 'receiverTime', label: '读取时间', dateFormat: 'yyyy-MM-dd' }
        ]
      },
      pagination: {},
      Sorts: {}
    }
  },
  created() {
    this.loadData()
  },
  methods: {
    // 加载已回复数据
    loadData() {
      this.loading = true
      getReadPageList(this.getSearcFormData()).then(response => {
        ActionUtils.handleListData(this, response.data)
        console.log(response.data)
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    /**
     * 获取格式化参数
     */
    getSearcFormData() {
      return ActionUtils.formatParams({
        'Q^MSG_ID_^S': this.id
      }, this.pagination, this.sorts)
    },
    /**
     * 处理已回复分页事件
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
    }
  }
}
</script>
