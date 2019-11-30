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
      @column-link-click="handleLinkClick"
      @action-event="handleAction"
      @sort-change="handleSortChange"
      @pagination-change="handlePaginationChange"
    />
    <approve-dialog
      :visible="dialogFormVisible"
      :title="title"
      :task-id="editId"
      :action="action"
      class="bpm-task-dialog"
      @callback="search"
      @close="visible => dialogFormVisible = visible"
    />
    <!-- 人员选择器 -->
    <ibps-employee-selector-dialog
      :visible="selectorVisible"
      :value="[]"
      multiple
      @close="visible => selectorVisible = visible"
      @action-event="handleSelectorActionEvent"
    />

    <bpmn-formrender
      :visible="bpmnFormrenderDialogVisible"
      :task-id="editId"
      @callback="search"
      @close="visible => bpmnFormrenderDialogVisible = visible"
    />
  </div>
</template>

<script>
import { queryPageList, remove, batchSuspendProcess, batchRecoverProcess, assignee } from '@/api/platform/bpmn/bpmTask'
import ActionUtils from '@/utils/action'
import FixHeight from '@/mixins/height'
import { taskStatusOptions } from './constants'
import IbpsEmployeeSelectorDialog from '@/business/platform/org/employee/dialog'
import ApproveDialog from '@/business/platform/bpmn/task/approve'
import BpmnFormrender from '@/business/platform/bpmn/form/dialog'
export default {
  components: {
    IbpsEmployeeSelectorDialog,
    ApproveDialog,
    BpmnFormrender
  },
  mixins: [FixHeight],
  data() {
    return {
      dialogFormVisible: false, // 弹窗
      bpmnFormrenderDialogVisible: false, // 表单
      editId: '', // 编辑dialog需要使用
      action: 'agree', // 打开弹窗的动作
      pkKey: 'id', // 主键  如果主键不是pk需要传主键

      selectorVisible: false,
      ids: '',
      title: '',
      loading: true,
      height: document.clientHeight,

      listData: [],
      pagination: {},
      sorts: {},
      listConfig: {
        toolbars: [
          { key: 'search' },
          { key: 'agree', label: '同意', icon: 'ibps-icon-check-square-o' },
          { key: 'stop', label: '终止', icon: 'ibps-icon-stop' },
          { key: 'suspend', label: '挂起', icon: 'ibps-icon-ioxhost' },
          { key: 'recover', label: '恢复', icon: 'ibps-icon-ioxhost' },
          { key: 'assignee', label: '指定执行人', icon: 'ibps-icon-cog' }
        ],
        searchForm: {
          forms: [
            { prop: 'Q^subject_^SL', label: '请求标题' },
            { prop: 'Q^NAME_^SL', label: '任务名称' },
            {
              prop: 'Q^status_^S',
              label: '任务类型',
              fieldType: 'select',
              options: taskStatusOptions
            }, {
              prop: ['Q^CREATE_TIME_^DL', 'Q^CREATE_TIME_^DG'],
              label: '创建时间',
              fieldType: 'daterange'
            }
          ]
        },
        // 表格字段配置
        columns: [
          { prop: 'subject', label: '请求标题', link: 'dialog' },
          { prop: 'name', label: '任务名称', width: 200 },
          { prop: 'ownerName', label: '候选人', width: 200 },
          { prop: 'status', label: '任务类型', tags: taskStatusOptions, width: 120 },
          { prop: 'createTime', label: '创建时间', sortable: 'custom', width: 150 }
        ],
        rowHandle: {
          actions: [{
            key: 'assignee',
            label: '指定执行人',
            icon: 'ibps-icon-cog'
          }, {
            key: 'approve',
            label: '审批',
            icon: 'ibps-icon-edit'
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
        case 'stop':// 终止
          ActionUtils.selectedMultiRecord(selection).then((ids) => {
            this.handleBatchApprove(ids, 'stop')
            this.title = '批量终止流程'
          }).catch(() => { })
          break
        case 'agree':// 同意
          ActionUtils.selectedMultiRecord(selection).then((ids) => {
            this.handleBatchApprove(ids, 'agree')
            this.title = '批量同意审批'
          }).catch(() => { })
          break
        case 'suspend':// 挂起
          ActionUtils.selectedMultiRecord(selection).then((ids) => {
            this.handleSuspend(ids)
          }).catch(() => { })
          break
        case 'recover':// 恢复
          ActionUtils.selectedMultiRecord(selection).then((ids) => {
            this.handleRecover(ids)
          }).catch(() => { })
          break
        case 'assignee':// 指定执行人
          ActionUtils.selectedMultiRecord(selection).then((ids) => {
            this.handleAssignee(ids)
          }).catch(() => { })
          break
        case 'approve':// 审批
          ActionUtils.selectedMultiRecord(selection).then((ids) => {
            this.handleApprove(ids)
          }).catch(() => { })
          break
        default:
          break
      }
    },
    /**
     * 处理审批
     */
    handleBatchApprove(id = '', action = 'agree') {
      this.editId = id
      this.action = action
      this.dialogFormVisible = true
    },
    /**
     * 处理删除
     */
    handleRemove(ids) {
      remove({ levelIds: ids }).then(response => {
        ActionUtils.removeSuccessMessage()
        this.search()
      }).catch(() => {})
    },
    /**
     * 批量挂起任务
     */
    handleSuspend(ids) {
      this.$confirm('确认批量挂起流程任务？', '信息').then(() => {
        batchSuspendProcess({ taskIds: ids }).then(() => {
          ActionUtils.successMessage('挂起流程任务成功')
          this.search()
        }).catch(error => {
          console.log(error)
        })
      })
    },
    /**
     * 批量挂起任务
     */
    handleRecover(ids) {
      this.$confirm('确认批量恢复流程任务？', '信息').then(() => {
        batchRecoverProcess({ taskIds: ids }).then(() => {
          ActionUtils.successMessage('恢复流程任务成功')
          this.search()
        }).catch(error => {
          console.log(error)
        })
      })
    },
    /**
     * 指定执行人
     */
    handleAssignee(ids) {
      this.ids = ids
      this.selectorVisible = true
    },
    handleSelectorActionEvent(buttonKey, data) {
      switch (buttonKey) {
        case 'confirm':// 确定
          this.handleConfirm(data)
          break
      }
    },
    handleConfirm(data) {
      assignee({
        taskId: this.ids,
        userId: data.map((d) => { return d.id }).join(',')
      }).then(response => {
        this.selectorVisible = false
        this.$message.closeAll()
        this.$message({
          message: '指定执行人成功!',
          type: 'success'
        })

        this.search()
      })
    },
    /**
     * 审批
     */
    handleApprove(id) {
      this.bpmnFormrenderDialogVisible = true
      this.editId = id
    },
    handleLinkClick(data, columns) {
      this.handleApprove(data[this.pkKey])
    }
  }
}
</script>
<style lang="scss">
// .bpm-task-dialog{
//   .el-dialog__body{
//     height:  calc(27vh - 120px) !important;
//   }
// }
// .bpm-employee-dialog{
//   .el-dialog__body{
//     height:  calc(67vh - 140px) !important;
//   }
// }
</style>

