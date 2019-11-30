<template>
  <div>
    <ibps-crud
      ref="crud"
      :data="listData"
      :pk-key="pkKey"
      :toolbars="listConfig.toolbars"
      :search-form="listConfig.searchForm"
      :columns="listConfig.columns"
      :row-handle="listConfig.rowHandle"
      :pagination="pagination"
      :loading="loading"
      @column-link-click="handleColumnLink"
      @action-event="handleAction"
      @sort-change="handleSortChange"
      @pagination-change="handlePaginationChange"
    >
      <template slot="status" slot-scope="scope">
        <el-tag :type="scope.row.status | optionsFilter(statusOptions)">{{ scope.row.status|statusLabelFilter(statusOptions,'label') }}</el-tag>
      </template>
    </ibps-crud>
    <edit
      :visible="dialogFormVisible"
      :edit-id="editId"
      @callback="search"
      @close="visible => dialogFormVisible = visible"
    />
  </div>
</template>

<script>
import { queryPageList, remove } from '@/api/demo/list'
import ActionUtils from '@/utils/action'
import { statusOptions } from './constants'
import Edit from './edit'

export default {
  components: {
    Edit
  },
  data() {
    return {
      dialogFormVisible: false, // 弹窗
      editId: '', // 编辑dialog需要使用
      loading: true,
      // 列表配置
      pkKey: 'id', // 主键  如果主键不是pk需要传主键
      listData: [],
      listConfig: {
        // 工具栏
        toolbars: [
          { key: 'search' },
          { key: 'add' },
          { key: 'edit' },
          { key: 'remove' },
          { key: 'custom', icon: 'ibps-icon-cog', label: '自定义按钮' }
        ],
        // 查询条件
        searchForm: {
          forms: [
            { prop: 'name', label: '名称' },
            { prop: ['start_display_time', 'end_display_time'], label: '时间', fieldType: 'daterange' },
            { prop: 'status', label: '状态',
              fieldType: 'select',
              options: statusOptions
            }
          ]
        },
        // 表格字段配置
        columns: [
          { prop: 'title', label: '标题', link: 'www.baidu.com' },
          { prop: 'author', label: '姓名' },
          { prop: 'status', label: '状态', tags: statusOptions },
          { prop: 'pageviews', label: '浏览量', sortable: 'custom' },
          { prop: 'display_time', label: '日期' }
        ],
        // 管理列
        rowHandle: {
          actions: [
            { key: 'detail' },
            { key: 'edit' },
            { key: 'remove' },
            { key: 'custom', icon: 'ibps-icon-cog', label: '自定义按钮' }
          ]
        }
      },
      pagination: {},
      sorts: {},

      statusOptions: statusOptions

    }
  },
  created() {
    this.loadData()
  },
  methods: {
    /**
     * 加载数据
     */
    loadData() {
      this.loading = true
      queryPageList(this.getFormatParams()).then(response => {
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
      let formParams = {}
      if (this.$refs['crud']) {
        formParams = this.$refs['crud'].getSearcFormData() || {}
      }
      // 和分页数据合并
      return ActionUtils.formatParams(formParams, this.pagination, this.sorts)
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
      this.loadData()
    },
    /**
     * 获取选中值
     *
     */
    getSelections() {
      return this.$refs['crud'].$selections
    },
    /**
     * 重置查询条件
     */
    reset() {
      this.$refs['crud'].resetSearch()
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
          break
        case 'edit':// 编辑
        case 'detail':// 明细
          ActionUtils.selectedRecord(selection).then((id) => {
            this.handleEdit(id)
          }).catch(() => { })
          break
        case 'remove':// 添加
          ActionUtils.removeRecord(selection).then((ids) => {
            this.handleRemove(ids)
          }).catch(() => { })
          break

        case 'custom':// 自定义按钮
          ActionUtils.selectedMultiRecord(selection).then((ids) => {
            this.$alert(ids)
          }).catch(() => { })
          break
        default:
          break
      }
    },
    /**
     * 处理编辑
     */
    handleEdit(editId) {
      this.editId = editId || ''
      this.dialogFormVisible = true
    },
    /**
     * 处理删除
     */
    handleRemove(ids) {
      // 获取数据
      remove({ ids: ids }).then(response => {
        ActionUtils.removeSuccessMessage()
        this.search()
      }).catch(() => {

      })
    },
    /**
     * 前置事件
     *
     * @before-action-event="beforeActionEvent"
     */
    beforeActionEvent(key, position, data, callback) {
      callback(true)
    },
    /**
     * 处理点击链接
     */
    handleColumnLink(data, column) {
      this.handleEdit(data.id)
    }
  }
}
</script>

