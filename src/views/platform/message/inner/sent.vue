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
      @column-link-click="handleColumnLink"
    >
      <template slot="handIcon" slot-scope="scope">
        <el-tooltip v-if="!scope.row.receiverTime" class="item" effect="dark" content="未读" placement="bottom">
          <i class="ibps-icon-envelope-o" />
        </el-tooltip>
        <el-tooltip v-else class="item" effect="dark" content="已读" placement="bottom">
          <i class="ibps-icon-envelope-open-o" />
        </el-tooltip>
        <el-tooltip v-if="scope.row.fileMsg" class="item" effect="dark" content="含附件" placement="bottom">
          <i class="ibps-icon-paperclip" />
        </el-tooltip>
      </template>
    </ibps-crud>
    <edit
      :id="editId"
      :title="title"
      :readonly="readonly"
      :visible="dialogFormVisible"
      @callback="search"
      @reply="reply"
      @close="visible => dialogFormVisible = visible"
    />
  </div>
</template>

<script>
import { querySentPageList, remove } from '@/api/platform/message/innerMessage'
import ActionUtils from '@/utils/action'
import FixHeight from '@/mixins/height'
import { typeOptions, renderHeader } from './constants'
import Edit from './detail/dialog'

export default {
  components: {
    Edit
  },
  mixins: [FixHeight],
  data() {
    return {
      dialogFormVisible: false, // 弹窗
      editId: '', // 编辑dialog需要使用
      pkKey: 'id', // 主键  如果主键不是pk需要传主键
      icon: 'envelope',
      title: '',
      loading: true,
      readonly: false,
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
            key: 'remove'
          }
        ],
        searchForm: {
          forms: [
            { prop: 'Q^subject_^SL', label: '主题' },
            { prop: 'Q^owner_^SL', label: '发送人' },
            {
              prop: 'Q^message_type_^SL',
              label: '消息类型',
              fieldType: 'select',
              options: typeOptions
            },
            { prop: ['Q^create_time_^DL', 'Q^create_time_^DG'], label: '发送时间', fieldType: 'daterange' }
          ]
        },
        // 表格字段配置
        columns: [
          { prop: 'stateIcon', label: '', slotName: 'handIcon', renderHeader: renderHeader, width: '60' },
          { prop: 'subject', label: '主题', link: 'dialog', sortable: 'custom' },
          { prop: 'ownerName', label: '发送人' },
          { prop: 'messageType', label: '消息类型', tags: typeOptions },
          { prop: 'createTime', label: '发送时间', dateFormat: 'yyyy-MM-dd HH:mm:ss' }
        ],
        rowHandle: {
          actions: [{
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
    reply(id) {
      this.editId = id
      this.repliFormVisible = true
    },
    // 加载数据
    loadData() {
      this.loading = true
      querySentPageList(this.getSearcFormData()).then(response => {
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
    handleColumnLink(column, row) {
      this.handleEdit(column.id, true)
      this.title = '发送信息明细'
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
            this.handleEdit(id, true)
            this.title = '信息明细'
          }).catch(() => { })
          break
        case 'remove':// 删除
          ActionUtils.removeRecord(selection).then((ids) => {
            this.handleRemove(ids)
          }).catch(() => { })
          break
        default:
          break
      }
    },
    /**
     * 处理明细
     */
    handleEdit(id = '', readonly) {
      this.editId = id
      this.readonly = readonly
      this.dialogFormVisible = true
    },
    /**
     * 处理删除
     */
    handleRemove(ids) {
      remove({ innerMessageIds: ids }).then(response => {
        ActionUtils.removeSuccessMessage()
        this.search()
      }).catch(() => {})
    }
  }
}
</script>

