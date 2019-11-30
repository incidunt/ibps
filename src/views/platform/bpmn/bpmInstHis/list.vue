<template>
  <div class="main-container">
    <ibps-crud
      ref="crud"
      :height="height"
      :data="listData"
      :toolbars="listConfig.toolbars"
      :search-form="listConfig.searchForm"
      :pk-key="pkKey"
      :columns="listConfig.columns"
      :row-handle="listConfig.rowHandle"
      :pagination="pagination"
      :loading="loading"
      :index-row="false"
      @action-event="handleAction"
      @sort-change="handleSortChange"
      @column-link-click="handleLinkClick"
      @pagination-change="handlePaginationChange"
    />
    <bpmn-formrender
      :visible="dialogFormVisible"
      :instance-id="instanceId"
      @close="visible => dialogFormVisible = visible"
    />
  </div>
</template>

<script>
import { queryPageList } from '@/api/platform/bpmn/bpmInstHis'
import ActionUtils from '@/utils/action'
import FixHeight from '@/mixins/height'
import { searchOptions, resultTypeOptions, statusOptions } from './constants'
import BpmnFormrender from '@/business/platform/bpmn/form/dialog'

export default {
  components: {
    BpmnFormrender
  },
  mixins: [FixHeight],
  data() {
    return {
      dialogFormVisible: false, // 弹窗
      instanceId: '', // 编辑dialog需要使用
      pkKey: 'id', // 主键  如果主键不是pk需要传主键

      title: '',
      loading: true,
      height: document.clientHeight,

      listData: [],
      pagination: {},
      sorts: {},
      listConfig: {
        toolbars: [
          { key: 'search' }
        ],
        searchForm: {
          forms: [
            { prop: 'Q^subject_^SL', label: '实例标题' },
            { prop: 'Q^proc_def_name_^SL', label: '流程名称' },
            {
              prop: 'Q^status_^S',
              label: '实例状态',
              fieldType: 'select',
              options: searchOptions
            }
          ]
        },
        // 表格字段配置
        columns: [
          { prop: 'subject', label: '实例标题', link: 'dialog', width: 250 },
          { prop: 'procDefName', label: '流程名称' },
          { prop: 'createTime', label: '创建时间', sortable: 'custom', dateFormat: 'yyyy-MM-dd HH:mm:ss' },
          { prop: 'endTime', label: '结束时间', sortable: 'custom', dateFormat: 'yyyy-MM-dd HH:mm:ss' },
          { prop: 'duration', label: '持续时间', filter: 'duration', width: 120 },
          { prop: 'resultType', label: '审批结果', tags: resultTypeOptions, width: 120 },
          { prop: 'status', label: '状态', tags: statusOptions, width: 120 }
        ],
        rowHandle: {
          actions: [{
            key: 'detail'
          }]
        }
      }
    }
  },
  created() {
    this.loadData()
  },
  methods: {
    // 加载数据
    loadData() {
      this.loading = true
      queryPageList(this.getSearcFormData()).then(response => {
        ActionUtils.handleListData(this, response.data)
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    /**
     * 获取格式化参数
     */
    getSearcFormData() {
      return ActionUtils.formatParams(
        this.$refs['crud'] ? this.$refs['crud'].getSearcFormData() : {},
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
    handleLinkClick(data, columns) {
      this.handleEdit(data.id)
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
        case 'detail':// 明细
          ActionUtils.selectedRecord(selection).then((id) => {
            this.handleEdit(id)
            this.title = '信息'
          }).catch(() => { })
          break
        default:
          break
      }
    },
    /**
     * 处理编辑
     */
    handleEdit(id = '') {
      this.instanceId = id
      this.dialogFormVisible = true
    }
  }
}
</script>

