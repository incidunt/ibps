<template>
  <div class="receive-container">
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
      @pagination-change="handlePaginationChange"
    >
      <template slot="handIcon" slot-scope="scope">
        <i v-if="!scope.row.receiverTime" class="ibps-icon-envelope-o" />
        <i v-else class="ibps-icon-envelope" />
      </template>
      <template slot="procDefIdSelect">
        <bpm-definition-selector
          style="width:200px;display:block;"
          :multiple="false"
          @input="getProcDefId"
          @callback="data => formId= data.id"
        />
      </template>
      <template slot="notifierSelect">
        <ibps-employee-selector v-model="notifier" style="width:200px;" />
      </template>
    </ibps-crud>
    <edit
      :id="editId"
      :title="title"
      :visible="dialogFormVisible"
      @callback="search"
      @close="visible => dialogFormVisible = visible"
    />
  </div>
</template>

<script>
import { queryPageList, readAll } from '@/api/platform/bpmn/bpmOperNotify'
import BpmDefinitionSelector from '@/business/platform/bpmn/definition/selector'
import IbpsEmployeeSelector from '@/business/platform/org/employee/selector'
import ActionUtils from '@/utils/action'
import FixHeight from '@/mixins/height'
import Edit from './edit'

export default {
  components: {
    Edit,
    BpmDefinitionSelector,
    IbpsEmployeeSelector
  },
  mixins: [FixHeight],
  data() {
    return {
      dialogFormVisible: false, // 弹窗
      editId: '', // 编辑dialog需要使用
      pkKey: 'id', // 主键  如果主键不是pk需要传主键
      title: '',
      formId: '',
      notifier: '',
      procDefId: '',
      loading: true,
      isEnvelope: true,
      link: false,
      height: document.clientHeight,
      listData: [],
      pagination: {},
      sorts: {},
      listConfig: {
        toolbars: [
          {
            key: 'search'
          },
          {
            key: 'markRead',
            icon: 'ibps-icon-check-circle',
            label: '标记为已读'
          }
        ],
        searchForm: {
          forms: [
            // TODO 点击弹出选择器 尾部添加icon并附带相应功能[流程定义,通知人]
            { prop: 'Q^PROC_DEF_ID_^S', label: '流程定义', fieldType: 'slot', slotName: 'procDefIdSelect' },
            { prop: 'Q^NOTIFIER_^S', label: '通知人', fieldType: 'slot', slotName: 'notifierSelect' },
            {
              prop: ['Q^CREATE_TIME_^DL', 'Q^CREATE_TIME_^DG'],
              label: '通知时间',
              fieldType: 'daterange',
              itemWidth: 200
            }
          ]
        },
        // 表格字段配置
        columns: [
          { prop: 'stateIcon', label: '', slotName: 'handIcon', width: '50' },
          { prop: 'notifyTitle', label: '通知标题', sortable: 'custom' },
          { prop: 'procDefName', label: '流程定义' },
          { prop: 'nodeName', label: '节点' },
          { prop: 'notifierName', label: '通知人' },
          { prop: 'createTime', label: '通知时间' }
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
    getProcDefId(data) {
      this.procDefId = data
    },
    // 加载数据
    loadData() {
      this.loading = true
      queryPageList(this.getSearcFormData()).then(response => {
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
      const params = this.$refs['crud'] ? this.$refs['crud'].getSearcFormData() : {}
      params['Q^PROC_DEF_ID_^S'] = this.procDefId
      params['Q^NOTIFIER_^S'] = this.notifier
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
        case 'markRead':// 标记为已读
          ActionUtils.selectedMultiRecord(selection).then((id) => {
            this.handleAlreadyRead(id)
          }).catch(() => { })
          break
        case 'detail':// 明细
          ActionUtils.selectedRecord(selection).then((id) => {
            this.handleEdit(id, true)
            this.title = '抄送明细'
          }).catch(() => { })
          break
        default:
          break
      }
    },
    /**
     * 标记为已读
     */
    handleAlreadyRead(ids) {
      readAll({ ids: ids }).then(response => {
        this.$message.closeAll()
        this.$message({
          message: '标记成功！',
          type: 'success'
        })
        this.search()
      }).catch(() => {})
    },
    /**
     * 处理明细
     */
    handleEdit(id = '') {
      this.editId = id
      this.dialogFormVisible = true
    }
  }
}
</script>

