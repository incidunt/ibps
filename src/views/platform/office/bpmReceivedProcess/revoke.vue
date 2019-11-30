<template>
  <ibps-layout ref="layout">
    <div slot="west">
      <ibps-type-tree
        :width="width"
        :height="height"
        :has-contextmenu="true"
        title="流程分类"
        category-key="FLOW_TYPE"
        @node-click="handleNodeClick"
        @expand-collapse="handleExpandCollapse"
      />
    </div>
    <ibps-crud
      ref="crud"
      :style="{ marginLeft: width+'px' }"
      :height="height"
      :data="listData"
      :toolbars="listConfig.toolbars"
      :search-form="listConfig.searchForm"
      :pk-key="pkKey"
      :columns="listConfig.columns"
      :row-handle="listConfig.rowHandle"
      :pagination="pagination"
      :loading="loading"
      :selection-row="false"
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
    <revocation-dialog
      :visible="revocationDialogVisible"
      :title="title"
      :task-id="taskId"
      action="撤销"
      @callback="search"
      @close="visible => revocationDialogVisible = visible"
    />
  </ibps-layout>
</template>
<script>
import { revokable } from '@/api/platform/office/bpmReceived'
import ActionUtils from '@/utils/action'
import FixHeight from '@/mixins/height'
import IbpsTypeTree from '@/business/platform/cat/type/tree'
import BpmnFormrender from '@/business/platform/bpmn/form/dialog'
import revocationDialog from '@/business/platform/bpmn/task/revocation'

export default {
  components: {
    IbpsTypeTree,
    revocationDialog,
    BpmnFormrender
  },
  mixins: [FixHeight],
  data() {
    return {
      width: 200,
      height: document.clientHeight,
      dialogFormVisible: false, // 弹窗
      revocationDialogVisible: false,
      instanceId: '', // 编辑dialog需要使用

      taskId: '', // 编辑dialog需要使用
      title: '',

      pkKey: 'id', // 主键  如果主键不是pk需要传主键
      typeId: '',
      loading: false,
      listData: [],
      listConfig: {
        // 工具栏
        toolbars: [
          { key: 'search' }
        ],
        // 查询条件
        searchForm: {
          forms: [
            { prop: 'Q^subject_^SL', name: 'Q^wfInst.subject_^SL', label: '请求标题' },
            { prop: 'Q^proc_def_name_^SL', name: 'Q^wfInst.proc_def_name_^SL', label: '流程名称' },
            {
              prop: ['Q^end_time_^DL', 'Q^end_time_^DG'],
              name: ['Q^ec.end_time_^DL', 'Q^ec.end_time_^DG'],
              label: '审批时间',
              fieldType: 'daterange'
            }
          ]
        },
        // 表格字段配置
        columns: [
          { prop: 'subject', label: '请求标题', link: 'dialog' },
          { prop: 'procDefName', label: '流程名称', width: 120 },
          { prop: 'myNode', label: '我审批得节点', width: 120 },
          { prop: 'taskEndTime', label: '审批时间', width: 140, dateFormat: 'yyyy-MM-dd HH:mm:ss' },
          { prop: 'curNode', label: '当前审批节点', width: 120 }
        ],
        // 管理列
        rowHandle: {
          actions: [
            {
              key: 'revoke',
              label: '撤销',
              icon: 'ibps-icon-send'
            }
          ]
        }
      },
      pagination: {},
      sorts: {}
    }
  },
  created() {
    this.loadData()
  },
  methods: {
    /**
     * 撤销
     */
    handleRevoke(id = '') {
      this.taskId = id
      this.revocationDialogVisible = true
    },
    /**
     * 加载数据
     */
    loadData() {
      this.loading = true
      revokable(this.getFormatParams()).then(response => {
        ActionUtils.handleListData(this, response.data)
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    /**
     * 获取格式化参数
     */
    getFormatParams() {
      const params = this.$refs['crud'] ? this.$refs['crud'].getSearcFormData() : {}
      if (this.$utils.isNotEmpty(this.typeId)) {
        params['Q^TYPE_ID_^S'] = this.typeId
      }
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
    search() {
      ActionUtils.setPagination(this.pagination)
      this.loadData()
    },
    /**
     * 重置查询条件
     */
    reset() {
      this.$refs['crud'].handleReset()
    },
    /**
     * 点击表格
     */
    handleLinkClick(data) {
      this.instanceId = data.id || ''
      this.dialogFormVisible = true
    },
    /**
     * 处理按钮事件
     */
    handleAction(command, position, selection, data) {
      switch (command) {
        case 'search':// 查询
          this.loadData()
          break
        case 'revoke':
          ActionUtils.selectedRecord(selection).then((id) => {
            this.title = '撤销任务'
            this.handleRevoke(data.taskId)
          }).catch(() => { })
          break
        default:
          break
      }
    },
    handleNodeClick(typeId) {
      this.typeId = typeId
      this.loadData()
    },
    handleExpandCollapse(isExpand) {
      this.width = isExpand ? 230 : 30
    }
  }
}
</script>
