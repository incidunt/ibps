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
      @column-link-click="handleLinkClick"
      @sort-change="handleSortChange"
      @pagination-change="handlePaginationChange"
    />
    <edit
      :id="editId"
      :title="title"
      :readonly="readonly"
      :visible="dialogFormVisible"
      @callback="search"
      @close="visible => dialogFormVisible = visible"
    />
    <bpmn-formrender
      :visible="formrenderDialogFormVisible"
      :instance-id="instanceId"
      :task-change-id="editId"
      @close="visible => formrenderDialogFormVisible = visible"
    />
  </div>
</template>

<script>
import { queryPageList, setStatus } from '@/api/platform/bpmn/bpmTaskChange'
import ActionUtils from '@/utils/action'
import FixHeight from '@/mixins/height'
import { typeOptions, statusOptions } from './constants'
import Edit from '@/business/platform/bpmn/task-change/edit'
import BpmnFormrender from '@/business/platform/bpmn/form/dialog'

export default {
  components: {
    Edit,
    BpmnFormrender
  },
  mixins: [FixHeight],
  data() {
    return {
      dialogFormVisible: false, // 弹窗
      editId: '', // 编辑dialog需要使用

      formrenderDialogFormVisible: false,
      instanceId: '',

      title: '',
      loading: true,
      height: document.clientHeight,
      readonly: false,
      pkKey: 'id', // 主键  如果主键不是pk需要传主键

      listData: [],
      pagination: {},
      sorts: {},
      listConfig: {
        toolbars: [
          {
            key: 'search'
          }
        ],
        searchForm: {
          forms: [
            { prop: 'Q^TASK_SUBJECT_^SL', label: '事项标题', itemWidth: 200 },
            { prop: 'Q^TASK_NAME_^SL', label: '任务名称', itemWidth: 200 },
            {
              prop: 'Q^CHANGE_TYPE_^SL',
              label: '更改类型',
              fieldType: 'select',
              options: typeOptions,
              itemWidth: 200
            },
            {
              prop: 'Q^STATUS_^SL',
              label: '状态',
              fieldType: 'select',
              options: statusOptions,
              itemWidth: 200
            },
            { prop: ['Q^CREATE_TIME_^DL', 'Q^CREATE_TIME_^DG'], label: '创建时间', fieldType: 'daterange', itemWidth: 200 }
          ]
        },
        // 表格字段配置
        columns: [
          { prop: 'taskSubject', label: '事项标题', link: 'dialog' },
          { prop: 'taskName', label: '任务名称', width: 250 },
          { prop: 'changeType', label: '更改类型', tags: typeOptions, width: 150 },
          { prop: 'status', label: '状态', tags: statusOptions, width: 150 },
          { prop: 'createTime', label: '创建时间', width: 140 }
        ],
        rowHandle: {
          actions: [{
            key: 'revoke',
            label: '撤回',
            icon: 'ibps-icon-cancel',
            hidden: function(row, index) {
              if (row.ownerId === this.$store.getters.userId && row.status === 'running') return false
              return true
            }
          }, {
            key: 'detail',
            hidden: function(row, index) {
              if (row.ownerId === this.$store.getters.userId) return false
              return true
            }
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
        case 'revoke':// 撤消
          ActionUtils.selectedRecord(selection).then((id) => {
            this.handleRevoke(id)
          }).catch(() => { })
          break
        case 'detail':// 明细
          ActionUtils.selectedRecord(selection).then((id) => {
            this.handleEdit(id, true)
            this.title = '转办代理明细'
          }).catch(() => { })
          break
        default:
          break
      }
    },
    // 处理撤回
    handleRevoke(id) {
      this.$confirm('确定撤回？', this.$t('common.dialog.title'), {
        type: 'warning'
      }).then(() => {
        setStatus({
          id: id,
          status: 'cancel'
        }).then(response => {
          ActionUtils.successMessage('撤回任务成功')
          this.search()
        }).catch(() => {
        })
      }).catch(() => {

      })
    },
    /**
     * 处理编辑
     */
    handleEdit(id = '', readonly = true) {
      this.editId = id
      this.readonly = readonly
      this.dialogFormVisible = true
    },
    handleLinkClick(data, columns) {
      this.editId = data.id
      this.instanceId = data.procInstId
      this.formrenderDialogFormVisible = true
    }
  }
}
</script>

