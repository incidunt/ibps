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
      @column-link-click="handleLinkClick"
      @pagination-change="handlePaginationChange"
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
    <!-- 明细 -->
    <detail
      :id="editId"
      :title="title"
      :readonly="readonly"
      :visible="dialogFormVisible"
      @callback="search"
      @close="visible => dialogFormVisible = visible"
    />
    <!-- 回复 -->
    <reply
      :id="editId"
      :title="title"
      :visible="repliFormVisible"
      @callback="search"
      @close="visible => repliFormVisible = visible"
    />
  </div>
</template>

<script>
import { queryReceivePageList, remove, markRead } from '@/api/platform/message/innerMessage'
import ActionUtils from '@/utils/action'
import FixHeight from '@/mixins/height'
import { typeOptions, renderHeader } from './constants'
import Detail from './detail/dialog'
import Reply from './reply'

export default {
  components: {
    Detail,
    Reply
  },
  mixins: [FixHeight],
  data() {
    return {
      dialogFormVisible: false, // 弹窗
      repliFormVisible: false, // 弹窗
      editId: '', // 编辑dialog需要使用
      pkKey: 'id', // 主键  如果主键不是pk需要传主键
      title: '',
      loading: true,
      isEnvelope: true,
      link: false,
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
          },
          {
            key: 'markRead',
            icon: 'ibps-icon-check-circle',
            label: '标记为已读'
          }
        ],
        searchForm: {
          forms: [
            { prop: 'Q^subject^SL', label: '主题' },
            { prop: 'Q^ownerName^SL', label: '发送人' },
            {
              prop: 'Q^messageType^SL',
              label: '消息类型',
              fieldType: 'select',
              options: typeOptions
            },
            { prop: ['Q^beginreceiveTime^DL', 'Q^endreceiveTime^DG'], label: '发送时间', fieldType: 'daterange' }
          ]
        },
        // 表格字段配置
        columns: [
          { prop: 'stateIcon', label: '', slotName: 'handIcon', width: '65', renderHeader: renderHeader },
          { prop: 'subject', label: '主题', link: 'dialog', sortable: 'custom' },
          { prop: 'ownerName', label: '发送人' },
          { prop: 'messageType', label: '消息类型', tags: typeOptions },
          { prop: 'createTime', label: '发送时间', dateFormat: 'yyyy-MM-dd HH:mm:ss' }
        ],
        rowHandle: {
          actions: [{
            key: 'reply',
            icon: 'ibps-icon-reply-all',
            label: '回复',
            hidden: function(row, index) {
              return row.canreply === '1' || row.messageType === 'system' || row.messageType === 'bulletin'
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
      queryReceivePageList(this.getSearcFormData()).then(response => {
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
      this.handleEdit(data.id, true)
      this.title = '信息明细'
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
            // this.isEnvelope = false
          }).catch(() => { })
          break
        case 'reply':// 回复
          ActionUtils.selectedRecord(selection).then((id) => {
            this.handleReply(id)
            this.title = '信息回复'
          }).catch(() => { })
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
     * 标记为已读
     */
    handleAlreadyRead(ids) {
      markRead({ innerMessageIds: ids }).then(response => {
        this.$message.closeAll()
        this.$message({
          message: '标记已读成功',
          type: 'success'
        })
        this.search()
      }).catch(() => {})
    },
    /**
     * 处理回复
     */
    handleReply(id = '') {
      this.editId = id
      this.repliFormVisible = true
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

