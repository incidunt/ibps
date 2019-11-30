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
      @pagination-change="handlePaginationChange"
    />
    <edit
      :id="editId"
      :title="title"
      :visible="dialogFormVisible"
      :readonly="readonly"
      @callback="search"
      @close="visible => dialogFormVisible = visible"
    />
  </div>
</template>

<script>
import { queryPageList, remove, setEnable } from '@/api/platform/bpmn/bpmAgent'
import ActionUtils from '@/utils/action'
import FixHeight from '@/mixins/height'
import { statusOptions, agentTypeOptions } from './constants'
import Edit from './edit'

export default {
  components: {
    Edit
  },
  mixins: [FixHeight],
  data() {
    return {
      dialogFormVisible: false, // 弹窗
      editId: '', // 编辑dialog需要使用
      readonly: false, // 是否只读
      pkKey: 'id', // 主键  如果主键不是pk需要传主键

      title: '',
      loading: true,
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
            key: 'add'
          },
          {
            key: 'edit'
          },
          {
            key: 'remove'
          }
        ],
        searchForm: {
          forms: [
            { prop: 'Q^TITLE_^SL', label: '标题' }, {
              prop: 'Q^DELEGATOR_ID_^S',
              label: '委托人'
            }, {
              prop: 'Q^IS_ENABLED_^S',
              label: '是否启用',
              fieldType: 'select',
              options: statusOptions
            }, {
              prop: 'Q^AGENT_TYPE_^S',
              label: '代理类型',
              fieldType: 'select',
              options: agentTypeOptions
            }
          ]
        },
        // 表格字段配置
        columns: [
          { prop: 'title', label: '标题' },
          { prop: 'delegatorName', label: '委托人' },
          { prop: 'agenterName', label: '代理人' },
          { prop: 'isEnabled', label: '是否启动', tags: statusOptions },
          { prop: 'effectiveTime', label: '生效时间', sortable: 'custom' },
          { prop: 'expiryTime', label: '失效时间', sortable: 'custom' },
          { prop: 'agentType', label: '代理类型', tags: agentTypeOptions }
        ],
        rowHandle: {
          actions: [{
            key: 'edit'
          }, {
            key: 'enabled',
            label: '启用',
            icon: 'ibps-icon-toggle-on',
            hidden: (rowData, index) => {
              return rowData.isEnabled === 'enabled'
            }
          }, {
            key: 'disabled',
            label: '禁用',
            icon: 'ibps-icon-toggle-off',
            hidden: (rowData, index) => {
              return rowData.isEnabled === 'disabled'
            }
          }, {
            key: 'remove'
          }, {
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
        case 'add':// 添加
          this.handleEdit()
          this.title = '添加流程代理'
          break
        case 'edit':// 编辑
          ActionUtils.selectedRecord(selection).then((id) => {
            this.handleEdit(id)
            this.title = '编辑流程代理'
          }).catch(() => { })
          break
        case 'detail':// 明细
          ActionUtils.selectedRecord(selection).then((id) => {
            this.handleEdit(id, true)
            this.title = '流程代理明细'
          }).catch(() => { })
          break
        case 'remove':// 删除
          ActionUtils.removeRecord(selection).then((ids) => {
            this.handleRemove(ids)
          }).catch(() => { })
          break
        case 'enabled':// 启用
          this.handleSetEnable(data.id, 'enabled')
          break
        case 'disabled':// 禁用
          this.handleSetEnable(data.id, 'disabled')
          break
        default:
          break
      }
    },
    /**
     * 处理编辑。
     */
    handleEdit(id = '', readonly = false) {
      this.editId = id
      this.readonly = readonly
      this.dialogFormVisible = true
    },
    /**
     * 处理删除
     */
    handleRemove(ids) {
      remove({ ids: ids }).then(response => {
        ActionUtils.removeSuccessMessage()
        this.search()
      }).catch(() => {})
    },
    handleSetEnable(id, status) {
      const params = { 'id': id, 'isEnabled': status }
      setEnable(params).then(response => {
        ActionUtils.removeSuccessMessage(response.message)
        this.search()
      }).catch(() => {})
    }
  }
}
</script>

